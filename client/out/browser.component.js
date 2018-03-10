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
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const service_1 = require("./service");
const selection_1 = require("./utils/selection");
const array_view_1 = require("./utils/array-view");
const router_1 = require("@angular/router");
require("rxjs/add/operator/map");
const utils_1 = require("./utils/utils");
const filename_parser_1 = require("./filename-parser");
const scanner_1 = require("./scanner");
const app_1 = require("./app");
const websocket = require("./websocket");
const proxy = require("./utils/proxy");
const utils_2 = require("./utils/utils");
let BrowserComponent = class BrowserComponent {
    constructor(route, router, location, server, app) {
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
        this.quickFindTimer = new Timer(() => this.quickFindTimer_tick());
        this.TYPE = utils_1.nameof(t => t.type);
        this.NAME = utils_1.nameof(t => t.Name);
        this.SIZE = utils_1.nameof(t => t.Size);
        this.MODIFIED = utils_1.nameof(t => t.Modified);
        this.EXTENSION = utils_1.nameof(t => t.Extension);
        this.HAS_INNER_SELECTION = utils_1.nameof(t => t.hasInnerSelection);
        this.columns = [this.TYPE, this.NAME, this.MODIFIED, this.SIZE, this.EXTENSION];
        this.replCmd = "";
        this.replOutput = [];
        console.log({ route, router, location, server });
        this.Req = {};
        this.Res = { Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null }, File: null, Files: null };
        this.FileSelection = new selection_1.Selection();
        this.FileSelection.Changed = e => this.FileSelection_Changed(e);
        this.filesView = new array_view_1.ArrayView(() => this.Res.Files);
        this.filesView.pageSize = 200;
        window["_browser"] = this;
        window["websocket"] = websocket;
        window["proxy"] = proxy;
        var x = new filename_parser_1.FilenameParser();
        window["filenameParser"] = x;
    }
    ngOnInit() {
        document.body.classList.add("db");
        console.log("ngOnOnit");
        this.location.subscribe(t => console.log("location changed", { location: t }));
        this.route.params.subscribe(params => {
            console.log("PARAMS", { params, p: params["p"] });
        });
        let nameof2 = utils_1.Name.of();
        this.filesView.getCreateSort(this.SIZE).descendingFirst = true;
        this.filesView.getCreateSort(this.MODIFIED).descendingFirst = true;
        this.filesView.getCreateSort(this.HAS_INNER_SELECTION).descendingFirst = true;
        this.filesView.getCreateSort(this.HAS_INNER_SELECTION).selector = t => this.hasInnerSelection(t);
        this.filesView.getCreateSort(this.TYPE).valueComparerFunc = (x, y) => this.getFileTypeOrder(y) - this.getFileTypeOrder(x);
        this.filesView.activeSort = [this.TYPE];
        this.filesView.targetChanged.on(() => this.FileSelection.AllItems = this.filesView.target);
        $(window).resize(e => this.recalcHeight());
        this.recalcHeight();
        console.log("baseDbGetAll");
        this.init();
    }
    async init() {
        this.filesMd = await this.app.getAllFilesMetadata();
        this.enableThemes();
        this.Win = window;
        this.UpdateClock();
        this.Req = {};
        $(this.Win).keydown(e => this.Win_keydown(e.originalEvent));
        $(this.Win).on('keyup keydown', e => { this.isShiftDown = e.shiftKey; });
        this.Win.addEventListener("mousedown", e => this.toggleDropDown(e));
        this.route.queryParams.subscribe(t => this.onUrlChanged(t));
    }
    onUrlChanged(req) {
        console.log("onUrlChanged", req);
        this.LoadReq();
        this.ListFiles();
    }
    ngOnChanges(changes) {
        console.log("ngOnChanges", changes);
    }
    recalcHeight() {
        let headerEl = document.querySelector("header");
        if (headerEl == null)
            return;
        this.lastHeight = headerEl.offsetHeight;
        console.log("recalcHeight", this.lastHeight);
        $(".fixed-placeholder").css({ height: this.lastHeight + "px" });
    }
    enableThemes() {
        let theme = localStorage.getItem("theme");
        if (theme != null && theme != "")
            this.setTheme(theme, false);
    }
    toggleDropDown(e) {
        if (e.defaultPrevented)
            return;
        let el = $(e.target);
        let dropDownEl = el.closest(".dropdown");
        let isInDropDown = dropDownEl.length > 0;
        let isInToggleBtn = el.closest(".dropdown-toggle").length > 0;
        if (isInDropDown && !isInToggleBtn)
            return;
        $(".dropdown.show").not(dropDownEl).removeClass("show");
        dropDownEl.toggleClass("show");
    }
    toggle(name) {
        let value = this.Req[name];
        let newValue = !value;
        console.log("toggle", { name, value, newValue });
        this.Req[name] = newValue;
        this.navigateToReq();
    }
    disableSorting() {
        this.Req.sortBy = null;
        this.Req.sortByDesc = false;
        this.Req.foldersFirst = false;
        this.Req.ByInnerSelection = false;
        this.navigateToReq();
    }
    isSortingDisabled() {
        return this.Req.sortBy == null && !this.Req.foldersFirst && this.Req.ByInnerSelection == null;
    }
    orderBy(key) {
        let def = this.filesView.getCreateSort(key);
        if (this.Req.sortBy == key) {
            this.Req.sortByDesc = !this.Req.sortByDesc;
        }
        else {
            this.Req.sortBy = key;
            this.Req.sortByDesc = def.descendingFirst;
        }
        this.navigateToReq();
    }
    applySort() {
        let key = this.Req.sortBy;
        let active = [];
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
    }
    setTheme(theme, remember = true) {
        if (!remember)
            return;
        localStorage.setItem("theme", theme);
    }
    UpdateClock() {
        this.clockText = new Date().format("HH:mm\nddd, MMM d");
        window.setTimeout(() => this.UpdateClock(), 5000);
    }
    quickFindTimer_tick() {
        this.quickFindText = "";
    }
    tbQuickFind_input(e) {
        this.quickFind();
        this.quickFindTimer.set(2000);
    }
    quickFind() {
        let list = this.filesView.target;
        let s = this.quickFindText.toLowerCase();
        let item = list.first(t => t.Name.toLowerCase().contains(s));
        if (item == null)
            return;
        this.FileSelection.SetSelection([item]);
    }
    Win_keydown(e) {
        if (e.defaultPrevented)
            return;
        if ($(e.target).is("input,select"))
            return;
        $("#tbQuickFind").focus();
        this.tbQuickFind_keydown(e);
    }
    tbQuickFind_keydown(e) {
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
    }
    OpenInNewWindow(p) {
        this.Win.open(p, "_blank");
    }
    LoadReq() {
        let x = { p: null };
        QueryString.parse(null, x, null);
        let req = x.p != null && x.p != "" ? JSON.parse(x.p) : {};
        this.Req = req;
        this.onPathChanged();
        console.info("LoadReq", this.Req);
    }
    async ListFiles() {
        console.log("ListFiles");
        let req = this.Req;
        if (this.Req.FolderSize) {
            let req2 = Object.assign({}, req);
            req2.FolderSize = false;
            await this._ListFiles(req2);
        }
        await this._ListFiles(req);
    }
    async _ListFiles(req) {
        let res = await websocket.invoke(t => t.fileService.ListFiles(req));
        if (res == null)
            return;
        this.Res = res;
        this.onFilesChanged();
    }
    GotoPrevSibling() {
        this.GotoFolder(this.Res.Relatives.PreviousSibling);
    }
    GotoNextSibling() {
        this.GotoFolder(this.Res.Relatives.NextSibling);
    }
    GotoParentDir() {
        this.GotoFolder(this.Res.Relatives.ParentFolder);
    }
    GotoFolder(file) {
        this.GotoPath(file.Path);
    }
    GotoPath(path) {
        this.Req.Path = path;
        this.navigateToReq();
    }
    GotoPath2(path) {
        if (!this.Req.KeepView) {
            this.Req = {};
        }
        this.Req.Path = path;
        this.onPathChanged();
        this.navigateToReq();
    }
    Path_LinuxToWin(path) {
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
    }
    Path_WinToLinux(path) {
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
    }
    serializeReq(req) {
        let q = "?p=" + encodeURIComponent(JSON.stringify(this.Req));
        return q;
    }
    navigateToReq() {
        console.log("navigateToReq", this.Req);
        this.router.navigate([""], { queryParams: { p: JSON.stringify(this.Req) } });
    }
    GetDefaultFileComparer() {
        return new Array().ItemGetter(t => t.IsFolder).ToComparer();
    }
    grdFiles_mousedown(e, file) {
        this.FileSelection.Click(file, e.ctrlKey, e.shiftKey);
    }
    grdFiles_click(e, file) {
        var target = $(e.target);
        if (!target.is("a.Name"))
            return;
        e.preventDefault();
        this.Open(file);
    }
    grdFiles_dblclick(e, file) {
        var target = $(e.target);
        if (file == null)
            return;
        e.preventDefault();
        this.Open(file);
    }
    GetFileClass(file) {
        let map = {
            folder: "layers",
            file: "file-empty",
            link: "link",
        };
        var icon = map[file.type];
        return "lnr lnr-" + icon;
    }
    onFilesChanged() {
        this.applySort();
        this.filesView.refresh();
        this.FileSelection.AllItems = this.filesView.target;
        this.FileSelection.SelectedItems.clear();
        var selectedFileName = this.GetSelection(this.Res.File.Name);
        if (String.isNotNullOrEmpty(selectedFileName)) {
            var files = this.FileSelection.AllItems.where(t => t.Name == selectedFileName);
            this.FileSelection.SetSelection(files);
        }
        this.recalcHeight();
    }
    FileSelection_Changed(e) {
        var file = this.FileSelection.SelectedItems.last();
        let filename = null;
        if (file != null)
            filename = file.Name;
        this.SaveSelection(this.Res.File.Name, filename);
        this.verifySelectionInView();
    }
    async verifySelectionInView() {
        await utils_2.sleep(10);
        let el = $('.Selected')[0];
        if (el == null)
            return;
        let container = document.body;
        let containerHeight = container.clientHeight - 100;
        let top = el.offsetTop;
        let bottom = el.offsetTop + el.offsetHeight;
        let top2 = container.scrollTop;
        let bottom2 = container.scrollTop + containerHeight;
        console.log({ top, bottom, top2, bottom2, containerHeight });
        let finalTop = null;
        if (top < top2) {
            finalTop = top;
        }
        else if (bottom > bottom2) {
            let finalBottom = bottom;
            finalTop = finalBottom - containerHeight;
        }
        if (finalTop != null) {
            console.log("scrolling", top2, finalTop);
            container.scrollTop = finalTop;
        }
    }
    async DeleteAndRefresh(file) {
        if (file == null)
            return;
        var fileOrFolder = file.IsFolder ? "folder" : "file";
        if (!this.Win.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path))
            return;
        let res = await this.server.Delete({ Path: file.Path });
        return this.ListFiles();
    }
    async TrashAndRefresh(file) {
        if (file == null)
            return;
        var fileOrFolder = file.IsFolder ? "folder" : "file";
        let res = await this.server.trash({ Path: file.Path });
        return this.ListFiles();
    }
    DeleteOrTrash(file) {
        if (this.isShiftDown)
            return this.DeleteAndRefresh(file);
        return this.TrashAndRefresh(file);
    }
    Open(file) {
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
        return this.Execute(file).then(res => console.info(res));
    }
    Execute(file) {
        return this.server.Execute({ Path: file.Path });
    }
    Explore(file) {
        return this.server.Explore({ Path: file.Path });
    }
    FormatFriendlyDate(value) {
        if (value == null)
            return "";
        return value.ToDefaultDate().ToFriendlyRelative2();
    }
    FormatFriendlySize(value) {
        if (value == null)
            return "";
        return value.ToFriendlySize();
    }
    getFileNameWithoutExtension(file) {
        if (file.IsFolder)
            return file.Name;
        let s = file.Name;
        let index = s.lastIndexOf(".");
        if (index < 0)
            return s;
        s = s.substr(0, index);
        return s;
    }
    hasInnerSelection(file) {
        return file != null && file.IsFolder && this.GetSelection(file.Name) != null;
    }
    GetRowClass(file, index) {
        var s = "FileRow";
        if (file.IsFolder) {
            s += " IsFolder";
            let folderHasSelection = this.GetSelection(file.Name) != null;
            if (folderHasSelection)
                s += " HasInnerSelection";
        }
        if (!file.IsFolder)
            s += " IsFile";
        if (this.FileSelection.SelectedItems.contains(file))
            s += " Selected";
        return s;
    }
    GetSubtitleSearchLink(File) {
        if (File == null)
            return null;
        var s = this.GetFilenameForSearch(File.Name);
        return "https://www.google.com/search?q=" + encodeURIComponent(s + " eng subscene");
    }
    GetGoogleSearchLink(File) {
        if (File == null)
            return null;
        var s = this.GetFilenameForSearch(File.Name);
        return "https://www.google.com/search?q=" + encodeURIComponent(s);
    }
    GetFilenameForSearch(s) {
        var tokens = s.split(/[ \.\-]/).select(t => t.toLowerCase());
        var ignoreWords = ["xvid", "720p", "1080p", "dimension", "sample", "nfo", "par2"].selectToObject(t => t, t => true);
        var list = [];
        for (var token of tokens) {
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
    }
    TryParse(s) {
        var x = parseInt(s);
        if (isNaN(x))
            return null;
        return x;
    }
    tmdbLogin() {
        return this.app.tmdb.loginToTmdb();
    }
    async getImdbInfo(file) {
        let info = new filename_parser_1.FilenameParser().parse(file.Name);
        let isTv = info.season != null;
        let e = await this.app.tmdb.searchMovies({ query: info.name, year: info.year });
        this.movie = e.results[0];
        console.log(this.movie);
        if (this.movie != null) {
            let e3 = await this.app.tmdb.movieGetDetails({ movie_id: this.movie.id });
            console.log({ movie: this.movie, details: e3 });
        }
        let e2 = await this.app.tmdb.searchTvShows({ query: info.name, });
        console.log(e2);
        let show = e2.results[0];
        if (show != null) {
            let e3 = await this.app.tmdb.tvGetDetails({ tv_id: show.id });
            console.log({ show: show, details: e3 });
        }
        let e3 = await this.app.tmdb.searchMulti({ query: info.name, });
        console.log("multisearch", e3);
    }
    getImdbUserId() {
        let id = this.GetStorageItem("imdbUserId");
        if (Q.isNullOrEmpty(id))
            console.info("set your imdbUserId storage key");
        return id;
    }
    setImdbUserId(value) {
        return this.SetStorageItem("imdbUserId", value);
    }
    onPathChanged() {
        this.tbPathText = this.Req.Path;
    }
    GetSelection(folder) {
        var filename = this.GetStorageItem(folder);
        return filename;
    }
    SaveSelection(folderName, filename) {
        this.SetBaseDbItem({ key: folderName, selectedFiles: filename == null ? null : [filename] });
    }
    GetStorageItem(key) {
        let x = this.GetBaseDbItem(key);
        if (x == null || x.selectedFiles == null)
            return null;
        return x.selectedFiles[0];
    }
    SetStorageItem(key, value) {
        return this.SetBaseDbItem({ key, selectedFiles: [value] });
    }
    GetBaseDbItem(key) {
        let x = this.filesMd.first(t => t.key == key);
        if (x == null)
            return null;
        return x;
    }
    SetBaseDbItem(value) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            this.filesMd.removeAll(t => t.key == value.key);
            this.app.byFilename.removeById({ id: value.key });
            return;
        }
        this.filesMd.removeAll(t => t.key == value.key);
        this.filesMd.push(value);
        this.app.byFilename.persist(value);
    }
    getHeaderClass(prop) {
        if (this.filesView.isOrderedBy(prop, false))
            return prop + " sorted asc";
        if (this.filesView.isOrderedBy(prop, true))
            return prop + " sorted desc";
        return prop;
    }
    frmPath_submit(e) {
        this.GotoPath(this.tbPathText);
    }
    getFileTypeOrder(type) {
        let order = ["folder", "link", "file"];
        order.reverse();
        return order.indexOf(type);
    }
    scan() {
        let scanner = new scanner_1.Scanner();
        scanner.folders = ["c:\\tv"];
        console.log("scan start");
        scanner.scan().then(e => console.log("scan end", scanner));
    }
    async sendReplCmd() {
        if (this.replCmd == null || this.replCmd == "")
            return;
        try {
            let res = websocket.send(this.replCmd);
            try {
                for (var res_1 = __asyncValues(res), res_1_1; res_1_1 = await res_1.next(), !res_1_1.done;) {
                    let item = await res_1_1.value;
                    console.log("repl", item);
                    this.replOutput.push(item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (res_1_1 && !res_1_1.done && (_a = res_1.return)) await _a.call(res_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (err) {
            this.replOutput.push(err);
        }
        var e_1, _a;
    }
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
exports.BrowserComponent = BrowserComponent;
//# sourceMappingURL=browser.component.js.map