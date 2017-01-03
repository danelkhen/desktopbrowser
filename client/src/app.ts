import "./utils/global";
import { TmdbClient } from "./tmdb-client"
import { TmdbClientV4 } from "./tmdb-client-v4"
import { SiteServiceClient, ByFilenameService, KeyValueService } from "./service"
import { Movie, Media, ListDetails, RatedMovie, RatedTvShow } from "./tmdb/tmdb-api"
import { promiseEach, setMinus, setPlus, setIntersect } from "./utils/utils"
import { Scanner } from "./scanner"
import { Media as DsMedia } from "./media"

export class App {
    server: SiteServiceClient;
    byFilename: ByFilenameService;
    keyValue: KeyValueService;
    tmdb: TmdbClient;
    tmdbV4: TmdbClientV4;

    constructor() {
        console.log("App ctor", this);
        this.server = new SiteServiceClient();
        this.byFilename = new ByFilenameService();
        this.keyValue = new KeyValueService();
        this.tmdb = new TmdbClient();
        this.tmdb.app = this;
        this.tmdb.base_url = '/tmdb_proxy/3';

        this.tmdbV4 = new TmdbClientV4();
        this.tmdbV4.base_url = '/tmdb_proxy/4';
        this.tmdbV4.read_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmE4NTZkZmY0ZDFkYjQ2NzgyZTYxMzI2MTBkZGIzMiIsInN1YiI6IjU4NGZlYzU1OTI1MTQxNmU0YjAwODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jg-T4s-kFV_FlXwG1tovDvCQhXGaw9cjMA9e669xFaE";
    }

    _initing: Promise<any>;
    init(): Promise<any> {
        if (this._initing != null)
            return this._initing;
        this._initing = promiseEach([
            () => this.initConfig(),
            () => this.tmdb.init(),
            () => this.getSavedRatings(),
            () => this.getSavedWatchlists(),
            () => this.getMediaInfos(),
            () => this.onInit(),
        ], t => t());
        return this._initing;
    }
    onInit() {
        let t = this.tmdb;
        //let rated = setPlus(t.ratedMovies, t.ratedTvShows);
        //let ratedOrWatched = setPlus(rated, t.watched);
        let inWatchlist = setPlus(t.movieWatchlistIds, t.tvShowWatchlistIds);
        let x = {
            rated: t.rated,
            watched: t.watched,
            //ratedOrWatched, 
            inWatchlist,
            //watched: t.watched,
            //ratedMovies: t.ratedMovies,
            //ratedTvShows: t.ratedTvShows,
            movieWatchlistIds: t.movieWatchlistIds,
            tvShowWatchlistIds: t.tvShowWatchlistIds,
            //watchedButNotRated: setMinus(t.watched, rated),
            //ratedButNotWatched: setMinus(rated, t.watched),
            //ratedOrWatchedButStillInWatchlist: setIntersect(ratedOrWatched, inWatchlist),
        };
        Object.keys(x).forEach(key => x[key] = Array.from(x[key]));
        console.log("onInit", x);
    }

    initConfig(): Promise<any> {
        return this.keyValue.findOneById<Config>({ id: "config" }).then(t => {
            this.config = t || { key: "config" };
            if (this.config.folders == null)
                this.config.folders = [];
        });
    }
    saveConfig() {
        return this.keyValue.persist(this.config);
    }

    config: Config;
    scan(): Promise<Scanner> {
        let scanner = new Scanner();
        scanner.service = this.server;
        scanner.tmdb = this.tmdb;

        scanner.folders = this.config.folders.map(t => t.path);
        console.log("scan started", scanner);
        return scanner.scan().then(() => console.log("scan completed", scanner)).then(t => scanner);

    }

