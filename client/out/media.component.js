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
var core_1 = require("@angular/core");
var utils_1 = require("./utils/utils");
var app_1 = require("./app");
var MediaComponent = (function () {
    function MediaComponent(app) {
        this.app = app;
        this.filter = {
            type: null,
            watched: null,
            groupSimilar: true,
            search: null,
            sortBy: "fsEntry.mtime desc",
        };
        this.pageSize = 20;
        this.skip = 0;
    }
    MediaComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window["_page"] = this;
                        return [4, this.app.init()];
                    case 1:
                        _a.sent();
                        return [4, this.getAvailableMedia()];
                    case 2:
                        _a.sent();
                        return [4, this.getPopularMovies()];
                    case 3:
                        _a.sent();
                        return [4, this.app.scanAllFsEntries()];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.ngOnChanges = function (changes) { };
    MediaComponent.prototype.applyFilter = function () {
        var list = this.allMovies;
        list = this.applyFilterType(list);
        list = this.applyFilterSearch(list);
        list = this.applyFilterWatched(list);
        list = this.applyFilterGroupSimilar(list);
        list = this.applyFilterSortBy(list);
        this.filteredMovies = list;
    };
    MediaComponent.prototype.applyFilterSortBy = function (list) {
        var _this = this;
        var list2 = list;
        if (this.filter.sortBy == null)
            return list2;
        var tokens = this.filter.sortBy.split(' ');
        var key = tokens[0];
        var dir = (tokens[1] || "ASC").toUpperCase();
        if (key == null || key == "")
            return list2;
        var desc = dir == "DESC";
        if (key == "fsEntry.mtime")
            list2 = list.orderBy(function (t) { return t.fsEntry.mtime; }, desc);
        else if (key == "md.episodeKey")
            list2 = list.orderBy(function (t) { return t.md.episodeKey; }, desc);
        else if (key == "name")
            list2 = list.orderBy(function (t) { return _this.getName(t); }, desc);
        else if (key == "fsEntry.basename")
            list2 = list.orderBy(function (t) { return t.fsEntry.basename; }, desc);
        else
            console.log("not implemented sortBy", key);
        return list2;
    };
    MediaComponent.prototype.getType = function (mf) {
        if (mf.type != null)
            return mf.type;
        if (mf.tmdb != null && mf.tmdb.media_type != null)
            return mf.tmdb.media_type;
        if (mf.parsed != null && mf.parsed.episode != null)
            return "tv";
        return null;
    };
    MediaComponent.prototype.applyFilterType = function (list) {
        var _this = this;
        if (this.filter.type == null)
            return list;
        return list.filter(function (t) {
            var type = _this.getType(t);
            return type == _this.filter.type;
        });
    };
    MediaComponent.prototype.getSimilarKey = function (mf) {
        return mf.md && mf.md.tmdbKey || mf.parsed && mf.parsed.name || mf.fsEntry && mf.fsEntry.basename;
    };
    MediaComponent.prototype.applyFilterGroupSimilar = function (list) {
        var _this = this;
        if (!this.filter.groupSimilar)
            return list;
        return list.groupBy(function (t) { return _this.getSimilarKey(t); }).map(function (group) {
            var list2 = group.orderBy(function (t) { return t.md && t.md.episodeKey; });
            var best = list2.first(function (t) { return !_this.isWatched(t); });
            return best || list2.first();
        });
    };
    MediaComponent.prototype.applyFilterSearch = function (list) {
        if (this.filter.search == null || this.filter.search == "" || this.filter.search.trim() == "")
            return list;
        var tokens = this.filter.search.split(' ').map(function (t) { return t.trim().toLowerCase(); });
        return list.filter(function (t) {
            if (t.fsEntry == null)
                return true;
            var name = t.fsEntry.basename.toLowerCase();
            if (name == null)
                return true;
            var x = tokens.every(function (t) { return name.contains(t); });
            return x;
        });
    };
    MediaComponent.prototype.isWatched = function (mf) {
        return mf.md != null && mf.md.watched || false;
    };
    MediaComponent.prototype.applyFilterWatched = function (list) {
        var _this = this;
        if (this.filter.watched == null)
            return list;
        return list.filter(function (t) { return _this.filter.watched == _this.isWatched(t); });
    };
    MediaComponent.prototype.setFilter = function (key, value) {
        this.filter[key] = value;
        this.getAvailableMedia();
    };
    MediaComponent.prototype.scheduleApplyFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, utils_1.promiseSetTimeout(100)];
                    case 1:
                        _a.sent();
                        return [4, this.getAvailableMedia()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.movie_click = function (movie) {
        this.selectedMovie = movie;
        console.log("movie_click", this.selectedMovie);
    };
    MediaComponent.prototype.goBack = function () {
        this.selectedMovie = null;
    };
    MediaComponent.prototype.getPopularMovies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.movies != null && this.movies.length > 0)
                            return [2];
                        return [4, this.app.tmdb.movieGetPopular({ language: "en" })];
                    case 1:
                        e = _a.sent();
                        this.movies = e.results.map(function (t) { return ({ md: {}, tmdb: t }); });
                        console.log(this.movies);
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.prevPage = function () {
        this.skip -= this.pageSize;
        if (this.skip < 0)
            this.skip = 0;
        this.getAvailableMedia();
    };
    MediaComponent.prototype.nextPage = function () {
        if (this.filteredMovies == null)
            return;
        this.skip += this.pageSize;
        if (this.skip >= this.filteredMovies.length) {
            this.skip -= this.pageSize;
        }
        if (this.skip < 0)
            this.skip = 0;
        this.getAvailableMedia();
    };
    MediaComponent.prototype.isLastPage = function () {
        return this.skip + this.pageSize >= this.filteredMovies.length;
    };
    MediaComponent.prototype.getAvailableMedia = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.allMovies == null || (req && req.force))
                    this.getAllMediaFiles();
                this.onAllMoviesChanged();
                return [2];
            });
        });
    };
    MediaComponent.prototype.onFiltersChanged = function () {
        this.onAllMoviesChanged();
    };
    MediaComponent.prototype.onAllMoviesChanged = function () {
        this.applyFilter();
        this.applyPaging();
    };
    MediaComponent.prototype.getAllMediaFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var moreMovies, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.allMovies = [];
                        this.onAllMoviesChanged();
                        _b.label = 1;
                    case 1:
                        if (!!this.noMoreMoviesOnServer) return [3, 6];
                        return [4, this.app.getMediaFiles({ firstResult: this.allMovies.length, maxResults: 500 })];
                    case 2:
                        moreMovies = _b.sent();
                        if (!(moreMovies.length == 0)) return [3, 3];
                        this.noMoreMoviesOnServer = true;
                        return [3, 6];
                    case 3:
                        console.log("Loading more movies");
                        (_a = this.allMovies).push.apply(_a, moreMovies);
                        this.onAllMoviesChanged();
                        return [4, this.app.loadTmdbMediaDetails(moreMovies)];
                    case 4:
                        _b.sent();
                        this.onAllMoviesChanged();
                        _b.label = 5;
                    case 5: return [3, 1];
                    case 6: return [2];
                }
            });
        });
    };
    MediaComponent.prototype.applyPaging = function () {
        this.movies = this.filteredMovies.skip(this.skip).take(this.pageSize);
        console.log({ allMovies: this.allMovies, movies: this.movies, filtered: this.filteredMovies });
    };
    MediaComponent.prototype.getName = function (mf) {
        var name = "";
        if (mf.tmdb != null)
            name = mf.tmdb.name || mf.tmdb.title;
        else
            return mf.fsEntry && mf.fsEntry.basename;
        if (mf.md != null && mf.md.episodeKey != null)
            name += " " + mf.md.episodeKey;
        return name;
    };
    MediaComponent.prototype.canPlay = function (mf) {
        return true;
    };
    MediaComponent.prototype.play = function (mf) {
        return __awaiter(this, void 0, void 0, function () {
            var path, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (mf == null)
                            return [2];
                        path = null;
                        if (path == null && mf.fsEntry != null)
                            path = mf.fsEntry.key;
                        if (!(path == null && mf.md != null)) return [3, 5];
                        file = null;
                        if (!(mf.md.lastKnownPath != null)) return [3, 2];
                        return [4, this.app.fileService.GetFile({ Path: mf.md.lastKnownPath })];
                    case 1:
                        file = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(file == null)) return [3, 4];
                        return [4, this.app.findFile(mf.md.key)];
                    case 3:
                        file = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (file == null)
                            return [2];
                        path = file.Path;
                        _a.label = 5;
                    case 5:
                        if (path == null)
                            return [2];
                        return [4, this.app.fileService.Execute({ Path: path })];
                    case 6:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.tmdbV4Login = function () {
        this.app.tmdbV4.loginToTmdb().then(function (e) { return console.log("LOGIN COMPLETE"); });
    };
    MediaComponent.prototype.tmdbV4Tests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = console).log;
                        return [4, this.app.tmdbV4.accountGetLists({})];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.markAsWatched = function (mf) {
        return this.app.markAsWatched(mf);
    };
    MediaComponent.prototype.addConfigFolder = function () {
        this.app.config.folders.push({ path: null });
    };
    MediaComponent.prototype.tvAiringToday = function () {
        return __awaiter(this, void 0, void 0, function () {
            var favs, airingToday, favIds, favAiringToday, x, x2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.app.tmdb.proxy.getAllPages(function (t) { return t.accountGetFavoriteTVShows({}); })];
                    case 1:
                        favs = _a.sent();
                        console.log("favs", favs.map(function (t) { return t.name; }));
                        return [4, this.app.tmdb.proxy.getAllPages(function (t) { return t.tvGetTVAiringToday({}); })];
                    case 2:
                        airingToday = _a.sent();
                        console.log("airingToday", airingToday.map(function (t) { return t.name; }));
                        console.log(airingToday.map(function (t) { return t.name; }), airingToday);
                        favIds = new Set(favs.map(function (t) { return t.id; }));
                        favAiringToday = airingToday.filter(function (t) { return favIds.has(t.id); });
                        console.log("favAiringToday", favAiringToday.map(function (t) { return t.name; }));
                        return [4, this.app.tmdb.tvGetDetails({ tv_id: favAiringToday[0].id })];
                    case 3:
                        x = _a.sent();
                        return [4, this.app.tmdb.tvGetSeason({ tv_id: favAiringToday[0].id, season_number: x.seasons.last().season_number })];
                    case 4:
                        x2 = _a.sent();
                        console.log("TV DETAILS", x, x2);
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.tvOnTheAir = function () {
        return __awaiter(this, void 0, void 0, function () {
            var onTheAir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.app.tmdb.proxy.getAllPages(function (t) { return t.tvGetTVOnTheAir({}); })];
                    case 1:
                        onTheAir = _a.sent();
                        console.log(onTheAir.map(function (t) { return t.name; }), onTheAir);
                        return [2];
                }
            });
        });
    };
    MediaComponent.prototype.scan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4, this.app.appService.scanForMedia()];
                    case 1:
                        _a.scanStatus = _c.sent();
                        return [4, utils_1.promiseSetTimeout(3000)];
                    case 2:
                        _c.sent();
                        this.getAvailableMedia({ force: true });
                        _c.label = 3;
                    case 3:
                        if (!(this.scanStatus != null && this.scanStatus.finished == null)) return [3, 6];
                        _b = this;
                        return [4, this.app.appService.scanStatus()];
                    case 4:
                        _b.scanStatus = _c.sent();
                        return [4, utils_1.promiseSetTimeout(3000)];
                    case 5:
                        _c.sent();
                        return [3, 3];
                    case 6: return [2];
                }
            });
        });
    };
    MediaComponent.prototype.reAnalyze = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.app.analyze(this.movies, { force: true })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    __decorate([
        utils_1.ReusePromiseIfStillRunning(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], MediaComponent.prototype, "getAllMediaFiles", null);
    MediaComponent = __decorate([
        core_1.Component({
            selector: 'my-media',
            templateUrl: '/src/media.component.html',
            styleUrls: ['_res_/src/media.component.css'],
        }),
        __metadata("design:paramtypes", [app_1.App])
    ], MediaComponent);
    return MediaComponent;
}());
exports.MediaComponent = MediaComponent;
//# sourceMappingURL=media.component.js.map