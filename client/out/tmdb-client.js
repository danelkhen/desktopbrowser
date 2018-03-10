"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var client_1 = require("./tmdb/v3/client");
var utils_1 = require("./utils/utils");
var TmdbClient = (function (_super) {
    __extends(TmdbClient, _super);
    function TmdbClient() {
        var _this = _super.call(this) || this;
        _this.tvShowWatchlistIds = new Set();
        _this.movieWatchlistIds = new Set();
        _this.storage = localStorage;
        _this.getMovieOrTvByTypeAndIdCache = new Map();
        _this.failed = [];
        _this.rated = new Set();
        _this.watched = new Set();
        console.log("TmdbClient ctor", _this);
        var base = _this.proxy.onInvoke;
        _this.proxy.onInvoke = function (pc) {
            if (_this.hasSessionId()) {
                var prm = pc.args[0];
                if (prm == null) {
                    prm = {};
                    pc.args[0] = prm;
                }
                if (prm.session_id == null && _this.session_id != null)
                    prm.session_id = _this.session_id;
                if (prm.account_id == null && _this.account_id != null)
                    prm.account_id = _this.account_id;
            }
            return base(pc).then(function (t) { return _this.fixResponse(t, pc.name); });
        };
        return _this;
    }
    TmdbClient.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, this.getApiConfiguration({})];
                    case 1:
                        _a.configuration = _b.sent();
                        return [4, this.onLogin()];
                    case 2:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    TmdbClient.prototype.onLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    TmdbClient.prototype.accountGetDetails = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4, _super.prototype.accountGetDetails.call(this, req)];
                    case 1:
                        _a.account = _b.sent();
                        if (this.account != null)
                            this.account_id = this.account.id;
                        return [2, this.account];
                    case 2:
                        e_1 = _b.sent();
                        console.warn("accountGetDetails failed", e_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    TmdbClient.prototype.detectMediaType = function (media, methodName) {
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
            console.log("unknown media type", { media: media, methodName: methodName });
    };
    TmdbClient.prototype.fixResponse = function (res, methodName) {
        var _this = this;
        if (res == null || typeof (res) != "object")
            return res;
        var movie = res;
        var props = ["poster_path", "backdrop_path"];
        props.forEach(function (prop) {
            if (movie[prop] == null)
                return;
            _this.detectMediaType(movie, methodName);
            var urlProp = prop.replace("_path", "_url");
            var imagesProp = prop.replace("_path", "");
            movie[urlProp] = _this.getImageUrl(movie, prop);
            var images = movie[imagesProp];
            if (images == null) {
                images = {};
                movie[imagesProp] = images;
            }
            _this.getImageSizes(prop).forEach(function (size) { return images[size] = _this.getImageUrl(movie, prop, size); });
        });
        Object.values(res).forEach(function (t) { return _this.fixResponse(t, methodName); });
        return res;
    };
    TmdbClient.prototype.getImageSizes = function (prop) {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        var c = this.configuration.images;
        if (prop == "backdrop_path")
            return c.backdrop_sizes;
        else if (prop == "poster_path")
            return c.poster_sizes;
        return null;
    };
    TmdbClient.prototype.getImageUrl = function (movie, prop, size) {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        var c = this.configuration.images;
        if (size == null)
            size = this.getImageSizes(prop)[0];
        return "" + c.base_url + size + movie[prop];
    };
    Object.defineProperty(TmdbClient.prototype, "request_token", {
        get: function () { return this.storage.tmdb_request_token; },
        set: function (value) { this.storage.tmdb_request_token = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmdbClient.prototype, "session_id", {
        get: function () { return this.storage.tmdb_session_id; },
        set: function (value) { this.storage.tmdb_session_id = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmdbClient.prototype, "account_id", {
        get: function () { return utils_1.tryParseInt(this.storage.tmdb_account_id); },
        set: function (value) { this.storage.tmdb_account_id = String(value); },
        enumerable: true,
        configurable: true
    });
    TmdbClient.prototype.hasSessionId = function () {
        return this.session_id != null && this.session_id != "";
    };
    TmdbClient.prototype.loginToTmdb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._loginToTmdb()];
                    case 1:
                        _a.sent();
                        return [4, this.onLogin()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TmdbClient.prototype._loginToTmdb = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.addEventListener("message", function (e) {
                console.log("messsage", e.data, e);
                var x = e.data;
                if (x.approved != "true") {
                    reject();
                    return;
                }
                _this.authenticationCreateSession({ request_token: x.request_token })
                    .then(function (e) {
                    console.log("session", e);
                    if (!e.success) {
                        reject();
                        return;
                    }
                    _this.session_id = e.session_id;
                    resolve();
                });
            });
            _this.authenticationCreateRequestToken({}).then(function (e) {
                _this.request_token = e.request_token;
                console.log(e);
                var win = window.open("/tmdb-login.html?request_token=" + _this.request_token);
            });
        });
    };
    TmdbClient.prototype.getMovieOrTvByTypeAndId = function (typeAndId) {
        return __awaiter(this, void 0, void 0, function () {
            var media, tokens, media_type, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeAndId == null)
                            return [2, null];
                        media = this.getMovieOrTvByTypeAndIdCache.get(typeAndId);
                        if (media !== undefined)
                            return [2, media];
                        tokens = typeAndId.split("|");
                        if (tokens.length < 2)
                            return [2, null];
                        media_type = tokens[0];
                        id = tokens[1];
                        if (!(media_type == "movie")) return [3, 2];
                        return [4, this.movieGetDetails({ movie_id: id, })];
                    case 1:
                        media = (_a.sent());
                        return [3, 4];
                    case 2:
                        if (!(media_type == "tv")) return [3, 4];
                        return [4, this.tvGetDetails({ tv_id: id, })];
                    case 3:
                        media = (_a.sent());
                        _a.label = 4;
                    case 4:
                        this.getMovieOrTvByTypeAndIdCache.set(typeAndId, media);
                        return [2, media];
                }
            });
        });
    };
    TmdbClient.prototype.isWatchedOrRated = function (typeAndId) {
        if (typeAndId == null)
            return null;
        if (this.rated.has(typeAndId))
            return true;
        if (this.watched.has(typeAndId))
            return true;
        return false;
    };
    TmdbClient.prototype.markAsWatched = function (typeAndId, watched, refreshList) {
        if (watched === void 0) { watched = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    TmdbClient.prototype.markAllRatedAsWatched = function () {
        var _this = this;
        var ratedButNotWatched = utils_1.setMinus(this.rated, this.watched);
        return utils_1.promiseEach(Array.from(ratedButNotWatched), function (id) { return _this.markAsWatched(id, true, false); });
    };
    TmdbClient.prototype.importTvFavs = function (names) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, names_1, name_1, res, show;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, names_1 = names;
                        _a.label = 1;
                    case 1:
                        if (!(_i < names_1.length)) return [3, 5];
                        name_1 = names_1[_i];
                        return [4, this.searchTvShows({ query: name_1 })];
                    case 2:
                        res = _a.sent();
                        show = res.results[0];
                        if (show == null) {
                            console.log("can't find", name_1);
                            return [3, 4];
                        }
                        console.log(name_1, show.id);
                        return [4, this.accountMarkasFavorite({ body: { media_type: "tv", media_id: show.id, favorite: true } })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3, 1];
                    case 5: return [2];
                }
            });
        });
    };
    return TmdbClient;
}(client_1.TmdbV3Client));
exports.TmdbClient = TmdbClient;
//# sourceMappingURL=tmdb-client.js.map