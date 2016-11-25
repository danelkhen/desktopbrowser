import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, } from '@angular/core';
import { Movie, MovieRequest } from 'imdb-api';
import { SiteServiceClient, Bucket, BaseDbItem, OmdbGetResponse, } from "./service"
import { SiteRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File } from "./model"
import { Selection, SelectionChangedEventArgs } from "./selection"
import parseTorrentName = require('parse-torrent-name');
import * as imdb from "../typings2/imdb-rss"
import { ArrayView } from "./array-view";
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs"
import 'rxjs/add/operator/map';
import { Name, NameFunc, nameof } from "./utils"



@Component({
    selector: 'my-app',
    templateUrl: '/src/browser.component.html',
    styleUrls: ['_res_/src/browser.component.css'],
})
export class BrowserComponent implements OnInit, OnChanges {

    baseDbBuckets: Bucket<BaseDbItem>[];
    Service: SiteServiceClient;
    Res: ListFilesResponse;
    quickFindText: string = "";
    theme: string = "dark";
    filesView: ArrayView<File>;
    FileSelection: Selection<File>;
    clockText: string = "";
    search: string;
    Req: ListFilesRequest;
    Win: Window;
    imdbRatings: ImdbRssItem[];
    imdb: Movie;
    tbPathText: string = "";
    lastHeight: number;
    url: Observable<string[]>;
    urlSnapshot: string[];
    isShiftDown: boolean;
    quickFindTimer = new Timer(() => this.quickFindTimer_tick());
    yourRating: ImdbRssItem;

    TYPE = nameof<File>(t => t.type);
    NAME = nameof<File>(t => t.Name);
    SIZE = nameof<File>(t => t.Size);
    MODIFIED = nameof<File>(t => t.Modified);
    EXTENSION = nameof<File>(t => t.Extension);
    HAS_INNER_SELECTION = nameof<this>(t => t.hasInnerSelection);

