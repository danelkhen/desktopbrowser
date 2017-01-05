import "./utils/global";
import { TmdbClient } from "./tmdb-client"
import { TmdbClientV4 } from "./tmdb-client-v4"
import { FileService, ByFilenameService, KeyValueService } from "./service"
import { MediaDetails, TmdbMovie, TmdbMedia, ListDetails, RatedMovie, RatedTvShow } from "./tmdb/v3/api"
import { promiseEach, setMinus, setPlus, setIntersect } from "./utils/utils"
import { Scanner } from "./scanner"
import { FilenameParser } from "./filename-parser"

import { Media as DsMedia } from "./media"
import { File, ByFilename, FilenameParsedInfo } from "contracts"

export class App {
    fileService: FileService;
    byFilename: ByFilenameService;
    keyValue: KeyValueService;
    tmdb: TmdbClient;
    tmdbV4: TmdbClientV4;

    constructor() {
        console.log("App ctor", this);
        window["app"] = this;
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
        await this.refreshMediaInfos();
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
        //scanner.service = this.fileService;
        scanner.app = this;
        //scanner.tmdb = this.tmdb;

        scanner.folders = this.config.folders.map(t => t.path);
        console.log("scan started", scanner);
        await scanner.scan();
        console.log("scan completed", scanner);
        return scanner;
    }

    async downloadRatings() {
        await this.tmdb.proxy.getAllPages(t => t.accountGetRatedMovies({}), res => this.savePage("ratings", "movie", res.page, res.results.map(t => t.id)));
        await this.tmdb.proxy.getAllPages(t => t.accountGetRatedTVShows({}), res => this.savePage("ratings", "tv", res.page, res.results.map(t => t.id)));
    }
    async downloadWatchlists() {
        await this.tmdb.proxy.getAllPages(t => t.accountGetMovieWatchlist({}), res => this.savePage("watchlist", "movie", res.page, res.results.map(t => t.id)));
        await this.tmdb.proxy.getAllPages(t => t.accountGetTVShowWatchlist({}), res => this.savePage("watchlist", "tv", res.page, res.results.map(t => t.id)));
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

    async getAllFilesMetadata(): Promise<ByFilename[]> {
        return this.byFilename.find();
    }

    async getFileMetadata(file: File): Promise<ByFilename> {
        let x = await this.byFilename.findOneById({ id: file.Name });
        return x;
    }

    async getAvailableMedia(): Promise<MediaFile[]> {
        let mds = await this.getAllFilesMetadata();
        let scanner = new Scanner();
        mds = mds.filter(t => scanner.isVideoFile(t.key));
        let mfs = mds.map(t => <MediaFile>{ md: t, tmdb: null, type: t.tmdbKey != null ? t.tmdbKey.split("|")[0] : null, parsed: new FilenameParser().parse(t.key) });
        //let selectedFiles = new Set(mds.selectMany(t => t.selectedFiles || []));
        //let groups = mfs.where(t => t.md.tmdbKey != null && t.md.tmdbKey != "").groupBy(t => t.md.tmdbKey);
        //let medias = groups.map(group => {
        //    let typeAndId = group[0].md.tmdbKey;
        //    if (typeAndId == null)
        //        return null;
        //    let media = this.getMedia(typeAndId);
        //    media.filenames = group.map(t => t.key);
        //    if (!media.info.watched && media.filenames.some(t => selectedFiles.has(t))) {
        //        media.info.watched = true;
        //    }
        //    return media;
        //});
        //console.log({ medias });
        return mfs;

    }

    async loadTmdbMediaDetails(mfs: MediaFile[]): Promise<MediaFile[]> {
        for (let mf of mfs) {
            if (mf.tmdb != null)
                continue;
            if (mf.md.tmdbKey == null || mf.md.tmdbKey == "")
                continue;
            mf.tmdb = await this.tmdb.getMovieOrTvByTypeAndId(mf.md.tmdbKey);
        }
        return mfs;
    }


    updateMediaInfo(typeAndId: string, info: TmdbMediaInfo): Promise<TmdbMediaInfo> {
        info.key = "mediainfo_" + typeAndId;
        return this.keyValue.persist(info);
    }
    getMediaInfo(typeAndId: string): TmdbMediaInfo {
        let x = this.mediaInfos.get(typeAndId);
        if (x == null) {
            x = { key: "mediainfo_" + typeAndId };
            this.mediaInfos.set(typeAndId, x);
        }
        return x;
    }

    mediaInfos: Map<string, TmdbMediaInfo> = new Map<string, TmdbMediaInfo>();
    async refreshMediaInfos(): Promise<Map<string, TmdbMediaInfo>> {
        let list = await this.keyValue.findAllWithKeyLike({ like: "mediainfo_%" });
        list.forEach(info => {
            let typeAndId = info.key.substr("mediainfo_".length);
            this.mediaInfos.set(typeAndId, info);
        });
        Array.from(this.mediaInfos.entries()).filter(t => t[1].watched).forEach(t => this.tmdb.watched.add(t[0]));
        return this.mediaInfos;
    }
    getMedia(typeAndId: string): DsMedia {
        let media = DsMedia.fromTmdbKey(typeAndId, this);
        return media;
    }

    async findFile(name: string): Promise<File> {
        for (let folder of this.config.folders) {
            let res = await this.fileService.ListFiles({ Path: folder.path, IsRecursive: true });
            let file = res.Files.first(t => t.Name == name);
            if (file != null)
                return file;
        }
    }

    async markAsWatched(mf: MediaFile): Promise<any> {
        mf.md.watched = true;
        if (mf.md.tmdbKey != null)
            await this.tmdb.markAsWatched(mf.md.tmdbKey);
        await this.byFilename.persist(mf.md);
    }

}

export interface MediaFile {
    md: ByFilename;
    file: File
    tmdb?: MediaDetails;
    tmdbBasic?: TmdbMedia;
    type: string;
    parsed: FilenameParsedInfo;
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




