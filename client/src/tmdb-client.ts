import { MediaDetails, ListDetails, TmdbV3Api, GetApiConfigurationResponse, TmdbMovie, TmdbMedia, AccountDetails, AccountGetDetailsRequest, RatedMovie, RatedTvShow } from "tmdb-v3"
import { TmdbV3Client, } from "./tmdb/v3/client"
import { promiseEach, tryParseInt, setMinus } from "./utils/utils"
import { App } from "./app";

export class TmdbClient extends TmdbV3Client {
    constructor() {
        super();
        console.log("TmdbClient ctor", this);
        let base = this.proxy.onInvoke;
        this.proxy.onInvoke = pc => {
            if (this.hasSessionId()) {
                let prm = pc.args[0];
                if (prm == null) {
                    prm = {};
                    pc.args[0] = prm;
                }
                if (prm.session_id == null && this.session_id != null)
                    prm.session_id = this.session_id;
                if (prm.account_id == null && this.account_id != null)
                    prm.account_id = this.account_id;
            }
            return base(pc).then(t => this.fixResponse(t, pc.name));
        };
    }
    app: App;
    account: AccountDetails;
    tvShowWatchlistIds = new Set<number>();
    movieWatchlistIds = new Set<number>();

    async init(): Promise<any> {
        this.configuration = await this.getApiConfiguration({});
        await this.onLogin();
    }

    async onLogin(): Promise<any> {
        //TEMP: await this.accountGetDetails();
        //console.log("onLogin finished", { rated: this.rated });

        //return Promise.resolve()
        //    .then(() => this.accountGetDetails())
        //    //.then(() => this.getCreateTmdbWatchedList())
        //    //.then(() => this.accountGetRatedMovies({}))
        //    //.then(t => this.ratedMovies = t.results)
        //    //.then(() => this.accountGetRatedTVShows({}))
        //    //.then(t => this.ratedTvShows = t.results)
        //    .then(() => console.log("onLogin finished", { rated: this.rated, /*watchedList: this.watchedList*/ }))
        //    ;
    }
    //ratedMovies: RatedMovie[];
    //ratedTvShows: RatedTvShow[];

    async accountGetDetails(req?: AccountGetDetailsRequest): Promise<AccountDetails> {
        try {
            this.account = await super.accountGetDetails(req);
            if (this.account != null)
                this.account_id = this.account.id;
            return this.account;
        }
        catch (e) {
            console.warn("accountGetDetails failed", e);
        }
    }

    configuration: GetApiConfigurationResponse;
    detectMediaType(media: TmdbMedia, methodName: string): boolean {
        if (media.media_type != null)
            return true;
        methodName = methodName.toLowerCase();
        if (methodName.startsWith("tv"))
            media.media_type = "tv";
        else if (methodName.startsWith("movie"))
            media.media_type = "movie";
        else if (methodName.contains("tv"))
            media.media_type = "tv";
        else if (methodName.contains("movie"))
            media.media_type = "movie";
        else
            console.log("unknown media type", { media, methodName });

    }
    fixResponse(res: any, methodName: string): any {
        if (res == null || typeof (res) != "object")
            return res;
        let movie = res as TmdbMedia;
        let props: Array<keyof TmdbMedia> = ["poster_path", "backdrop_path"];
        props.forEach(prop => {
            if (movie[prop] == null)
                return;
            this.detectMediaType(movie, methodName);
            let urlProp = prop.replace("_path", "_url");
            let imagesProp = prop.replace("_path", "");
            movie[urlProp] = this.getImageUrl(movie, prop);
            let images = movie[imagesProp];
            if (images == null) {
                images = {};
                movie[imagesProp] = images;
            }
            this.getImageSizes(prop).forEach(size => images[size] = this.getImageUrl(movie, prop, size));
        });
        Object.values(res).forEach((t: any) => this.fixResponse(t, methodName));
        return res;

    }


    getImageSizes(prop: keyof TmdbMedia): string[] {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (prop == "backdrop_path")
            return c.backdrop_sizes;
        else if (prop == "poster_path")
            return c.poster_sizes;
        return null;
    }
    getImageUrl(movie: TmdbMedia, prop: keyof TmdbMedia, size?: string): string {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (size == null)
            size = this.getImageSizes(prop)[0];
        return `${c.base_url}${size}${movie[prop]}`;
    }

    storage: GeneralStorage = localStorage;

    get request_token(): string { return this.storage.tmdb_request_token; }
    set request_token(value: string) { this.storage.tmdb_request_token = value; }

    get session_id(): string { return this.storage.tmdb_session_id; }
    set session_id(value: string) { this.storage.tmdb_session_id = value; }

    get account_id(): number { return tryParseInt(this.storage.tmdb_account_id); }
    set account_id(value: number) { this.storage.tmdb_account_id = String(value); }

