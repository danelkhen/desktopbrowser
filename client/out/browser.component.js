"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var service_1 = require("./service");
var selection_1 = require("./utils/selection");
var array_view_1 = require("./utils/array-view");
var router_1 = require("@angular/router");
require("rxjs/add/operator/map");
var utils_1 = require("./utils/utils");
var filename_parser_1 = require("./filename-parser");
var scanner_1 = require("./scanner");
var app_1 = require("./app");
var websocket = require("./websocket");
var proxy = require("./utils/proxy");
var utils_2 = require("./utils/utils");
var BrowserComponent = (function () {
    function BrowserComponent(route, router, location, server, app) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.location = location;
        this.server = server;
        this.app = app;
        this.FOLDERS_FIRST = "foldersFirst";
        this.quickFindText = "";
        this.theme = "dark";
        this.clockText = "";
        this.tbPathText = "";
        this.quickFindTimer = new Timer(function () { return _this.quickFindTimer_tick(); });
        this.TYPE = utils_1.nameof(function (t) { return t.type; });
        this.NAME = utils_1.nameof(function (t) { return t.Name; });
        this.SIZE = utils_1.nameof(function (t) { return t.Size; });
        this.MODIFIED = utils_1.nameof(function (t) { return t.Modified; });
        this.EXTENSION = utils_1.nameof(function (t) { return t.Extension; });
        this.HAS_INNER_SELECTION = utils_1.nameof(function (t) { return t.hasInnerSelection; });
        this.columns = [this.TYPE, this.NAME, this.MODIFIED, this.SIZE, this.EXTENSION];
        this.replCmd = "";
        this.replOutput = [];
        console.log({ route: route, router: router, location: location, server: server });
        this.Req = {};
        this.Res = { Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null }, File: null, Files: null };
        this.FileSelection = new selection_1.Selection();
        this.FileSelection.Changed = function (e) { return _this.FileSelection_Changed(e); };
        this.filesView = new array_view_1.ArrayView(function () { return _this.Res.Files; });
        this.filesView.pageSize = 200;
        window["_browser"] = this;
        window["websocket"] = websocket;
        window["proxy"] = proxy;
        var x = new filename_parser_1.FilenameParser();
        window["filenameParser"] = x;
    }
    BrowserComponent.prototype.ngOnInit = function () {
        var _this = this;
        document.body.classList.add("db");
        console.log("ngOnOnit");
        this.location.subscribe(function (t) { return console.log("location changed", { location: t }); });
        this.route.params.subscribe(function (params) {
            console.log("PARAMS", { params: params, p: params["p"] });
        });
        var nameof2 = utils_1.Name.of();
        this.filesView.getCreateSort(this.SIZE).descendingFirst = true;
        this.filesView.getCreateSort(this.MODIFIED).descendingFirst = true;
        this.filesView.getCreateSort(this.HAS_INNER_SELECTION).descendingFirst = true;
        this.filesView.getCreateSort(this.HAS_INNER_SELECTION).selector = function (t) { return _this.hasInnerSelection(t); };
        this.filesView.getCreateSort(this.TYPE).valueComparerFunc = function (x, y) { return _this.getFileTypeOrder(y) - _this.getFileTypeOrder(x); };
        this.filesView.activeSort = [this.TYPE];
        this.filesView.targetChanged.on(function () { return _this.FileSelection.AllItems = _this.filesView.target; });
        $(window).resize(function (e) { return _this.recalcHeight(); });
        this.recalcHeight();
        console.log("baseDbGetAll");
        this.init();
    };
    BrowserComponent.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, this.app.getAllFilesMetadata()];
                    case 1:
                        _a.filesMd = _b.sent();
                        this.enableThemes();
                        this.Win = window;
                        this.UpdateClock();
                        this.Req = {};
                        $(this.Win).keydown(function (e) { return _this.Win_keydown(e.originalEvent); });
                        $(this.Win).on('keyup keydown', function (e) { _this.isShiftDown = e.shiftKey; });
                        this.Win.addEventListener("mousedown", function (e) { return _this.toggleDropDown(e); });
                        this.route.queryParams.subscribe(function (t) { return _this.onUrlChanged(t); });
                        return [2];
                }
            });
        });
    };
    BrowserComponent.prototype.onUrlChanged = function (req) {
        console.log("onUrlChanged", req);
        this.LoadReq();
        this.ListFiles();
    };
    BrowserComponent.prototype.ngOnChanges = function (changes) {
        console.log("ngOnChanges", changes);
    };
    BrowserComponent.prototype.recalcHeight = function () {
        var headerEl = document.querySelector("header");
        if (headerEl == null)
            return;
        this.lastHeight = headerEl.offsetHeight;
        console.log("recalcHeight", this.lastHeight);
        $(".fixed-placeholder").css({ height: this.lastHeight + "px" });
    };
    BrowserComponent.prototype.enableThemes = function () {
        var theme = localStorage.getItem("theme");
        if (theme != null && theme != "")
            this.setTheme(theme, false);
    };
    BrowserComponent.prototype.toggleDropDown = function (e) {
        if (e.defaultPrevented)
            return;
        var el = $(e.target);
        var dropDownEl = el.closest(".dropdown");
        var isInDropDown = dropDownEl.length > 0;
        var isInToggleBtn = el.closest(".dropdown-toggle").length > 0;
        if (isInDropDown && !isInToggleBtn)
            return;
        $(".dropdown.show").not(dropDownEl).removeClass("show");
        dropDownEl.toggleClass("show");
    };
    BrowserComponent.prototype.toggle = function (name) {
        var value = this.Req[name];
        var newValue = !value;
        console.log("toggle", { name: name, value: value, newValue: newValue });
        this.Req[name] = newValue;
        this.navigateToReq();
    };
    BrowserComponent.prototype.disableSorting = function () {
        this.Req.sortBy = null;
        this.Req.sortByDesc = false;
        this.Req.foldersFirst = false;
        this.Req.ByInnerSelection = false;
        this.navigateToReq();
    };
    BrowserComponent.prototype.isSortingDisabled = function () {
        return this.Req.sortBy == null && !this.Req.foldersFirst && this.Req.ByInnerSelection == null;
    };
    BrowserComponent.prototype.orderBy = function (key) {
        var def = this.filesView.getCreateSort(key);
        if (this.Req.sortBy == key) {
            this.Req.sortByDesc = !this.Req.sortByDesc;
        }
        else {
            this.Req.sortBy = key;
            this.Req.sortByDesc = def.descendingFirst;
        }
        this.navigateToReq();
    };
    BrowserComponent.prototype.applySort = function () {
        var key = this.Req.sortBy;
        var active = [];
        if (this.Req.foldersFirst && key != this.TYPE)
            active.push(this.TYPE);
        if (this.Req.ByInnerSelection && key != this.HAS_INNER_SELECTION)
            active.push(this.HAS_INNER_SELECTION);
        if (key != null) {
            active.push(key);
            this.filesView.getCreateSort(key).descending = this.Req.sortByDesc;
        }
        this.filesView.activeSort = active;
        console.log("sort", this.filesView.dumpActiveSort());
    };
    BrowserComponent.prototype.setTheme = function (theme, remember) {
        if (remember === void 0) { remember = true; }
        if (!remember)
            return;
        localStorage.setItem("theme", theme);
    };
    BrowserComponent.prototype.UpdateClock = function () {
        var _this = this;
        this.clockText = new Date().format("HH:mm\nddd, MMM d");
        window.setTimeout(function () { return _this.UpdateClock(); }, 5000);
    };
    BrowserComponent.prototype.quickFindTimer_tick = function () {
        this.quickFindText = "";
    };
    BrowserComponent.prototype.tbQuickFind_input = function (e) {
        this.quickFind();
        this.quickFindTimer.set(2000);
    };
    BrowserComponent.prototype.quickFind = function () {
        var list = this.filesView.target;
        var s = this.quickFindText.toLowerCase();
        var item = list.first(function (t) { return t.Name.toLowerCase().contains(s); });
        if (item == null)
            return;
        this.FileSelection.SetSelection([item]);
    };
    BrowserComponent.prototype.Win_keydown = function (e) {
        if (e.defaultPrevented)
            return;
        if ($(e.target).is("input,select"))
            return;
        $("#tbQuickFind").focus();
        this.tbQuickFind_keydown(e);
    };
    BrowserComponent.prototype.tbQuickFind_keydown = function (e) {
        this.FileSelection.KeyDown(e);
        if (e.defaultPrevented)
            return;
        if (e.keyCode == Keys.Enter) {
            var file = this.FileSelection.SelectedItems.last();
            if (file == null)
                return;
            e.preventDefault();
            this.Open(this.FileSelection.SelectedItems.last());
        }
    };
    BrowserComponent.prototype.OpenInNewWindow = function (p) {
        this.Win.open(p, "_blank");
    };
    BrowserComponent.prototype.LoadReq = function () {
        var x = { p: null };
        QueryString.parse(null, x, null);
        var req = x.p != null && x.p != "" ? JSON.parse(x.p) : {};
        this.Req = req;
        this.onPathChanged();
        console.info("LoadReq", this.Req);
    };
    BrowserComponent.prototype.ListFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, req2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("ListFiles");
                        req = this.Req;
                        if (!this.Req.FolderSize) return [3, 2];
                        req2 = __assign({}, req);
                        req2.FolderSize = false;
                        return [4, this._ListFiles(req2)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4, this._ListFiles(req)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    BrowserComponent.prototype._ListFiles = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, websocket.invoke(function (t) { return t.fileService.ListFiles(req); })];
                    case 1:
                        res = _a.sent();
                        if (res == null)
                            return [2];
                        this.Res = res;
                        this.onFilesChanged();
                        return [2];
                }
            });
        });
    };
    BrowserComponent.prototype.GotoPrevSibling = function () {
        this.GotoFolder(this.Res.Relatives.PreviousSibling);
    };
    BrowserComponent.prototype.GotoNextSibling = function () {
        this.GotoFolder(this.Res.Relatives.NextSibling);
    };
    BrowserComponent.prototype.GotoParentDir = function () {
        this.GotoFolder(this.Res.Relatives.ParentFolder);
    };
    BrowserComponent.prototype.GotoFolder = function (file) {
        this.GotoPath(file.Path);
    };
    BrowserComponent.prototype.GotoPath = function (path) {
        this.Req.Path = path;
        this.navigateToReq();
    };
    BrowserComponent.prototype.GotoPath2 = function (path) {
        if (!this.Req.KeepView) {
            this.Req = {};
        }
        this.Req.Path = path;
        this.onPathChanged();
        this.navigateToReq();
    };
    BrowserComponent.prototype.Path_LinuxToWin = function (path) {
        if (String.isNullOrEmpty(path))
            return path;
        if (path == "/") {
            path = "";
        }
        else if (path.startsWith("/net/")) {
            var tokens = path.split('/');
            path = "\\\\" + tokens.skip(2).join("\\");
        }
        else {
            path = path.substr(1);
            var tokens = path.split('/');
            tokens[0] += ":";
            path = tokens.join("\\");
        }
        if (path.endsWith("\\"))
            path = path.removeLast(1);
        return path;
    };
    BrowserComponent.prototype.Path_WinToLinux = function (path) {
        if (String.isNullOrEmpty(path))
            return path;
        var isNetworkShare = path.startsWith("\\\\");
        if (isNetworkShare)
            path = "net/" + path.substr(2);
        var tokens = path.split('\\');
        if (!isNetworkShare)
            tokens[0] = tokens[0].replaceAll(":", "");
        path = tokens.join("/");
        path = encodeURI(path);
        path = "/" + path;
        if (!path.endsWith("/"))
            path += "/";
        return path;
    };
    BrowserComponent.prototype.serializeReq = function (req) {
        var q = "?p=" + encodeURIComponent(JSON.stringify(this.Req));
        return q;
    };
    BrowserComponent.prototype.navigateToReq = function () {
        console.log("navigateToReq", this.Req);
        this.router.navigate([""], { queryParams: { p: JSON.stringify(this.Req) } });
    };
    BrowserComponent.prototype.GetDefaultFileComparer = function () {
        return new Array().ItemGetter(function (t) { return t.IsFolder; }).ToComparer();
    };
    BrowserComponent.prototype.grdFiles_mousedown = function (e, file) {
        this.FileSelection.Click(file, e.ctrlKey, e.shiftKey);
    };
    BrowserComponent.prototype.grdFiles_click = function (e, file) {
        var target = $(e.target);
        if (!target.is("a.Name"))
            return;
        e.preventDefault();
        this.Open(file);
    };
    BrowserComponent.prototype.grdFiles_dblclick = function (e, file) {
        var target = $(e.target);
        if (file == null)
            return;
        e.preventDefault();
        this.Open(file);
    };
    BrowserComponent.prototype.GetFileClass = function (file) {
        var map = {
            folder: "layers",
            file: "file-empty",
            link: "link",
        };
        var icon = map[file.type];
        return "lnr lnr-" + icon;
    };
    BrowserComponent.prototype.onFilesChanged = function () {
        this.applySort();
        this.filesView.refresh();
        this.FileSelection.AllItems = this.filesView.target;
        this.FileSelection.SelectedItems.clear();
        var selectedFileName = this.GetSelection(this.Res.File.Name);
        if (String.isNotNullOrEmpty(selectedFileName)) {
            var files = this.FileSelection.AllItems.where(function (t) { return t.Name == selectedFileName; });
            this.FileSelection.SetSelection(files);
        }
        this.recalcHeight();
    };
    BrowserComponent.prototype.FileSelection_Changed = function (e) {
        var file = this.FileSelection.SelectedItems.last();
        var filename = null;
        if (file != null)
            filename = file.Name;
        this.SaveSelection(this.Res.File.Name, filename);
        this.verifySelectionInView();
    };
    BrowserComponent.prototype.verifySelectionInView = function () {
        return __awaiter(this, void 0, void 0, function () {
            var el, container, containerHeight, top, bottom, top2, bottom2, finalTop, finalBottom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, utils_2.sleep(10)];
                    case 1:
                        _a.sent();
                        el = $('.Selected')[0];
                        if (el == null)
                            return [2];
                        container = document.body;
                        containerHeight = container.clientHeight - 100;
                        top = el.offsetTop;
                        bottom = el.offsetTop + el.offsetHeight;
                        top2 = container.scrollTop;
                        bottom2 = container.scrollTop + containerHeight;
                        console.log({ top: top, bottom: bottom, top2: top2, bottom2: bottom2, containerHeight: containerHeight });
                        finalTop = null;
                        if (top < top2) {
                            finalTop = top;
                        }
                        else if (bottom > bottom2) {
                            finalBottom = bottom;
                            finalTop = finalBottom - containerHeight;
                        }
                        if (finalTop != null) {
                            console.log("scrolling", top2, finalTop);
                            container.scrollTop = finalTop;
                        }
                        return [2];
                }
            });
        });
    };
    BrowserComponent.prototype.DeleteAndRefresh = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileOrFolder, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file == null)
                            return [2];
                        fileOrFolder = file.IsFolder ? "folder" : "file";
                        if (!this.Win.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path))
                            return [2];
                        return [4, this.server.Delete({ Path: file.Path })];
                    case 1:
                        res = _a.sent();
                        return [2, this.ListFiles()];
                }
            });
        });
    };
    BrowserComponent.prototype.TrashAndRefresh = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileOrFolder, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file == null)
                            return [2];
                        fileOrFolder = file.IsFolder ? "folder" : "file";
                        return [4, this.server.trash({ Path: file.Path })];
                    case 1:
                        res = _a.sent();
                        return [2, this.ListFiles()];
                }
            });
        });
    };
    BrowserComponent.prototype.DeleteOrTrash = function (file) {
        if (this.isShiftDown)
            return this.DeleteAndRefresh(file);
        return this.TrashAndRefresh(file);
    };
    BrowserComponent.prototype.Open = function (file) {
        if (file == null)
            return Promise.resolve();
        if (file.IsFolder || file.type == "link") {
            this.GotoFolder(file);
            return Promise.resolve();
        }
        var prompt = false;
        if (file.Extension != null) {
            var ext = file.Extension.toLowerCase();
            var blackList = [".exe", ".bat", ".com"];
            if (blackList.contains(ext)) {
                prompt = true;
            }
        }
        else {
            prompt = true;
        }
        if (prompt && !this.Win.confirm("This is an executable file, are you sure you want to run it?"))
            return Promise.resolve();
        return this.Execute(file).then(function (res) { return console.info(res); });
    };
    BrowserComponent.prototype.Execute = function (file) {
        return this.server.Execute({ Path: file.Path });
    };
    BrowserComponent.prototype.Explore = function (file) {
        return this.server.Explore({ Path: file.Path });
    };
    BrowserComponent.prototype.FormatFriendlyDate = function (value) {
        if (value == null)
            return "";
        return value.ToDefaultDate().ToFriendlyRelative2();
    };
    BrowserComponent.prototype.FormatFriendlySize = function (value) {
        if (value == null)
            return "";
        return value.ToFriendlySize();
    };
    BrowserComponent.prototype.getFileNameWithoutExtension = function (file) {
        if (file.IsFolder)
            return file.Name;
        var s = file.Name;
        var index = s.lastIndexOf(".");
        if (index < 0)
            return s;
        s = s.substr(0, index);
        return s;
    };
    BrowserComponent.prototype.hasInnerSelection = function (file) {
        return file != null && file.IsFolder && this.GetSelection(file.Name) != null;
    };
    BrowserComponent.prototype.GetRowClass = function (file, index) {
        var s = "FileRow";
        if (file.IsFolder) {
            s += " IsFolder";
            var folderHasSelection = this.GetSelection(file.Name) != null;
            if (folderHasSelection)
                s += " HasInnerSelection";
        }
        if (!file.IsFolder)
            s += " IsFile";
        if (this.FileSelection.SelectedItems.contains(file))
            s += " Selected";
        return s;
    };
    BrowserComponent.prototype.GetSubtitleSearchLink = function (File) {
        if (File == null)
            return null;
        var s = this.GetFilenameForSearch(File.Name);
        return "https://www.google.com/search?q=" + encodeURIComponent(s + " eng subscene");
    };
    BrowserComponent.prototype.GetGoogleSearchLink = function (File) {
        if (File == null)
            return null;
        var s = this.GetFilenameForSearch(File.Name);
        return "https://www.google.com/search?q=" + encodeURIComponent(s);
    };
    BrowserComponent.prototype.GetFilenameForSearch = function (s) {
        var tokens = s.split(/[ \.\-]/).select(function (t) { return t.toLowerCase(); });
        var ignoreWords = ["xvid", "720p", "1080p", "dimension", "sample", "nfo", "par2"].selectToObject(function (t) { return t; }, function (t) { return true; });
        var list = [];
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (ignoreWords[token])
                break;
            if (token.length == 3) {
                var season = this.TryParse(token.substr(0, 1));
                var episode = this.TryParse(token.substr(1));
                if (season != null && episode != null && episode < 30) {
                    var normalized = "S" + season.format("00") + "E" + episode.format("00");
                    list.add(normalized);
                    break;
                }
            }
            list.add(token);
        }
        var s2 = list.join(" ");
        return s2;
    };
    BrowserComponent.prototype.TryParse = function (s) {
        var x = parseInt(s);
        if (isNaN(x))
            return null;
        return x;
    };
    BrowserComponent.prototype.tmdbLogin = function () {
        return this.app.tmdb.loginToTmdb();
    };
    BrowserComponent.prototype.getImdbInfo = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var info, isTv, e, e3_1, e2, show, e3_2, e3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        info = new filename_parser_1.FilenameParser().parse(file.Name);
                        isTv = info.season != null;
                        return [4, this.app.tmdb.searchMovies({ query: info.name, year: info.year })];
                    case 1:
                        e = _a.sent();
                        this.movie = e.results[0];
                        console.log(this.movie);
                        if (!(this.movie != null)) return [3, 3];
                        return [4, this.app.tmdb.movieGetDetails({ movie_id: this.movie.id })];
                    case 2:
                        e3_1 = _a.sent();
                        console.log({ movie: this.movie, details: e3_1 });
                        _a.label = 3;
                    case 3: return [4, this.app.tmdb.searchTvShows({ query: info.name, })];
                    case 4:
                        e2 = _a.sent();
                        console.log(e2);
                        show = e2.results[0];
                        if (!(show != null)) return [3, 6];
                        return [4, this.app.tmdb.tvGetDetails({ tv_id: show.id })];
                    case 5:
                        e3_2 = _a.sent();
                        console.log({ show: show, details: e3_2 });
                        _a.label = 6;
                    case 6: return [4, this.app.tmdb.searchMulti({ query: info.name, })];
                    case 7:
                        e3 = _a.sent();
                        console.log("multisearch", e3);
                        return [2];
                }
            });
        });
    };
    BrowserComponent.prototype.getImdbUserId = function () {
        var id = this.GetStorageItem("imdbUserId");
        if (Q.isNullOrEmpty(id))
            console.info("set your imdbUserId storage key");
        return id;
    };
    BrowserComponent.prototype.setImdbUserId = function (value) {
        return this.SetStorageItem("imdbUserId", value);
    };
    BrowserComponent.prototype.onPathChanged = function () {
        this.tbPathText = this.Req.Path;
    };
    BrowserComponent.prototype.GetSelection = function (folder) {
        var filename = this.GetStorageItem(folder);
        return filename;
    };
    BrowserComponent.prototype.SaveSelection = function (folderName, filename) {
        this.SetBaseDbItem({ key: folderName, selectedFiles: filename == null ? null : [filename] });
    };
    BrowserComponent.prototype.GetStorageItem = function (key) {
        var x = this.GetBaseDbItem(key);
        if (x == null || x.selectedFiles == null)
            return null;
        return x.selectedFiles[0];
    };
    BrowserComponent.prototype.SetStorageItem = function (key, value) {
        return this.SetBaseDbItem({ key: key, selectedFiles: [value] });
    };
    BrowserComponent.prototype.GetBaseDbItem = function (key) {
        var x = this.filesMd.first(function (t) { return t.key == key; });
        if (x == null)
            return null;
        return x;
    };
    BrowserComponent.prototype.SetBaseDbItem = function (value) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            this.filesMd.removeAll(function (t) { return t.key == value.key; });
            this.app.byFilename.removeById({ id: value.key });
            return;
        }
        this.filesMd.removeAll(function (t) { return t.key == value.key; });
        this.filesMd.push(value);
        this.app.byFilename.persist(value);
    };
    BrowserComponent.prototype.getHeaderClass = function (prop) {
        if (this.filesView.isOrderedBy(prop, false))
            return prop + " sorted asc";
        if (this.filesView.isOrderedBy(prop, true))
            return prop + " sorted desc";
        return prop;
    };
    BrowserComponent.prototype.frmPath_submit = function (e) {
        this.GotoPath(this.tbPathText);
    };
    BrowserComponent.prototype.getFileTypeOrder = function (type) {
        var order = ["folder", "link", "file"];
        order.reverse();
        return order.indexOf(type);
    };
    BrowserComponent.prototype.scan = function () {
        var scanner = new scanner_1.Scanner();
        scanner.folders = ["c:\\tv"];
        console.log("scan start");
        scanner.scan().then(function (e) { return console.log("scan end", scanner); });
    };
    BrowserComponent.prototype.sendReplCmd = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, res_1, res_1_1, item, e_1_1, err_1, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.replCmd == null || this.replCmd == "")
                            return [2];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 15, , 16]);
                        res = websocket.send(this.replCmd);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, 9, 14]);
                        res_1 = __asyncValues(res);
                        _b.label = 3;
                    case 3: return [4, res_1.next()];
                    case 4:
                        if (!(res_1_1 = _b.sent(), !res_1_1.done)) return [3, 7];
                        return [4, res_1_1.value];
                    case 5:
                        item = _b.sent();
                        console.log("repl", item);
                        this.replOutput.push(item);
                        _b.label = 6;
                    case 6: return [3, 3];
                    case 7: return [3, 14];
                    case 8:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 14];
                    case 9:
                        _b.trys.push([9, , 12, 13]);
                        if (!(res_1_1 && !res_1_1.done && (_a = res_1.return))) return [3, 11];
                        return [4, _a.call(res_1)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [3, 13];
                    case 12:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 13: return [7];
                    case 14: return [3, 16];
                    case 15:
                        err_1 = _b.sent();
                        this.replOutput.push(err_1);
                        return [3, 16];
                    case 16: return [2];
                }
            });
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], BrowserComponent.prototype, "Req", void 0);
    BrowserComponent = __decorate([
        core_1.Component({
            selector: 'my-browser',
            templateUrl: '/src/browser.component.html',
            styleUrls: ['_res_/src/browser.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, common_1.Location, service_1.FileService, app_1.App])
    ], BrowserComponent);
    return BrowserComponent;
}());
exports.BrowserComponent = BrowserComponent;
//# sourceMappingURL=browser.component.js.map