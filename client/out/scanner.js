"use strict";
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
var filename_parser_1 = require("./filename-parser");
var Scanner = (function () {
    function Scanner() {
        this.errors = [];
        this.videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"];
    }
    Scanner.prototype.isVideoFile = function (name) {
        return this.videoExts.first(function (t) { return name.endsWith(t); }) != null;
    };
    Scanner.prototype.scan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, folder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.results = [];
                        _i = 0, _a = this.folders;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        folder = _a[_i];
                        return [4, this.scanDir(folder)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    Scanner.prototype.scanDir = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var res, videoFiles, _i, videoFiles_1, file, md, mf, e2_1, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.app.fileService.ListFiles({ Path: dir, IsRecursive: true })];
                    case 1:
                        res = _a.sent();
                        videoFiles = res.Files.filter(function (t) { return _this.isVideoFile(t.Name); });
                        _i = 0, videoFiles_1 = videoFiles;
                        _a.label = 2;
                    case 2:
                        if (!(_i < videoFiles_1.length)) return [3, 9];
                        file = videoFiles_1[_i];
                        return [4, this.app.getFileMetadata(file)];
                    case 3:
                        md = _a.sent();
                        if (md != null && md.tmdbKey != null) {
                            console.log("tmdbId already exists, skipping", { file: file, md: md });
                            return [3, 8];
                        }
                        mf = { file: file, md: md, type: null, parsed: null, fsEntry: null };
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, this.analyze(mf)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e2_1 = _a.sent();
                        e = e2_1;
                        console.warn(e);
                        this.errors.push(e);
                        if (this.errors.length > 3)
                            throw e2_1;
                        return [3, 7];
                    case 7:
                        this.results.push(mf);
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3, 2];
                    case 9: return [2];
                }
            });
        });
    };
    Scanner.prototype.analyze = function (mf, opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (mf.md.scanned != null && mf.md.scanned != "" && (opts == null || !opts.force))
                            return [2];
                        mf.md.scanned = new Date().format("yyyy-MM-dd HH:mm:ss");
                        return [4, this._analyze(mf)];
                    case 1:
                        _a.sent();
                        this.app.byFilename.persist(mf.md);
                        return [2];
                }
            });
        });
    };
    Scanner.prototype._analyze = function (mf) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, path, isTv, media, e, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filename = (mf.fsEntry && mf.fsEntry.basename) || (mf.file && mf.file.Name);
                        path = (mf.fsEntry && mf.fsEntry.key) || (mf.file && mf.file.Path);
                        console.log("getImdbInfo", "start", filename);
                        mf.parsed = new filename_parser_1.FilenameParser().parse(filename);
                        if (mf.parsed == null) {
                            console.log("filename parsing returned null", filename);
                            return [2];
                        }
                        isTv = mf.parsed.season != null;
                        if (!isTv) return [3, 2];
                        return [4, this.app.tmdb.searchTvShows({ query: mf.parsed.name })];
                    case 1:
                        e = _a.sent();
                        media = e.results[0];
                        return [3, 4];
                    case 2: return [4, this.app.tmdb.searchMulti({ query: mf.parsed.name })];
                    case 3:
                        e = _a.sent();
                        media = e.results.first(function (t) { return t.media_type == "tv" || t.media_type == "movie"; });
                        _a.label = 4;
                    case 4:
                        mf.tmdbBasic = media;
                        if (mf.tmdbBasic != null) {
                            mf.type = mf.tmdbBasic.media_type;
                            mf.md.tmdbKey = [mf.tmdbBasic.media_type, mf.tmdbBasic.id].join("|");
                            if (mf.tmdbBasic.media_type == "tv" && mf.parsed.episode != null && mf.parsed.season != null)
                                mf.md.episodeKey = "s" + mf.parsed.season.format("00") + "e" + mf.parsed.episode.format("00");
                        }
                        else {
                            mf.md.tmdbKey = null;
                        }
                        mf.md.lastKnownPath = path;
                        return [2];
                }
            });
        });
    };
    return Scanner;
}());
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map