    hasSessionId() {
        return this.session_id != null && this.session_id != "";
    }
    async loginToTmdb(): Promise<any> {
        await this._loginToTmdb();
        await this.onLogin(); //.then(t => this.onLogin());//.accountGetDetails()).then(t => this.getCreateTmdbWatchedList());
    }
    _loginToTmdb(): Promise<any> {
        //if (this.hasSessionId())
        //    return Promise.resolve();
        return new Promise<any>((resolve, reject) => {
            window.addEventListener("message", e => {
                console.log("messsage", e.data, e);
                let x: TmdbLoginPagePrms = e.data;
                if (x.approved != "true") {
                    reject();
                    return;
                }
                this.authenticationCreateSession({ request_token: x.request_token })
                    .then(e => {
                        console.log("session", e);
                        if (!e.success) {
                            reject();
                            return;
                        }
                        this.session_id = e.session_id;
                        resolve();
                    });
            });
            this.authenticationCreateRequestToken({}).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?request_token=" + this.request_token);
            });
        });
    }

    getMovieOrTvByTypeAndIdCache: Map<string, MediaDetails> = new Map<string, MediaDetails>();

    async getMovieOrTvByTypeAndId(typeAndId: string): Promise<MediaDetails> {
        if (typeAndId == null)
            return null;
        let media = this.getMovieOrTvByTypeAndIdCache.get(typeAndId);
        if (media !== undefined)
            return media;

        let tokens = typeAndId.split("|");
        if (tokens.length < 2)
            return null;

        let media_type = tokens[0];
        let id = tokens[1];
        if (media_type == "movie")
            media = await this.movieGetDetails({ movie_id: id as any, }) as MediaDetails; //append_to_response: "account_states" 
        else if (media_type == "tv")
            media = await this.tvGetDetails({ tv_id: id as any, }) as MediaDetails; //append_to_response: "account_states"
        this.getMovieOrTvByTypeAndIdCache.set(typeAndId, media);
        return media;
    }

    //watchedList: ListDetails;
    isWatchedOrRated(typeAndId: string): boolean {
        if (typeAndId == null)
            return null;
        if (this.rated.has(typeAndId))
            return true;
        if (this.watched.has(typeAndId))
            return true;
        return false; //this.watchedList != null && this.watchedList.items.find(t => t.id == media_id) != null;
    }
    failed:any[] = [];
    rated = new Set<string>();
    watched = new Set<string>();

    async markAsWatched(typeAndId: string, watched: boolean = true, refreshList?: boolean): Promise<any> {
        //let media = this.app.getMedia(typeAndId);
        ////return media.getInfo().then(() => {
        //if (media.info.watched != watched) {
        //    media.info.watched = true;
        //    return media.saveInfo();
        //}
        //return Promise.resolve();
        //});
        //if (this.watchedList == null)
        //    throw new Error();
        //if (this.watched.has(media_id))
        //    return Promise.resolve();
        //return this.invoke(t => t.listAddMovie({ list_id: this.watchedList.id, body: { media_id: media_id } }))
        //    .then(e => console.log(e), e => this.failed.push({ id: media_id, e }))
        //    .then(() => refreshList && this.refreshTmdbWatchedList());
    }
    //getCreateTmdbWatchedList(): Promise<ListDetails> {
    //    if (this.watchedList != null)
    //        return Promise.resolve(this.watchedList);
    //    return this.refreshTmdbWatchedList();
    //}
    //refreshTmdbWatchedList(): Promise<ListDetails> {
    //    return this.getCreateTmdbWatchedListId().then(listId => {
    //        return this.invoke(t => t.listGetDetails({ list_id: listId })).then(e => {
    //            this.watchedList = e;
    //            e.items.forEach(t => this.watched.add(t.id));
    //            console.log(e);
    //            return this.watchedList;
    //        });
    //    });
    //}
    //getCreateTmdbWatchedListId(): Promise<string> {
    //    if (this.watchedList != null)
    //        return Promise.resolve(this.watchedList.id);
    //    return this.invoke(t => t.accountGetCreatedLists({})).then(e => {
    //        let res1 = e.results.find(t => t.name.toLowerCase() == "watched");
    //        let listId: number = null;
    //        if (res1 != null)
    //            listId = res1.id;
    //        else {
    //            this.invoke(t => t.listCreateList({ body: { name: "watched", description: "ggg", language: "en" } })).then(e => {
    //                console.log(e);
    //                listId = e.list_id;
    //            });
    //        }
    //        console.log(e);
    //        return String(listId);
    //    });
    //}

    markAllRatedAsWatched(): Promise<any> {
        let ratedButNotWatched = setMinus(this.rated, this.watched);
        return promiseEach(Array.from(ratedButNotWatched), id => this.markAsWatched(id, true, false));
    }

    async importTvFavs(names: string[]): Promise<any> {
        for (let name of names) {
            let res = await this.searchTvShows({ query: name });
            let show = res.results[0];
            if (show == null) {
                console.log("can't find", name);
                continue;
            }
            console.log(name, show.id);
            await this.accountMarkasFavorite({ body: { media_type: "tv", media_id: show.id, favorite: true } });
        }
    }


}

export interface GeneralStorage {
    tmdb_request_token?: string;
    tmdb_session_id?: string;
    tmdb_account_id?: string;
}

