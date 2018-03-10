"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils/global");
const tmdb_client_1 = require("./tmdb-client");
const tmdb_client_v4_1 = require("./tmdb-client-v4");
const service_1 = require("./service");
const utils_1 = require("./utils/utils");
const scanner_1 = require("./scanner");
const filename_parser_1 = require("./filename-parser");
class App {
    constructor() {
        this.filenameParser = new filename_parser_1.FilenameParser();
        console.log("App ctor", this);
        window["_app"] = this;
        this.fileService = new service_1.FileService();
        this.byFilename = new service_1.ByFilenameService();
        this.keyValue = new service_1.KeyValueService();
        this.fsEntryService = new service_1.FsEntryService();
        this.appService = new service_1.AppService();
        this.tmdb = new tmdb_client_1.TmdbClient();
        this.tmdb.app = this;
        this.tmdb.base_url = '/tmdb_proxy/3';
        this.tmdb.api_key = '16a856dff4d1db46782e6132610ddb32';
        this.tmdbV4 = new tmdb_client_v4_1.TmdbClientV4();
        this.tmdbV4.base_url = '/tmdb_proxy/4';
        this.tmdbV4.read_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmE4NTZkZmY0ZDFkYjQ2NzgyZTYxMzI2MTBkZGIzMiIsInN1YiI6IjU4NGZlYzU1OTI1MTQxNmU0YjAwODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jg-T4s-kFV_FlXwG1tovDvCQhXGaw9cjMA9e669xFaE";
    }
    async init() {
        await this.initConfig();
        await this.tmdb.init();
        await this.getSavedRatings();
        await this.getSavedWatchlists();
        await this.onInit();
    }
    onInit() {
        let t = this.tmdb;
        let inWatchlist = utils_1.setPlus(t.movieWatchlistIds, t.tvShowWatchlistIds);
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
    async initConfig() {
        let config = await this.appService.getConfig();
        this.config = config || {};
        if (this.config.folders == null)
            this.config.folders = [];
    }
    async saveConfig() {
        await this.appService.saveConfig(this.config);
    }
    createScanner() {
        let scanner = new scanner_1.Scanner();
        scanner.app = this;
        scanner.folders = this.config.folders.map(t => t.path);
        return scanner;
    }
    async scan() {
        let x = await this.appService.invoke(t => t.scanForMedia());
        console.log(x);
    }
    async downloadRatings() {
        await this.tmdb.proxy.getAllPages(t => t.accountGetRatedMovies({}), res => this.savePage("ratings", "movie", res.page, res.results.map(t => t.id)));
        await this.tmdb.proxy.getAllPages(t => t.accountGetRatedTVShows({}), res => this.savePage("ratings", "tv", res.page, res.results.map(t => t.id)));
    }
    async downloadWatchlists() {
        await this.tmdb.proxy.getAllPages(t => t.accountGetMovieWatchlist({}), res => this.savePage("watchlist", "movie", res.page, res.results.map(t => t.id)));
        await this.tmdb.proxy.getAllPages(t => t.accountGetTVShowWatchlist({}), res => this.savePage("watchlist", "tv", res.page, res.results.map(t => t.id)));
    }
    async savePage(name, media_type, page, ids) {
        await this.keyValue.persist({ key: "tmdb_" + name + "_" + media_type + "_page_" + page, value: { ids: ids } });
    }
    async getSavedRatings() {
        let pages = await this.keyValue.findAllWithKeyLike({ like: "tmdb_ratings_%" });
        pages.forEach(page => {
            if (page.key.contains("_tv_"))
                page.value.ids.forEach(id => this.tmdb.rated.add("tv|" + id));
            else if (page.key.contains("_movie_"))
                page.value.ids.forEach(id => this.tmdb.rated.add("movie|" + id));
        });
    }
    async getSavedWatchlists() {
        let pages = await this.keyValue.findAllWithKeyLike({ like: "tmdb_watchlist_%" });
        pages.forEach(page => {
            if (page.key.contains("_tv_"))
                page.value.ids.forEach(id => this.tmdb.tvShowWatchlistIds.add(id));
            else if (page.key.contains("_movie_"))
                page.value.ids.forEach(id => this.tmdb.movieWatchlistIds.add(id));
        });
    }
    async getAllFilesMetadata() {
        return this.byFilename.find();
    }
    async getFileMetadata(file) {
        let name = file;
        if (file instanceof File)
            name = file.Name;
        let x = await this.byFilename.findOneById({ id: name });
        if (x == null)
            x = { key: name };
        return x;
    }
    async analyze(mfs, opts) {
        for (let mf of mfs) {
            if (mf.tmdb != null && (opts == null || !opts.force))
                continue;
            await this.createScanner().analyze(mf, opts);
        }
    }
    async getMovieOrTvByTypeAndId(tmdbKey) {
        if (tmdbKey == null || tmdbKey == "" || tmdbKey.split("|").some(t => t.length == 0))
            return null;
        let cacheKey = "tmdb|details|" + tmdbKey;
        let x = await this.keyValue.findOneById({ id: cacheKey });
        if (x != null && x.value != null)
            return x.value;
        let x2 = await this.tmdb.getMovieOrTvByTypeAndId(tmdbKey);
        this.keyValue.persist({ key: cacheKey, value: x2 });
        return x2;
    }
    async loadTmdbMediaDetails(mfs) {
        for (let mf of mfs) {
            if (mf.tmdb != null)
                continue;
            await this.analyze([mf]);
            mf.tmdb = await this.getMovieOrTvByTypeAndId(mf.md.tmdbKey);
        }
        return mfs;
    }
    async findFile(name) {
        for (let folder of this.config.folders) {
            let res = await this.fileService.ListFiles({ Path: folder.path, IsRecursive: true });
            let file = res.Files.first(t => t.Name == name);
            if (file != null)
                return file;
        }
    }
    async markAsWatched(mf) {
        mf.md.watched = true;
        if (mf.md.tmdbKey != null)
            await this.tmdb.markAsWatched(mf.md.tmdbKey);
        await this.byFilename.persist(mf.md);
    }
    fsEntryToMediaFile(x) {
        return { fsEntry: x };
    }
    parseFilename(mf) {
        if (mf.parsed != null)
            return;
        if (mf.fsEntry == null)
            return;
        let name = mf.fsEntry.basename;
        mf.parsed = new filename_parser_1.FilenameParser().parse(mf.fsEntry.basename);
    }
    async getMediaFiles(req) {
        let x = await this.appService.getMediaFiles(req);
        x.forEach(t => {
            if (t.md == null) {
                t.md = { key: t.fsEntry.basename };
            }
            this.parseFilename(t);
        });
        return x;
    }
    async getLatestFsEntries() {
        return await this.fsEntryService.find({ order: { "mtime": "DESC" }, });
    }
    async scanAllFsEntries() {
        console.log("STARTED scanAllFsEntries");
        let req = { firstResult: 0, maxResults: 500, notScannedOnly: true };
        while (true) {
            let mfs = await this.getMediaFiles(req);
            if (mfs.length == 0) {
                console.log("Finished scanAllFsEntries");
                return;
            }
            req.firstResult += req.maxResults;
            await this.analyze(mfs);
        }
    }
}
__decorate([
    utils_1.ReusePromise(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], App.prototype, "init", null);
__decorate([
    utils_1.ReusePromiseIfStillRunning(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], App.prototype, "scanAllFsEntries", null);
exports.App = App;
//# sourceMappingURL=app.js.map