import "./utils/global";
import { TmdbClient } from "./tmdb-client"
import { TmdbClientV4 } from "./tmdb-client-v4"
import { FileService, ByFilenameService, KeyValueService } from "./service"
import { Movie, Media, ListDetails, RatedMovie, RatedTvShow } from "./tmdb/tmdb-api"
import { promiseEach, setMinus, setPlus, setIntersect } from "./utils/utils"
import { Scanner } from "./scanner"
import { Media as DsMedia } from "./media"
import { File } from "contracts"

export class App {
    fileService: FileService;
    byFilename: ByFilenameService;
    keyValue: KeyValueService;
    tmdb: TmdbClient;
    tmdbV4: TmdbClientV4;

    constructor() {
        console.log("App ctor", this);
        this.fileService = new FileService();
        this.byFilename = new ByFilenameService();
        this.keyValue = new KeyValueService();
        this.tmdb = new TmdbClient();
        this.tmdb.app = this;
        this.tmdb.base_url = '/tmdb_proxy/3';
        this.tmdb.api_key = '16a856dff4d1db46782e6132610ddb32';
        this.tmdbV4 = new TmdbClientV4();
        this.tmdbV4.base_url = '/tmdb_proxy/4';
        this.tmdbV4.read_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmE4NTZkZmY0ZDFkYjQ2NzgyZTYxMzI2MTBkZGIzMiIsInN1YiI6IjU4NGZlYzU1OTI1MTQxNmU0YjAwODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jg-T4s-kFV_FlXwG1tovDvCQhXGaw9cjMA9e669xFaE";
    }

    _initing: Promise<any>;
    init(): Promise<any> {
        if (this._initing != null)
            return this._initing;
        this._initing = this._init();
        return this._initing;
    }
    async _init() {
        await this.initConfig();
        await this.tmdb.init();
        await this.getSavedRatings();
        await this.getSavedWatchlists();
        await this.getMediaInfos();
        await this.onInit();
    }
    onInit() {
        let t = this.tmdb;
        let inWatchlist = setPlus(t.movieWatchlistIds, t.tvShowWatchlistIds);
        let x = {
            rated: t.rated,
            watched: t.watched,
            inWatchlist,
            movieWatchlistIds: t.movieWatchlistIds,
            tvShowWatchlistIds: t.tvShowWatchlistIds,
        };
        Object.keys(x).forEach(key => x[key] = Array.from(x[key]));
        console.log("onInit", x);
    }

    async initConfig(): Promise<any> {
        let config = await this.keyValue.findOneById<Config>({ id: "config" });
        this.config = config || { key: "config" };
        if (this.config.folders == null)
            this.config.folders = [];
    }
    async saveConfig() {
        await this.keyValue.persist(this.config);
    }

    config: Config;
    async scan(): Promise<Scanner> {
        let scanner = new Scanner();
        scanner.service = this.fileService;
        scanner.tmdb = this.tmdb;

        scanner.folders = this.config.folders.map(t => t.path);
        console.log("scan started", scanner);
        await scanner.scan();
        console.log("scan completed", scanner);
        return scanner;
    }

    async downloadRatings() {
        await this.tmdb.getAllPages(t => t.accountGetRatedMovies({}), res => this.savePage("ratings", "movie", res.page, res.results.map(t => t.id)));
        await this.tmdb.getAllPages(t => t.accountGetRatedTVShows({}), res => this.savePage("ratings", "tv", res.page, res.results.map(t => t.id)));
    }
    async downloadWatchlists() {
        await this.tmdb.getAllPages(t => t.accountGetMovieWatchlist({}), res => this.savePage("watchlist", "movie", res.page, res.results.map(t => t.id)));
        await this.tmdb.getAllPages(t => t.accountGetTVShowWatchlist({}), res => this.savePage("watchlist", "tv", res.page, res.results.map(t => t.id)));
    }

    async savePage(name: string, media_type: "movie" | "tv", page: number, ids: number[]) {
        await this.keyValue.persist<TmdbRatingsPage>({ key: "tmdb_" + name + "_" + media_type + "_page_" + page, ids: ids });
    }

    async getSavedRatings(): Promise<any> {
        let pages = await this.keyValue.findAllWithKeyLike<TmdbRatingsPage>({ like: "tmdb_ratings_%" });
        pages.forEach(page => {
            if (page.key.contains("_tv_"))
                page.ids.forEach(id => this.tmdb.rated.add("tv|" + id));
            else if (page.key.contains("_movie_"))
                page.ids.forEach(id => this.tmdb.rated.add("movie|" + id));
        });
    }

    async getSavedWatchlists(): Promise<any> {
        let pages = await this.keyValue.findAllWithKeyLike<TmdbRatingsPage>({ like: "tmdb_watchlist_%" });
        pages.forEach(page => {
            if (page.key.contains("_tv_"))
                page.ids.forEach(id => this.tmdb.tvShowWatchlistIds.add(id));
            else if (page.key.contains("_movie_"))
                page.ids.forEach(id => this.tmdb.movieWatchlistIds.add(id));
        });
    }

    async getAvailableMedia(): Promise<DsMedia[]> {
        let mds = await this.fileService.db.byFilename.invoke(t => t.find());

        let groups = mds.where(t => t.tmdbTypeAndId != null).groupBy(t => t.tmdbTypeAndId);
        let medias = groups.map(group => {
            let typeAndId = group[0].tmdbTypeAndId;
            if (typeAndId == null)
                return null;
            let media = this.getMedia(typeAndId);
            media.filenames = group.map(t => t.key);
            return media;
        });
        console.log({ medias });
        return medias;

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
    async getMediaInfos(): Promise<DsMedia[]> {
        let list = await this.keyValue.findAllWithKeyLike({ like: "mediainfo_%" });
        this.mediaInfos = list.map(info => {
            let typeAndId = info.key.substr("mediainfo_".length);
            let media = this.getMedia(typeAndId);
            media.info = info;
            return media;
        });
        this.mediaInfos.forEach(t => this.tmdb.watched.add(t.typeAndId));
        return this.mediaInfos;
    }
    getMedia(typeAndId: string): DsMedia {
        return DsMedia.fromTmdbTypeAndId(typeAndId, this);
    }

    async findFile(name: string): Promise<File> {
        for (let folder of this.config.folders) {
            let res = await this.fileService.invoke(t => t.ListFiles({ Path: folder.path, IsRecursive: true }));
            let file = res.Files.first(t => t.Name == name);
            if (file != null)
                return file;
        }
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




