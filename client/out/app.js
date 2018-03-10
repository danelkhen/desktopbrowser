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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils/global");
var tmdb_client_1 = require("./tmdb-client");
var tmdb_client_v4_1 = require("./tmdb-client-v4");
var service_1 = require("./service");
var utils_1 = require("./utils/utils");
var scanner_1 = require("./scanner");
var filename_parser_1 = require("./filename-parser");
var App = (function () {
    function App() {
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
    App.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.initConfig()];
                    case 1:
                        _a.sent();
                        return [4, this.tmdb.init()];
                    case 2:
                        _a.sent();
                        return [4, this.getSavedRatings()];
                    case 3:
                        _a.sent();
                        return [4, this.getSavedWatchlists()];
                    case 4:
                        _a.sent();
                        return [4, this.onInit()];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    App.prototype.onInit = function () {
        var t = this.tmdb;
        var inWatchlist = utils_1.setPlus(t.movieWatchlistIds, t.tvShowWatchlistIds);
        var x = {
            rated: t.rated,
            watched: t.watched,
            inWatchlist: inWatchlist,
            movieWatchlistIds: t.movieWatchlistIds,
            tvShowWatchlistIds: t.tvShowWatchlistIds,
        };
        Object.keys(x).forEach(function (key) { return x[key] = Array.from(x[key]); });
        console.log("onInit", x);
    };
    App.prototype.initConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.appService.getConfig()];
                    case 1:
                        config = _a.sent();
                        this.config = config || {};
                        if (this.config.folders == null)
                            this.config.folders = [];
                        return [2];
                }
            });
        });
    };
    App.prototype.saveConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.appService.saveConfig(this.config)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    App.prototype.createScanner = function () {
        var scanner = new scanner_1.Scanner();
        scanner.app = this;
        scanner.folders = this.config.folders.map(function (t) { return t.path; });
        return scanner;
    };
    App.prototype.scan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.appService.invoke(function (t) { return t.scanForMedia(); })];
                    case 1:
                        x = _a.sent();
                        console.log(x);
                        return [2];
                }
            });
        });
    };
    App.prototype.downloadRatings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.tmdb.proxy.getAllPages(function (t) { return t.accountGetRatedMovies({}); }, function (res) { return _this.savePage("ratings", "movie", res.page, res.results.map(function (t) { return t.id; })); })];
                    case 1:
                        _a.sent();
                        return [4, this.tmdb.proxy.getAllPages(function (t) { return t.accountGetRatedTVShows({}); }, function (res) { return _this.savePage("ratings", "tv", res.page, res.results.map(function (t) { return t.id; })); })];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    App.prototype.downloadWatchlists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.tmdb.proxy.getAllPages(function (t) { return t.accountGetMovieWatchlist({}); }, function (res) { return _this.savePage("watchlist", "movie", res.page, res.results.map(function (t) { return t.id; })); })];
                    case 1:
                        _a.sent();
                        return [4, this.tmdb.proxy.getAllPages(function (t) { return t.accountGetTVShowWatchlist({}); }, function (res) { return _this.savePage("watchlist", "tv", res.page, res.results.map(function (t) { return t.id; })); })];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    App.prototype.savePage = function (name, media_type, page, ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyValue.persist({ key: "tmdb_" + name + "_" + media_type + "_page_" + page, value: { ids: ids } })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    App.prototype.getSavedRatings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var pages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyValue.findAllWithKeyLike({ like: "tmdb_ratings_%" })];
                    case 1:
                        pages = _a.sent();
                        pages.forEach(function (page) {
                            if (page.key.contains("_tv_"))
                                page.value.ids.forEach(function (id) { return _this.tmdb.rated.add("tv|" + id); });
                            else if (page.key.contains("_movie_"))
                                page.value.ids.forEach(function (id) { return _this.tmdb.rated.add("movie|" + id); });
                        });
                        return [2];
                }
            });
        });
    };
    App.prototype.getSavedWatchlists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var pages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyValue.findAllWithKeyLike({ like: "tmdb_watchlist_%" })];
                    case 1:
                        pages = _a.sent();
                        pages.forEach(function (page) {
                            if (page.key.contains("_tv_"))
                                page.value.ids.forEach(function (id) { return _this.tmdb.tvShowWatchlistIds.add(id); });
                            else if (page.key.contains("_movie_"))
                                page.value.ids.forEach(function (id) { return _this.tmdb.movieWatchlistIds.add(id); });
                        });
                        return [2];
                }
            });
        });
    };
    App.prototype.getAllFilesMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.byFilename.find()];
            });
        });
    };
    App.prototype.getFileMetadata = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var name, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = file;
                        if (file instanceof File)
                            name = file.Name;
                        return [4, this.byFilename.findOneById({ id: name })];
                    case 1:
                        x = _a.sent();
                        if (x == null)
                            x = { key: name };
                        return [2, x];
                }
            });
        });
    };
    App.prototype.analyze = function (mfs, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, mfs_1, mf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, mfs_1 = mfs;
                        _a.label = 1;
                    case 1:
                        if (!(_i < mfs_1.length)) return [3, 4];
                        mf = mfs_1[_i];
                        if (mf.tmdb != null && (opts == null || !opts.force))
                            return [3, 3];
                        return [4, this.createScanner().analyze(mf, opts)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    App.prototype.getMovieOrTvByTypeAndId = function (tmdbKey) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, x, x2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (tmdbKey == null || tmdbKey == "" || tmdbKey.split("|").some(function (t) { return t.length == 0; }))
                            return [2, null];
                        cacheKey = "tmdb|details|" + tmdbKey;
                        return [4, this.keyValue.findOneById({ id: cacheKey })];
                    case 1:
                        x = _a.sent();
                        if (x != null && x.value != null)
                            return [2, x.value];
                        return [4, this.tmdb.getMovieOrTvByTypeAndId(tmdbKey)];
                    case 2:
                        x2 = _a.sent();
                        this.keyValue.persist({ key: cacheKey, value: x2 });
                        return [2, x2];
                }
            });
        });
    };
    App.prototype.loadTmdbMediaDetails = function (mfs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, mfs_2, mf, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, mfs_2 = mfs;
                        _b.label = 1;
                    case 1:
                        if (!(_i < mfs_2.length)) return [3, 5];
                        mf = mfs_2[_i];
                        if (mf.tmdb != null)
                            return [3, 4];
                        return [4, this.analyze([mf])];
                    case 2:
                        _b.sent();
                        _a = mf;
                        return [4, this.getMovieOrTvByTypeAndId(mf.md.tmdbKey)];
                    case 3:
                        _a.tmdb = _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3, 1];
                    case 5: return [2, mfs];
                }
            });
        });
    };
    App.prototype.findFile = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, folder, res, file;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.config.folders;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        folder = _a[_i];
                        return [4, this.fileService.ListFiles({ Path: folder.path, IsRecursive: true })];
                    case 2:
                        res = _b.sent();
                        file = res.Files.first(function (t) { return t.Name == name; });
                        if (file != null)
                            return [2, file];
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    App.prototype.markAsWatched = function (mf) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mf.md.watched = true;
                        if (!(mf.md.tmdbKey != null)) return [3, 2];
                        return [4, this.tmdb.markAsWatched(mf.md.tmdbKey)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4, this.byFilename.persist(mf.md)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    App.prototype.fsEntryToMediaFile = function (x) {
        return { fsEntry: x };
    };
    App.prototype.parseFilename = function (mf) {
        if (mf.parsed != null)
            return;
        if (mf.fsEntry == null)
            return;
        var name = mf.fsEntry.basename;
        mf.parsed = new filename_parser_1.FilenameParser().parse(mf.fsEntry.basename);
    };
    App.prototype.getMediaFiles = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.appService.getMediaFiles(req)];
                    case 1:
                        x = _a.sent();
                        x.forEach(function (t) {
                            if (t.md == null) {
                                t.md = { key: t.fsEntry.basename };
                            }
                            _this.parseFilename(t);
                        });
                        return [2, x];
                }
            });
        });
    };
    App.prototype.getLatestFsEntries = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fsEntryService.find({ order: { "mtime": "DESC" }, })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    App.prototype.scanAllFsEntries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, mfs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("STARTED scanAllFsEntries");
                        req = { firstResult: 0, maxResults: 500, notScannedOnly: true };
                        _a.label = 1;
                    case 1:
                        if (!true) return [3, 4];
                        return [4, this.getMediaFiles(req)];
                    case 2:
                        mfs = _a.sent();
                        if (mfs.length == 0) {
                            console.log("Finished scanAllFsEntries");
                            return [2];
                        }
                        req.firstResult += req.maxResults;
                        return [4, this.analyze(mfs)];
                    case 3:
                        _a.sent();
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
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
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map