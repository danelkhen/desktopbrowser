"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsEntryService = exports.App = void 0;
const fs_1 = require("fs");
const fs_extra_1 = __importDefault(require("fs-extra"));
const Path = __importStar(require("path"));
const db_1 = require("./db");
const DbService_1 = require("./DbService");
const FileService_1 = require("./FileService");
const KeyValueService_1 = require("./KeyValueService");
const MediaScanner_1 = require("./MediaScanner");
const shared_1 = require("shared");
class App {
    constructor(db) {
        this.db = db;
        this.fileService = undefined;
        this.keyValueService = undefined;
        this.byFilenameService = undefined;
        this.mediaScanner = undefined;
        this.fsEntryService = undefined;
        this.byFilenameService = new DbService_1.DbService(this.db, this.db.byFilename);
        this.keyValueService = new KeyValueService_1.KeyValueService(this.db);
        this.fsEntryService = new FsEntryService(this.db, this.db.fsEntries);
        this.fileService = new FileService_1.FileService();
        this.mediaScanner = new MediaScanner_1.MediaScanner();
        this.mediaScanner.app = this;
    }
    async getConfig() {
        let root = Path.join(__dirname, "../../");
        let file = "config.json";
        let path = Path.join(root, file);
        let exists = await fs_extra_1.default.pathExists(path);
        if (!exists)
            return {};
        let text = await fs_1.promises.readFile(path, "utf8");
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
        await fs_1.promises.writeFile(path, json);
    }
    async scanForMedia() {
        if (this.mediaScanner.isRunning())
            return this.mediaScanner.status;
        this.mediaScanner.scan();
        return this.mediaScanner.status;
    }
    async scanStatus() {
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
        let q = this.db.fsEntries
            .createQueryBuilder("t")
            .leftJoinAndMapOne("t.md", db_1.ByFilename, "md", "t.basename=md.key");
        if (req.notScannedOnly) {
            q = q.where("md.scanned is null");
        }
        q = q
            .orderBy("t.mtime", "DESC")
            .offset(req.firstResult || 0)
            .limit(req.maxResults || 100);
        let x = await q.getMany();
        let mfs = x.map(t => ({ fsEntry: t, md: t.md, type: null, parsed: null }));
        x.forEach(t => delete t.md);
        let hasTmdbKeys = mfs.filter(t => t.md != null && t.md.tmdbKey != null);
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = Array.from(new Set(hasTmdbKeys.map(t => t.md.tmdbKey)));
            let cachePrefix = "tmdb|details|";
            let cacheKeys = tmdbKeys.map(t => cachePrefix + t);
            let cachedMediaDetails = (await this.keyValueService.dbService.repo.findByIds(cacheKeys));
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length);
                hasTmdbKeys.filter(t => t.md.tmdbKey == tmdbKey).forEach(t => (t.tmdb = media.value));
            }
        }
        return mfs;
    }
    async getMediaFiles2(req) {
        let fsEntries = await this.db.fsEntries.find({ take: req.maxResults, skip: req.firstResult });
        let mds = await this.db.byFilename.find();
        let mdMap = new Map();
        mds.forEach(md => mdMap.set(md.key, md));
        let mfs = fsEntries.map(fsEntry => ({
            fsEntry: fsEntry,
            md: mdMap.get(fsEntry.basename),
            type: null,
            parsed: null,
        }));
        let hasTmdbKeys = mfs.filter(t => t.md != null && t.md.tmdbKey != null);
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = Array.from(new Set(hasTmdbKeys.map(t => t.md.tmdbKey)));
            let cachePrefix = "tmdb|details|";
            let cacheKeys = tmdbKeys.map(t => cachePrefix + t);
            let cachedMediaDetails = (await this.keyValueService.dbService.repo.findByIds(cacheKeys));
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length);
                hasTmdbKeys.filter(t => t.md.tmdbKey == tmdbKey).forEach(t => (t.tmdb = media.value));
            }
        }
        return mfs;
    }
    *testIterable() {
        for (let i = 0; i < 10; i++)
            yield i;
    }
    testAsyncIterable() {
        return __asyncGenerator(this, arguments, function* testAsyncIterable_1() {
            for (let i = 0; i < 10; i++) {
                yield __await(shared_1.sleep(1000));
                yield yield __await(i);
            }
        });
    }
}
exports.App = App;
class FsEntryService extends DbService_1.DbService {
}
exports.FsEntryService = FsEntryService;
//export let app = new App()
