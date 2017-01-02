import { MediaDetails, ListDetails, TmdbApi, GetApiConfigurationResponse, Movie, Media, AccountDetails, AccountGetDetailsRequest, RatedMovie, RatedTvShow } from "./tmdb/tmdb-api"
import { TmdbApiClient2, } from "./tmdb/tmdb-client2"
import { promiseEach, tryParseInt } from "./utils/utils"

export class TmdbClient extends TmdbApiClient2 {
    constructor() {
        super();
        console.log("TmdbClient ctor");
        let base = this.onInvoke;
        this.onInvoke = pc => {
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
    account: AccountDetails;
    tvShowWatchlistIds = new Set<number>();
    movieWatchlistIds = new Set<number>();

    init(): Promise<any> {
        this.api_key = '16a856dff4d1db46782e6132610ddb32';
        return this.invoke(t => t.getApiConfiguration({})).then(t => this.configuration = t)
            .then(() => this.onLogin());
    }

    onLogin(): Promise<any> {
        return Promise.resolve()
            .then(() => this.accountGetDetails())
            .then(() => this.getCreateTmdbWatchedList())
            //.then(() => this.accountGetRatedMovies({}))
            //.then(t => this.ratedMovies = t.results)
            //.then(() => this.accountGetRatedTVShows({}))
            //.then(t => this.ratedTvShows = t.results)
            .then(() => console.log("onLogin finished", { ratedMovies: this.ratedMovies, ratedTvShows: this.ratedTvShows, watchedList: this.watchedTvList }))
            ;
    }
    //ratedMovies: RatedMovie[];
    //ratedTvShows: RatedTvShow[];

    accountGetDetails(req?: AccountGetDetailsRequest): Promise<AccountDetails> {
        return super.accountGetDetails(req).then(t => {
            this.account = t;
            if (this.account != null)
                this.account_id = this.account.id;
            return this.account;
        }, () => console.log("accountGetDetails failed"));
    }

    configuration: GetApiConfigurationResponse;
    detectMediaType(media: Media, methodName: string): boolean {
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
        let movie = res as Media;
        let props: Array<keyof Media> = ["poster_path", "backdrop_path"];
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
        Object.values(res).forEach(t => this.fixResponse(t, methodName));
        return res;

    }


    getImageSizes(prop: keyof Media): string[] {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (prop == "backdrop_path")
            return c.backdrop_sizes;
        else if (prop == "poster_path")
            return c.poster_sizes;
        return null;
    }
    getImageUrl(movie: Media, prop: keyof Media, size?: string): string {
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
    loginToTmdb(): Promise<any> {
        return this._loginToTmdb().then(t => this.onLogin());//.accountGetDetails()).then(t => this.getCreateTmdbWatchedList());
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
                this.invoke(t => t.authenticationCreateSession({ request_token: x.request_token }))
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
            this.invoke(t => t.authenticationCreateRequestToken({})).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?request_token=" + this.request_token);
            });
        });
    }

    getMovieOrTvByTypeAndId(typeAndId: string): Promise<MediaDetails> {
        if (typeAndId == null)
            return Promise.resolve(null);
        let tokens = typeAndId.split("|");
        if (tokens.length < 2)
            return Promise.resolve(null);
        let media_type = tokens[0];
        let id = tokens[1];
        if (media_type == "movie")
            return this.movieGetDetails({ movie_id: id as any, append_to_response: "account_states" });
        if (media_type == "tv")
            return this.tvGetDetails({ tv_id: id as any, append_to_response: "account_states" });
        return Promise.resolve(null);
    }

    watchedTvList: ListDetails;
    watchedMoviesList: ListDetails;
    isWatchedOrRated(media_id: number | string): boolean {
        if (media_id == null)
            return null;
        if (typeof (media_id) == "string") {
            if (media_id.contains("|"))
                return this.isWatchedOrRated(media_id.split("|")[1]);
            media_id = parseInt(media_id);
        }
        if (this.ratedTvShows.has(media_id))
            return true;
        if (this.ratedMovies.has(media_id))
            return true;
        if (this.watched.has(media_id))
            return true;
        return false; //this.watchedList != null && this.watchedList.items.find(t => t.id == media_id) != null;
    }
    failed = [];
    ratedTvShows = new Set<number>();
    ratedMovies = new Set<number>();
    watched = new Set<number>();

    markAsWatched(media_id: number, watched: boolean = true, refreshList?: boolean): Promise<any> {
        if (this.watchedTvList == null)
            throw new Error();
        if (this.watched.has(media_id))
            return Promise.resolve();
        return this.invoke(t => t.listAddMovie({ list_id: this.watchedTvList.id, body: { media_id: media_id } }))
            .then(e => console.log(e), e => this.failed.push({ id: media_id, e }))
            .then(() => refreshList && this.refreshTmdbWatchedLists());
    }
    getCreateTmdbWatchedList(): Promise<ListDetails> {
        if (this.watchedTvList != null)
            return Promise.resolve(this.watchedTvList);
        return this.refreshTmdbWatchedLists();
    }
    refreshTmdbWatchedLists(): Promise<ListDetails> {
        return promiseEach(["watched-tv", "watched-movie"], t => this.refreshTmdbWatchedList(t));
    }
    refreshTmdbWatchedList(name: string): Promise<ListDetails> {
        return this.getCreateTmdbWatchedListId(name).then(listId => {
            return this.invoke(t => t.listGetDetails({ list_id: listId })).then(e => {
                if (name == "watched-tv") {
                    this.watchedTvList = e;
                }
                else if (name == "watched-movie") {
                    this.watchedMoviesList;
                }
                e.items.forEach(t => this.watched.add(t.id));
                console.log(e);
                return this.watchedTvList;
            });
        });
    }
    getCreateTmdbWatchedListId(name: string): Promise<string> {
        if (name=="watched-tv" && this.watchedTvList != null)
            return Promise.resolve(this.watchedTvList.id);
        if (name=="watched-movie" && this.watchedMoviesList != null)
            return Promise.resolve(this.watchedMoviesList.id);
        return this.invoke(t => t.accountGetCreatedLists({})).then(e => {
            let res1 = e.results.find(t => t.name.toLowerCase() == name.toLowerCase());
            let listId: number = null;
            if (res1 != null)
                listId = res1.id;
            else {
                this.invoke(t => t.listCreateList({ body: { name: name, description: "Created by Desktop Browser", language: "en" } })).then(e => {
                    console.log(e);
                    listId = e.list_id;
                });
            }
            console.log(e);
            return String(listId);
        });
    }

    markAllRatedAsWatched(): Promise<any> {
        let ratedButNotWatched = new Set(this.ratedTvShows);
        this.watched.forEach(t => ratedButNotWatched.delete(t));
        return promiseEach(Array.from(ratedButNotWatched), id => this.markAsWatched(id, true, false));
    }


}

export interface GeneralStorage {
    tmdb_request_token?: string;
    tmdb_session_id?: string;
    tmdb_account_id?: string;
}