    downloadRatings() {
        return Promise.resolve()
            .then(() => this.tmdb.getAllPages(t => t.accountGetRatedMovies({}), res => this.savePage("ratings", "movie", res.page, res.results.map(t => t.id))))
            .then(() => this.tmdb.getAllPages(t => t.accountGetRatedTVShows({}), res => this.savePage("ratings", "tv", res.page, res.results.map(t => t.id))))
            ;
    }
    downloadWatchlists() {
        return Promise.resolve()
            .then(() => this.tmdb.getAllPages(t => t.accountGetMovieWatchlist({}), res => this.savePage("watchlist", "movie", res.page, res.results.map(t => t.id))))
            .then(() => this.tmdb.getAllPages(t => t.accountGetTVShowWatchlist({}), res => this.savePage("watchlist", "tv", res.page, res.results.map(t => t.id))))
            ;
    }

    savePage(name: string, media_type: "movie" | "tv", page: number, ids: number[]) {
        this.keyValue.persist<TmdbRatingsPage>({ key: "tmdb_" + name + "_" + media_type + "_page_" + page, ids: ids });
    }

    getSavedRatings(): Promise<any> {
        return this.keyValue.findAllWithKeyLike<TmdbRatingsPage>({ like: "tmdb_ratings_%" })
            .then(pages => pages.forEach(page => {
                if (page.key.contains("_tv_"))
                    page.ids.forEach(id => this.tmdb.rated.add("tv|" + id));
                else if (page.key.contains("_movie_"))
                    page.ids.forEach(id => this.tmdb.rated.add("movie|" + id));
            }));
        //.then(pages => pages.selectMany(t => t.ids).forEach(t => this.tmdb.rated.add(t)));
    }

    getSavedWatchlists(): Promise<any> {
        return this.keyValue.findAllWithKeyLike<TmdbRatingsPage>({ like: "tmdb_watchlist_%" })
            .then(pages => pages.forEach(page => {
                if (page.key.contains("_tv_"))
                    page.ids.forEach(id => this.tmdb.tvShowWatchlistIds.add(id));
                else if (page.key.contains("_movie_"))
                    page.ids.forEach(id => this.tmdb.movieWatchlistIds.add(id));
            }));
    }

    getAvailableMedia(): Promise<DsMedia[]> {
        return this.server.db.byFilename.invoke(t => t.find()).then(mds => {
            let groups = mds.where(t => t.tmdbTypeAndId != null).groupBy(t => t.tmdbTypeAndId);
            let medias = groups.map(group => {
                let typeAndId = group[0].tmdbTypeAndId;
                if (typeAndId == null)
                    return null;
                let media = DsMedia.fromTmdbTypeAndId(typeAndId, this);
                media.filenames = group.map(t => t.key);
                return media;
            });
            console.log({ medias });
            return medias;
        });
    }

    updateMediaInfo(typeAndId: string, info: TmdbMediaInfo): Promise<TmdbMediaInfo> {
        info.key = "mediainfo_" + typeAndId;
        return this.keyValue.persist(info);
    }
    getMediaInfo(typeAndId: string): Promise<TmdbMediaInfo> {
        let key = "mediainfo_" + typeAndId;
        return this.keyValue.findOneById({ id: key }).then(t => t || { key });
    }
    mediaInfos: DsMedia[] = [];
    getMediaInfos(): Promise<DsMedia[]> {
        return this.keyValue.findAllWithKeyLike({ like: "mediainfo_%" })
            .then(list => list.map(info => {
                let typeAndId = info.key.substr("mediainfo_".length);
                let media = this.getMedia(typeAndId);
                media.info = info;
                return media;
            })).then(t => {
                this.mediaInfos = t;
                this.mediaInfos.forEach(t => this.tmdb.watched.add(t.typeAndId));
                return this.mediaInfos;
            });
    }
    getMedia(typeAndId: string): DsMedia {
        return DsMedia.fromTmdbTypeAndId(typeAndId, this);
    }

}


export interface TmdbMediaInfo {
    key: string;
    watched?: boolean;
}
export interface TmdbRatingsPage {
    key: string;
    ids: number[];
}
export interface Config {
    key: string;
    folders?: ConfigFolder[];
}
export interface ConfigFolder {
    path: string;
}




