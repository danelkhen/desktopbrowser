"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const by_filename_service_1 = require("./by-filename-service");
const key_value_service_1 = require("./key-value-service");
const file_service_1 = require("./file-service");
const file_service2_1 = require("./file-service2");
const db_service_1 = require("./db-service");
const db_1 = require("./db");
const media_scanner_1 = require("./media-scanner");
const Fs = require("./utils/fs");
const Path = require("path");
const utils_1 = require("./utils");
class App {
    async getConfig() {
        let root = Path.join(__dirname, "../../");
        let file = "config.json";
        let path = Path.join(root, file);
        let exists = await Fs.exists(path);
        if (!exists)
            return {};
        let text = await Fs.readFile(path, "utf8");
        if (text == null || text == "")
            return {};
        let config = JSON.parse(text);
        return config;
    }
    async saveConfig(config) {
        let root = Path.join(__dirname, "../../");
        let file = "config.json";
        let path = Path.join(root, file);
        let json = JSON.stringify(config, null, "    ");
        await Fs.writeFile(path, json);
    }
    async getConfig2() {
        let config2 = await this.keyValueService.findOneById({ id: "config" });
        let config = (config2 && config2.value) || {};
        if (config.folders == null)
            config.folders = [];
        return config;
    }
    async init() {
        if (this.db != null)
            return;
        this.db = new db_1.Db();
        this.byFilenameService = new by_filename_service_1.ByFilenameService(this.db);
        this.keyValueService = new key_value_service_1.KeyValueService(this.db);
        this.fsEntryService = new FsEntryService();
        this.fileService = new file_service_1.FileService();
        this.fileService2 = new file_service2_1.FileService2();
        this.mediaScanner = new media_scanner_1.MediaScanner();
        this.mediaScanner.app = this;
        await this.db.init();
        this.fsEntryService.db = this.db;
        this.fsEntryService.repo = this.db.fsEntries;
        await this.byFilenameService.init();
        await this.keyValueService.init();
        await this.fileService.init();
    }
    async scanForMedia() {
        if (this.mediaScanner.isRunning())
            return this.mediaScanner.status;
        this.mediaScanner.scan();
        return this.mediaScanner.status;
    }
    scanStatus() {
        return this.mediaScanner.status;
    }
    async getMediaFiles(req) {
        //let files = await this.fsEntryService.find(req.find);
        //let mfs: C.MediaFile[] = files.map(t => <C.MediaFile>{ fsEntry: t });
        //let byKey = new Map<string, C.MediaFile>();
        //mfs.forEach(t => byKey.set(t.fsEntry.basename, t));
        //let keys = Array.from(files.keys());
        //let mds = await this.db.byFilename.findByIds(keys);
        //mds.forEach(md => {
        //    let mf = byKey.get(md.key);
        //    mf.md = md;
        //});
        //req.find.options.alias = "t";
        //let q = this.db.fsEntries.createFindQueryBuilder(req.find.conditions, req.find.options);
        let q = this.db.fsEntries.createQueryBuilder("t")
            .leftJoinAndMapOne("t.md", db_1.ByFilename, "md", "t.basename=md.key");
        if (req.notScannedOnly)
            q = q.where("md.scanned is null");
        q = q.orderBy("t.mtime", "DESC").offset(req.firstResult || 0).limit(req.maxResults || 100);
        //.where()
        ;
        let x = await q.getMany();
        let mfs = x.map(t => ({ fsEntry: t, md: t.md, type: null, parsed: null }));
        x.forEach(t => delete t.md);
        let hasTmdbKeys = mfs.where(t => t.md != null && t.md.tmdbKey != null);
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = hasTmdbKeys.select(t => t.md.tmdbKey).distinct();
            let cachePrefix = "tmdb|details|";
            let cacheKeys = tmdbKeys.select(t => cachePrefix + t);
            let cachedMediaDetails = await this.keyValueService.dbService.repo.findByIds(cacheKeys);
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length);
                hasTmdbKeys.where(t => t.md.tmdbKey == tmdbKey).forEach(t => t.tmdb = media.value);
            }
        }
        return mfs;
    }
    async getMediaFiles2(req) {
        let fsEntries = await this.db.fsEntries.find({ take: req.maxResults, skip: req.firstResult });
        let mds = await this.db.byFilename.find();
        let mdMap = new Map();
        mds.forEach(md => mdMap.set(md.key, md));
        let mfs = fsEntries.map(fsEntry => ({ fsEntry: fsEntry, md: mdMap.get(fsEntry.basename), type: null, parsed: null }));
        let hasTmdbKeys = mfs.where(t => t.md != null && t.md.tmdbKey != null);
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = hasTmdbKeys.select(t => t.md.tmdbKey).distinct();
            let cachePrefix = "tmdb|details|";
            let cacheKeys = tmdbKeys.select(t => cachePrefix + t);
            let cachedMediaDetails = await this.keyValueService.dbService.repo.findByIds(cacheKeys);
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length);
                hasTmdbKeys.where(t => t.md.tmdbKey == tmdbKey).forEach(t => t.tmdb = media.value);
            }
        }
        return mfs;
    }
    *testIterable() {
        for (let i = 0; i < 10; i++)
            yield i;
    }
    async *testAsyncIterable() {
        for (let i = 0; i < 10; i++) {
            await utils_1.sleep(1000);
            yield i;
        }
    }
}
exports.App = App;
class FsEntryService extends db_service_1.DbService {
}
exports.FsEntryService = FsEntryService;
exports.app = new App();