    constructor(private route: ActivatedRoute, private router: Router) {
        this.Service = new SiteServiceClient();
        this.Req = {};
        this.Res = { Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null }, File: null, Files: null };
        this.FileSelection = new Selection<File>();
        this.FileSelection.Changed = e => this.FileSelection_Changed(e);
        this.filesView = new ArrayView<File>(() => this.Res.Files);
        this.filesView.pageSize = 200;
        window["_browser"] = this;
    }

    ngOnInit(): void {
        console.log("ngOnOnit");
        let nameof2 = Name.of<File>();



        this.url = this.route.url.map(t => t.map(x => x.path));
        this.filesView.getCreateSort(this.SIZE).descendingFirst = true;
        this.filesView.getCreateSort(this.MODIFIED).descendingFirst = true;
        this.filesView.getCreateSort(this.HAS_INNER_SELECTION).descendingFirst = true;
        this.filesView.getCreateSort(this.HAS_INNER_SELECTION).selector = t => this.hasInnerSelection(t);
        this.filesView.getCreateSort(this.TYPE).valueComparerFunc = (x, y) => this.getFileTypeOrder(y) - this.getFileTypeOrder(x);
        this.filesView.activeSort = [this.TYPE];
        this.filesView.targetChanged.on(() => this.FileSelection.AllItems = this.filesView.target);
        $(window).resize(e => { console.log("resize", e); this.recalcHeight(); });
        this.recalcHeight();
        console.log("baseDbGetAll");
        this.Service.baseDbGetAll().then(list => {
            this.baseDbBuckets = list;
            this.migrateDbIfNeeded();
            this.onReady();
        });
    }

    onReady(): void {
        this.enableThemes();
        this.Win = window;
        this.UpdateClock();

        this.Req = {};
        this.DefaultReq = {
            FolderSize: false,
            HideFiles: false,
            HideFolders: false,
            ImageListColumns: null,
            ImageListRows: null,
            IsRecursive: false,
            KeepView: false,
            MixFilesAndFolders: false,
            NoCache: false,
            Path: "",
            SearchPattern: "",
            ShowHiddenFiles: false,
            Skip: null,
            Sort: null,
            Take: null,
            View: null,
        };
        $(this.Win).keydown(e => this.Win_keydown(e.originalEvent as KeyboardEvent));
        $(this.Win).on('keyup keydown', e => { this.isShiftDown = e.shiftKey });
        $(this.Win).mousedown(e => {
            if (e.defaultPrevented)
                return;
            let el = $(e.target);
            if (el.closest(".dropdown.show").length > 0)
                return;
            $(".dropdown.show").removeClass("show");
        });

        this.url.subscribe(t => this.onUrlChanged(t));

    }

    onUrlChanged(url: string[]) {
        this.urlSnapshot = url;
        console.log("onUrlChanged", "/" + url.join("/"));
        this.LoadReq();
        this.ListFiles();
        //this.GotoPath2(this.Path_LinuxToWin("/" + url.join("/")));
    }

    ngOnChanges(changes: SimpleChanges): void {
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

    migrateDbIfNeeded() {
        if (this.baseDbBuckets == null || this.baseDbBuckets.length > 0)
            return;
        if (localStorage.length == 0)
            return;
        console.log("migrating db");
        let i = 0;
        while (i < localStorage.length) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            this.SetStorageItem(key, value);
            localStorage.removeItem(key);
        }
        console.log("done");
    }

    enableThemes() {
        let theme = localStorage.getItem("theme");
        if (theme != null && theme != "")
            this.setTheme(theme, false);
    }

    toggleDropDown(e: Event) {
        $(e.target).closest(".dropdown").toggleClass("show");
    }
    toggle(name: string) {
        this.Req[name] = !this.Req[name];
        this.SaveReq();
    }

    orderBy(key: string) {
        let keepKeys = ["hasInnerSelection", "type"];
        if (key == "type")
            keepKeys.remove("type");
        let view = this.filesView;
        this.filesView.orderBy(key, keepKeys);
    }

    setTheme(theme: string, remember: boolean = true) {
        //TODO:
        //less.modifyVars({ theme });
        if (!remember)
            return;
        localStorage.setItem("theme", theme);
    }

    UpdateClock(): void {
        this.clockText = new Date().format("HH:mm\nddd, MMM d");
        window.setTimeout(() => this.UpdateClock(), 5000);
    }

    quickFindTimer_tick() {
        this.quickFindText = "";
    }

    tbQuickFind_input(e: Event): void {
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

    Win_keydown(e: KeyboardEvent): void {
        if (e.defaultPrevented)
            return;
        if ($(e.target).is("input,select"))
            return;
        $("#tbQuickFind").focus();
        this.tbQuickFind_keydown(e);
    }

    tbQuickFind_keydown(e: KeyboardEvent): void {
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

    OpenInNewWindow(p: string): void {
        this.Win.open(p, "_blank");
    }

    LoadReq(): void {
        QueryString.parse(null, this.Req, this.DefaultReq);
        var req: any = this.Req;
        var defs: any = this.DefaultReq;
        Object.keys(req).forEach(key => {
            var value = req[key];
            var def = defs[key];

            if (typeof (def) == "boolean") {
                if (value == "1")
                    req[key] = true;
                else if (value == "0")
                    req[key] = false;
                if (String.isNullOrEmpty(value))
                    req[key] = def;
            }
            if (typeof (def) == "number" && String.isNullOrEmpty(value)) {
                req[key] = parseFloat(value);
            }
        });
        var path = "/" + this.urlSnapshot.join("/");// decodeURI(window.location.pathname);
        path = this.Path_LinuxToWin(path);
        this.Req.Path = path;
        this.onPathChanged();
        console.info("LoadReq", this.Req);
    }

    ListFiles(): Promise<any> {
        console.log("ListFiles");
        return this.Service.ListFiles(this.Req).then(res => {
            if (res == null)
                return; //TODO: handle errors
            this.Res = res;
            this.onFilesChanged();
        });
    }

    GotoPrevSibling(): void {
        this.GotoFolder(this.Res.Relatives.PreviousSibling);
    }

    GotoNextSibling(): void {
        this.GotoFolder(this.Res.Relatives.NextSibling);
    }

    GotoParentDir(): void {
        this.GotoFolder(this.Res.Relatives.ParentFolder);
    }

    GotoFolder(file: File): void {
        if (file == null || !file.IsFolder)
            return;
        this.GotoPath(file.Path);
    }

    GotoPath(path: string): void {
        let p2 = this.Path_WinToLinux(path);
        //let p = p2.split('/');
        //console.log(p);
        this.router.navigateByUrl(p2);
    }

    GotoPath2(path: string): void {
        if (!this.Req.KeepView) {
            this.Req = {};
        }
        this.Req.Path = path;
        this.onPathChanged();
        this.SaveReq();

    }

    Path_LinuxToWin(path: string): string {
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
            path = path.substr(1); //skip first / to get real drive name
            var tokens = path.split('/');
            tokens[0] += ":";
            path = tokens.join("\\");
        }
        if (path.endsWith("\\"))
            path = path.removeLast(1);
        return path;
    }

    Path_WinToLinux(path: string): string {
        if (String.isNullOrEmpty(path))
            return path;
        var isNetworkShare = path.startsWith("\\\\");
        if (isNetworkShare)//network share
            path = "net/" + path.substr(2);
        var tokens = path.split('\\');//.where(t=>t.length>0);
        if (!isNetworkShare)
            tokens[0] = tokens[0].replaceAll(":", "");
        //tokens[0] = tokens[0].replaceAll(":", "");
        //tokens = tokens;
        path = tokens.join("/");
        //path = path.replaceAll(":\\", "/").replaceAll("\\", "/");
        //path = "/" + path;
        path = encodeURI(path);
        path = "/" + path;
        //if (!path.startsWith("/"))
        //    path = "/" + path;
        if (!path.endsWith("/"))
            path += "/";
        return path;
    }

    SaveReq(): void {
        var state = Q.copy(this.Req);
        var path = state.Path;
        path = this.Path_WinToLinux(path);

        delete (state.Path);
        var state2: any = state;
        var defs: any = this.DefaultReq;
        Object.keys(state2).forEach(key => {
            var val = state2[key];
            if (val == null || defs[key] == val) {
                delete (state2[key]);
                return;
            }
            if (val === true)
                state2[key] = "1";
            else if (val === false)
                state2[key] = "0";
        });
        console.info("SaveReq", state);
        var q = QueryString.stringify(state);
        if (String.isNotNullOrEmpty(q))
            q = "?" + q;
        var url = path + q;//location.origin + 
        //var win = window;

        //win.history.pushState(state, Req.Path, "?" + q);
        console.log("SaveReq", url);
        this.router.navigateByUrl(url);
    }

    GetDefaultFileComparer(): JsFunc2<File, File, number> {
        return new Array<File>().ItemGetter(t => t.IsFolder).ToComparer();
    }

    grdFiles_mousedown(e: MouseEvent, file: File) {
        this.FileSelection.Click(file, e.ctrlKey, e.shiftKey);
    }

    grdFiles_click(e: MouseEvent, file: File) {
        var target = $(e.target);
        if (!target.is("a.Name"))
            return;
        e.preventDefault();
        this.Open(file);
    }

    grdFiles_dblclick(e: MouseEvent, file: File) {
        var target = $(e.target);
        if (file == null)
            return;
        e.preventDefault();
        this.Open(file);
    }

    GetFileClass(file: File): string {
        let map = {
            folder: "layers",
            file: "file-empty",
            link: "link",
        };
        var icon = map[file.type];
        return "lnr lnr-" + icon;
    }

    onFilesChanged(): void {
        this.filesView.refresh();
        this.FileSelection.AllItems = this.filesView.target;
        this.FileSelection.SelectedItems.clear();
        var selectedFileName = this.GetSelection(this.Res.File.Name);
        if (String.isNotNullOrEmpty(selectedFileName)) {
            var files = this.FileSelection.AllItems.where(t => t.Name == selectedFileName);
            this.FileSelection.SetSelection(files);
        }
    }

    FileSelection_Changed(e: SelectionChangedEventArgs<File>): void {
        var file = this.FileSelection.SelectedItems.last();
        let filename: string = null;
        if (file != null)
            filename = file.Name;
        this.SaveSelection(this.Res.File.Name, filename);
    }

    DeleteAndRefresh(file: File): Promise<any> {
        if (file == null)
            return;
        var fileOrFolder = file.IsFolder ? "folder" : "file";
        if (!this.Win.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path))
            return;
        return this.Service.Delete({ Path: file.Path }).then(res => this.ListFiles());
    }

    TrashAndRefresh(file: File): Promise<any> {
        if (file == null)
            return;
        var fileOrFolder = file.IsFolder ? "folder" : "file";
        return this.Service.trash({ Path: file.Path }).then(res => this.ListFiles());
    }

    DeleteOrTrash(file: File): Promise<any> {
        if (this.isShiftDown)
            return this.DeleteAndRefresh(file);
        return this.TrashAndRefresh(file);
    }

    Open(file: File): Promise<any> {
        if (file == null)
            return Promise.resolve();
        if (file.IsFolder) {
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

    Execute(file: File): Promise<any> {
        return this.Service.Execute({ Path: file.Path });
    }

    Explore(file: File): Promise<any> {
        return this.Service.Explore({ Path: file.Path });
    }

    FormatFriendlyDate(value: string): string {
        if (value == null)
            return "";
        return value.ToDefaultDate().ToFriendlyRelative2();
    }

    FormatFriendlySize(value: number): string {
        if (value == null)
            return "";
        return value.ToFriendlySize();
    }

    getFileNameWithoutExtension(file: File): string {
        if (file.IsFolder)
            return file.Name;
        let s = file.Name;
        let index = s.lastIndexOf(".");
        if (index < 0)
            return s;
        s = s.substr(0, index);
        return s;
    }

    hasInnerSelection(file: File) {
        return file != null && file.IsFolder && this.GetSelection(file.Name) != null;
    }

    GetRowClass(file: File, index: number): string {
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

    GetSubtitleSearchLink(File: File): string {
        if (File == null)
            return null;
        var s = this.GetFilenameForSearch(File.Name);
        return "https://www.google.com/search?q=" + encodeURIComponent(s + " eng subscene");
    }

    GetGoogleSearchLink(File: File): string {
        if (File == null)
            return null;
        var s = this.GetFilenameForSearch(File.Name);
        return "https://www.google.com/search?q=" + encodeURIComponent(s);
    }

    GetFilenameForSearch(s: string): string {
        //s = s.Replace(".", " ").Replace("-", " ");
        var tokens = s.split(/[ \.\-]/).select(t => t.toLowerCase());
        var ignoreWords = ["xvid", "720p", "1080p", "dimension", "sample", "nfo", "par2"].selectToObject(t => t, t => true);
        var list: string[] = [];
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
        var s2 = list.join(" ");// String.Join(" ", list.ToArray());
        return s2;
    }

    TryParse(s: string): number {
        var x = parseInt(s);
        if (isNaN(x))
            return null;
        return x;
    }

    getImdbInfo(file: File) {
        let info = parseTorrentName(file.Name);
        console.log(info);
        this.Service.omdbGet({ name: info.title, year: info.year }).then(res2 => {
            console.log(res2);
            if (res2.err != null)
                return;
            this.imdb = res2.data;
            let res = res2.data;
            //let el = $(".imdb");
            //Object.keys(res).forEach(key => {
            //    let el2 = el.find("." + key);
            //    let value = res[key];
            //    //if (key == "released")
            //    //    value = value.substr(0, 10);
            //    //else if (key == "series") {
            //    //    value = "series";
            //    //}
            //    //else if (key == "poster") {
            //    //    el2.find("img").attr("src", value);
            //    //}
            //    //else if (key == "imdburl") {
            //    //    let a = el2.find("a").attr("href", value);
            //    //    if (a.children().length == 0)
            //    //        a.text(value);
            //    //}
            //    //else {
            //    //    el2.text(value);
            //    //}
            //});
            //el.show();
            //el.find(".yourRating").text("NA");
            this.getImdbRatings().then(list => {
                this.yourRating = list.first(t => t.id == res.imdbid);
                //if (yourRating != null)
                //    el.find(".yourRating").text(yourRating.rating);
            });
        });
    }

    getImdbUserId() {
        let id = this.GetStorageItem("imdbUserId");
        if (Q.isNullOrEmpty(id))
            console.info("set your imdbUserId storage key");
        return id;
    }

    setImdbUserId(value: string) {
        return this.SetStorageItem("imdbUserId", value);
    }

    getImdbRatings(): Promise<ImdbRssItem[]> {
        let json = this.GetStorageItem("imdbRatings");
        if (json != null && json != "") {
            return Promise.resolve(JSON.parse(json));
        }
        if (this.imdbRatings != null)
            return Promise.resolve(this.imdbRatings)
        let userId = this.getImdbUserId();
        if (userId == null || userId == "")
            return Promise.resolve(null);
        return this.Service.imdbRss({ path: `/user/${userId}/ratings` }).then(e => {
            let doc = $.parseXML(e);
            let items = $(doc).find("item").toArray();
            let items2 = items.map(item => {
                let item3 = $(item);
                let item2: ImdbRssItem = {
                    id: item3.children("guid").text().split("/")[4],
                    rating: parseInt(item3.children("description").text().split(/[ \.]+/)[4]),
                    title: item3.children("title").text(),
                };
                return item2;
            });
            this.SetStorageItem("imdbRatings", JSON.stringify(items2));
            return items2;
        });

    }

    onPathChanged() {
        this.imdb = null;
        this.tbPathText = this.Req.Path;
        //$(".imdb").hide();
    }

    DefaultReq: ListFilesRequest;

    GetSelection(folder: string): string {
        var filename = this.GetStorageItem(folder);
        return filename;
    }

    SaveSelection(folderName: string, filename: string) {
        this.SetStorageItem(folderName, filename);
    }

    GetStorageItem(key: string): string {
        let x = this.baseDbBuckets.first(t => t.key == key);
        if (x == null || x.value == null || x.value.selectedFiles == null)
            return null;
        return x.value.selectedFiles[0];
    }

    SetStorageItem(key: string, value: string): void {
        if (value == null) {
            this.baseDbBuckets.removeAll(t => t.key == key);
            this.Service.baseDbDelete({ key });
            return;
        }
        let x = this.baseDbBuckets.last(t => t.key == key);
        if (x == null) {
            x = { key: key, value: null };
            this.baseDbBuckets.push(x);
        }
        if (x.value == null)
            x.value = {};
        x.value.selectedFiles = [value];
        this.Service.baseDbSet(x);
    }

    GetBaseDbItem(key: string): BaseDbItem {
        let x = this.baseDbBuckets.first(t => t.key == key);
        if (x == null)
            return null;
        return x.value;
    }

    SetBaseDbItem(key: string, value: BaseDbItem): void {
        if (value == null) {
            this.baseDbBuckets.removeAll(t => t.key == key);
            this.Service.baseDbDelete({ key });
            return;
        }
        let x = this.baseDbBuckets.first(t => t.key == key);
        if (x == null) {
            x = { key, value };
            this.baseDbBuckets.push(x);
        }
        x.value = value;
        this.Service.baseDbSet(x);
    }

    getHeaderClass(prop: string) {
        if (this.filesView.isOrderedBy(prop, false))
            return prop + " sorted asc";
        if (this.filesView.isOrderedBy(prop, true))
            return prop + " sorted desc";
        return prop;
    }
    frmPath_submit(e: Event) {
        this.GotoPath(this.tbPathText);
    }
    getFileTypeOrder(type: string): number {
        let order = ["folder", "link", "file"];
        order.reverse();
        return order.indexOf(type);
    }

}

export interface ImdbRssItem {
    id: string;
    rating: number;
    title: string;
}
