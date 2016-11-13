import { SiteServiceClient } from "./service"
import { SiteRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File } from "./model"
import { Selection, SelectionChangedEventArgs } from "./selection"
import ptn = require('parse-torrent-name');
import * as imdb from "../typings2/imdb-rss"


export class DefaultPage2 {
    constructor() {
        $(() => this.OnDomReady());
        this.Service = new SiteServiceClient();
        this.Res = { Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null }, File: null, Files: null };
        this.FileSelection = new Selection<File>();
        this.FileSelection.Changed = e => this.FileSelection_Changed(e);
    }


    get Path(): string { return this.Req.Path; }
    Service: SiteServiceClient;
    El: JQuery;
    Res: ListFilesResponse;
    grdFiles: JQuery;
    tbPath: JQuery;
    navleft: JQuery;
    tbQuickFind: JQuery;
    ddThemes: JQuery;

    enableThemes() {
        this.ddThemes = $("#ddThemes");
        let theme = localStorage.getItem("theme");
        if (theme != null && theme != "") {
            this.setTheme(theme, false);
        }
        this.ddThemes.change(e => this.setTheme(this.ddThemes.val()));
    }
    setTheme(theme: string, remember: boolean = true) {
        less.modifyVars({ theme });
        this.ddThemes.val(theme);
        if (!remember)
            return;
        localStorage.setItem("theme", theme);
    }
    OnDomReady(): void {
        this.tbQuickFind = $("#tbQuickFind");
        this.enableThemes();

        let nav = $("nav");
        let nav2 = nav.clone();
        nav.addClass("fixed");
        nav2.addClass("hidden");
        nav2.insertAfter(nav);
        this.Win = window;
        this.El = $("body");
        this.grdFiles = this.El.getAppend("#grdFiles.Grid");
        this.navleft = $(".navleft");
        this.clock = $(".clock");
        this.tbSearch = $("#tbSearch");
        this.pagerEl = $(".Pager");
        this.UpdateClock();

        this.Buttons = [
            { Id: "GotoParentDir", Text: "Up", Action: () => this.GotoFolder(this.Res.Relatives.ParentFolder) },
            { Id: "GotoPrevSibling", Text: "Prev", Action: () => this.GotoFolder(this.Res.Relatives.PreviousSibling) },
            { Id: "GotoNextSibling", Text: "Next", Action: () => this.GotoFolder(this.Res.Relatives.NextSibling) },
            { Id: "Folders", Text: "Folders", Action: () => { this.Req.HideFolders = !this.Req.HideFolders; this.SaveReqListAndRender(); }, IsActive: () => this.Req.HideFiles },
            { Id: "Files", Text: "Files", Action: () => { this.Req.HideFiles = !this.Req.HideFiles; this.SaveReqListAndRender(); }, IsActive: () => this.Req.HideFolders },
            { Id: "Mix", Text: "Mix", Action: () => { this.Req.MixFilesAndFolders = !this.Req.MixFilesAndFolders; this.SaveReqListAndRender(); }, IsActive: () => this.Req.MixFilesAndFolders },
            { Id: "Size", Text: "Folder Size", Action: () => { this.Req.FolderSize = !this.Req.FolderSize; this.SaveReqListAndRender(); }, IsActive: () => this.Req.FolderSize },
            { Id: "Keep", Text: "Keep View", Action: () => { this.Req.KeepView = !this.Req.KeepView; this.SaveReqListAndRender(); }, IsActive: () => this.Req.KeepView },
            { Id: "Hidden", Text: "Hidden", Action: () => { this.Req.ShowHiddenFiles = !this.Req.ShowHiddenFiles; this.SaveReqListAndRender(); }, IsActive: () => this.Req.ShowHiddenFiles },
            { Id: "Recursive", Text: "Recursive", Action: () => { this.Req.IsRecursive = !this.Req.IsRecursive; this.SaveReqListAndRender(); }, IsActive: () => this.Req.IsRecursive },
            { Id: "Subs", Text: "Subs", Action: () => this.OpenInNewWindow(this.GetSubtitleSearchLink(this.Res.File)) },
            { Id: "Imdb", Text: "Imdb", Action: () => this.imdb(this.Res.File) },
            { Id: "Google", Text: "Google", Action: () => this.OpenInNewWindow(this.GetGoogleSearchLink(this.Res.File)) },
            { Id: "Delete", Text: "Delete", Action: () => this.DeleteAndRefresh(this.FileSelection.SelectedItems.last()) },
            { Id: "Explore", Text: "Explore", Action: () => this.Explore(this.Res.File).then(res => console.info(res)) },
            //new Page2Button { Id = "ToggleView",      Text: "View",      Action: () => { Req.=!Req.HideFolders; SaveReqListAndRender(); } },
        ];

        this.tbPath = $("#tbPath");//.getAppend("input.form-control.Path").change(e => GotoPath(tbPath.valString()));
        this.tbPath.change(e => this.GotoPath(this.tbPath.val()));

        //Options = new Page2Options { p = "" };
        this.Req = {};//new ListFilesRequest();
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
        this.LoadReq();
        this.RenderButtons();
        this.CreateGrid();

        this.tbPath.val(this.Req.Path);
        this.ListFiles().then(() => this.Render());
        this.Win.onpopstate = e => {
            this.LoadReq();
            this.ListAndRender();

        };
        //Win.onresize = e =>
        //{
        //    if (grdFiles2 != null)
        //        grdFiles2.Render();
        //};
        $(this.Win).keydown(e => this.Win_keydown(e));
        //$(this.Win).keypress(e => this.Win_keypress(e));
        this.tbQuickFind.on("input", e => this.tbQuickFind_input(e));
        this.tbQuickFind.keydown(e => this.tbQuickFind_keydown(e));
    }

    UpdateClock(): void {
        this.clock.text(new Date().format("HH:mm\nddd, MMM d"));
        window.setTimeout(() => this.UpdateClock(), 5000);
    }

    quickFindTimer = new Timer(() => this.quickFindTimer_tick());

    quickFindTimer_tick() {
        this.tbQuickFind.val("");
        this.tbQuickFind.toggleClass("HasValue", this.tbQuickFind.val().length > 0);
    }

    quickFindText: string;
    tbQuickFind_input(e: JQueryEventObject): void {
        this.quickFindText = this.tbQuickFind.val();
        this.tbQuickFind.toggleClass("HasValue", this.tbQuickFind.val().length > 0);
        this.quickFind();
        this.quickFindTimer.set(2000);
    }

    quickFind() {
        let list = this.grdFiles2.CurrentList;
        let item = list.first(t => t.Name.contains(this.quickFindText));
        if (item == null)
            return;
        this.FileSelection.SetSelection([item]);
    }

    //Win_keypress(e: JQueryKeyEventObject): void {
    //    if ($(e.target).is("input"))
    //        return;
    //    this.tbQuickFind.focus();
    //}
    Win_keydown(e: JQueryKeyEventObject): void {
        if ($(e.target).is("input"))
            return;
        this.tbQuickFind.focus();
        this.tbQuickFind_keydown(e);
    }
    tbQuickFind_keydown(e: JQueryKeyEventObject): void {
        this.FileSelection.KeyDown(e);
        if (e.isDefaultPrevented())
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
        var path = decodeURI(window.location.pathname);
        path = this.Path_LinuxToWin(path);
        this.Req.Path = path;
        this.onPathChanged();
        console.info("LoadReq", this.Req);
    }
    //Page2Options Options;

    RenderButtons(): void {
        this.navleft.toArray().forEach(container => {
            $(container).getAppendRemoveForEach("li", this.Buttons, (el, btn) => {
                el = el.getAppend("a").attr("href", "javascript:void(0);");
                if (btn.El == null)
                    btn.El = el;
                else
                    btn.El = btn.El.add(el);
            });
        });
        this.Buttons.forEach(btn => {
            if (btn.Id != null)
                btn.El.attr("id", btn.Id);
            btn.El.click(e => {
                btn.Action();
                this.RefreshButtonState(btn);
            });
            btn.El.text(btn.Text);
            this.RefreshButtonState(btn);
        });
    }

    RefreshButtonsState(): void {
        this.Buttons.forEach(t => this.RefreshButtonState(t));
    }

    RefreshButtonState(btn: Page2Button): void {
        this.ToggleClass(btn.El.parent("li"), "active", btn.IsActive);
    }

    ToggleClass(el: JQuery, className: string, check: JsFunc<boolean>): void {
        if (check == null)
            return;
        let x = check();
        if (x == null)
            x = false;
        el.toggleClass(className, x);
    }


    Req: ListFilesRequest;
    Win: Window;

    ListFiles(): Promise<any> {
        return this.Service.ListFiles(this.Req).then(res => this.Res = res);
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
        //if (!path.endsWith("\\"))
        //    path += "\\";
        if (!this.Req.KeepView) {
            this.Req = {};
            this.RefreshButtonsState();
        }
        this.Req.Path = path;
        this.onPathChanged();
        this.SaveReqListAndRender();
    }
    Path_LinuxToWin(path: string): string {
        if (String.isNullOrEmpty(path))
            return path;
        if (path == "/") {
            path = "";
        }
        else if (path.startsWith("//")) {
            var tokens = path.split('/');
            path = tokens.join("\\");
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
            path = path.substr(1);
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
        var url = location.origin + path + q;
        var win = window;

        //win.history.pushState(state, Req.Path, "?" + q);
        win.history.pushState(state, this.Req.Path, url);
    }



    SaveReqListAndRender(): void {
        this.SaveReq();
        this.ListAndRender();
    }
    ListAndRender(): Promise<void> {
        return this.ListFiles().then(() => this.Render());
    }


    Render(): void {
        this.tbPath.val(this.Path);
        this.RenderGrid();
    }

    grdFiles_RenderFinished(): void {
        this.FileSelection.AllItems = this.grdFiles2.CurrentList;
    }

    GetDefaultFileComparer(): JsFunc2<File, File, number> {
        return new Array<File>().ItemGetter(t => t.IsFolder).ToComparer();
    }


    CreateGrid(): void {
        this.grdFiles.off();
        var p = this.Res.Files;
        var gridOptions: GridOptions<File> =
            {
                //Items = Res.Files.AsJsArray(),
                Columns:
                [
                    { Prop: t => t.IsFolder, Width: 25, RenderCell: this.RenderIconCell, Title: "", },
                    { Prop: t => t.Name, Width: null, RenderCell: (a, b, c) => this.RenderNameCell(a, b, c),  /*Comparer = GetDefaultFileComparer().ThenBy(t=>t.Name)         */ },
                    { Prop: t => t.Modified, Width: 150, Format: this.FormatFriendlyDate, /*Comparer = GetDefaultFileComparer().ThenBy(t=>t.Modified)     */ },
                    { Prop: t => t.Size, Width: 150, Format: this.FormatFriendlySize, /*Comparer = GetDefaultFileComparer().ThenBy(t=>t.Size)         */ },
                    { Prop: t => t.Extension, Width: 150,                             /*Comparer = GetDefaultFileComparer().ThenBy(t=>t.Extension)    */ },
                ],
                RowClass: (file, index) => this.GetRowClass(file, index),
                PageSize: 100,
                RenderFinished: () => this.grdFiles_RenderFinished(),
            };
        this.grdFiles2 = new Grid<File>();
        this.grdFiles2.El = this.grdFiles;
        this.grdFiles2.Options = gridOptions;
        this.grdFiles2.SearchInputEl = this.tbSearch;
        this.grdFiles2.PagerEl = this.pagerEl;


        this.grdFiles2.Render();

        //grdFiles.Grid(gridOptions);
        //grdFiles2 = Grid<File>.Get(grdFiles);

        this.grdFiles.mousedown(e => {
            var target = $(e.target);
            var file = this.grdFiles2.GetItem(target);
            if (file == null)
                return;
            this.FileSelection.Click(file, e.ctrlKey, e.shiftKey);
        });
        this.grdFiles.click(e => {
            var target = $(e.target);
            var file = this.grdFiles2.GetItem(target);
            if (file == null)
                return;
            if (!target.is("a.Name"))
                return;
            e.preventDefault();
            this.Open(file);
        });
        this.grdFiles.dblclick(e => {
            var target = $(e.target);
            var file = this.grdFiles2.GetItem(target);
            if (file == null)
                return;
            e.preventDefault();
            this.Open(file);
        });
    }

    RenderIconCell(col: GridCol1<File>, file: File, td: JQuery): void {
        var icon = file.IsFolder ? "layers" : "file-empty";
        td.getAppend("span")[0].className = "lnr lnr-" + icon;
    }

    RenderGrid(): void {
        if (this.grdFiles2 == null) {
            this.CreateGrid();
        }
        this.grdFiles2.Options.Items = this.Res.Files;
        this.grdFiles2.Render();
        this.FileSelection.AllItems = this.grdFiles2.CurrentList;
        this.FileSelection.SelectedItems.clear();
        var selectedFileName = DefaultPage.GetSelection(this.Res.File.Name);
        if (String.isNotNullOrEmpty(selectedFileName)) {
            var files = this.FileSelection.AllItems.where(t => t.Name == selectedFileName);
            this.FileSelection.SetSelection(files);
        }


        //var prevOptions = grdFiles2 != null ? grdFiles2.Options : new GridOptions<File>();
        //OrderBy = prevOptions.OrderBy,
        //    OrderByDesc = prevOptions.OrderByDesc,

    }

    FileSelection: Selection<File>;
    clock: JQuery;
    tbSearch: JQuery;
    pagerEl: JQuery;

    FileSelection_Changed(e: SelectionChangedEventArgs<File>): void {
        e.Removed.forEach(t => this.grdFiles2.RenderRow(t));
        e.Added.forEach(t => this.grdFiles2.RenderRow(t));
        var file = this.FileSelection.SelectedItems.last();
        let filename: string = null;
        if (file != null)
            filename = file.Name;
        DefaultPage.SaveSelection2(this.Res.File.Name, filename);
    }

    DeleteAndRefresh(file: File): Promise<any> {
        if (file == null)
            return;
        var fileOrFolder = file.IsFolder ? "folder" : "file";
        if (!this.Win.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path))
            return;
        return this.Service.Delete({ Path: file.Path }).then(res => this.ListAndRender());
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
        return value.ToDefaultDate().ToFriendlyRelative2();
    }
    FormatFriendlySize(value: number): string {
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

    RenderNameCell(col: GridCol1<File>, file: File, td: JQuery): void {
        let filename = file.Name;//this.getFileNameWithoutExtension(file);
        td.getAppend("a.Name").text(filename).attr("href", "javascript:void(0)");
    }

    GetRowClass(file: File, index: number): string {
        var s = "FileRow";
        if (file.IsFolder) {
            s += " IsFolder";
            let folderHasSelection = DefaultPage.GetSelection(file.Name) != null;
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

    imdb(file: File) {
        let info = ptn(file.Name);
        console.log(info);
        this.Service.omdbGet({ name: info.title, year: info.year }).then(res2 => {
            console.log(res2);
            if (res2.err != null)
                return;
            let res = res2.data;
            let el = $(".imdb");
            Object.keys(res).forEach(key => {
                let el2 = el.find("." + key);
                let value = res[key];
                if (key == "released")
                    value = value.substr(0, 10);
                else if (key == "series") {
                    value = "series";
                }
                else if (key == "poster") {
                    el2.find("img").attr("src", value);
                }
                else if (key == "imdburl") {
                    let a = el2.find("a").attr("href", value);
                    if (a.children().length == 0)
                        a.text(value);
                }
                else {
                    el2.text(value);
                }
            });
            el.show();
            el.find(".yourRating").text("NA");
            this.getImdbRatings().then(list => {
                let yourRating = list.first(t => t.id == res.imdbid);
                if (yourRating != null)
                    el.find(".yourRating").text(yourRating.rating);
            });
        });
    }

    getImdbUserId() {
        let id = localStorage.getItem("imdbUserId");
        if(Q.isNullOrEmpty(id))
            console.info("set your imdbUserId storage key");
        return id;
    }
    setImdbUserId(value: string) {
        return localStorage.setItem("imdbUserId", value);
    }
    _imdbRatings: ImdbRssItem[];
    getImdbRatings(): Promise<ImdbRssItem[]> {
        let json = localStorage.getItem("imdbRatings");
        if (json != null && json != "") {
            return Promise.resolve(JSON.parse(json));
        }
        if (this._imdbRatings != null)
            return Promise.resolve(this._imdbRatings)
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
            localStorage.setItem("imdbRatings", JSON.stringify(items2));
            return items2;
        });

    }

    onPathChanged() {
        $(".imdb").hide();
    }

    grdFiles2: Grid<File>;
    DefaultReq: ListFilesRequest;
    Buttons: Page2Button[];
}


export interface Page2Options {
    p: string;
}



export interface Page2Button {
    Text: string;
    Id: string;
    Action: JsAction;
    IsActive?: JsFunc<boolean>;
    El?: JQuery;
}


class DefaultPage {
    static GetSelection(folder: string): string {
        var filename = this.GetStorageItem(folder);
        return filename;
    }
    static SaveSelection2(folderName: string, filename: string) {
        if (filename == null)
            localStorage.removeItem(folderName);
        else
            this.SetStorageItem(folderName, filename);
    }
    static GetStorageItem(key: string): string {
        return localStorage.getItem(key);
    }
    static SetStorageItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

}

export interface ImdbRssItem {
    id: string;
    rating: number;
    title: string;
}