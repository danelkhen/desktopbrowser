//TODO:
declare var Parse:any;

export interface File {
    IsFolder: boolean;
    Name: string;
    Path?: string;
    Modified?: string;
    IsHidden?: boolean;
    Size?: number;
    Extension?: string;
    type?:string;
}

export interface FileRelativesInfo {
    ParentFolder: File;
    NextSibling: File;
    PreviousSibling: File;
}



export class SiteRequest {
    constructor(cfg: SiteRequest) {
        Object.keys(cfg).forEach(key => this[key] = cfg[key]);
    }
    SearchPattern?: string;
    IsRecursive?: boolean;
    FolderSize?: boolean;
    HideFolders?: boolean;
    HideFiles?: boolean;
    Path?: string;
    Sort?: SortRequest;
    MixFilesAndFolders?: boolean;
    ShowHiddenFiles?: boolean;
    NoCache?: boolean;
    View?: string;
    /// <summary>
    /// Number of columns in ImageListView mode
    /// </summary>
    ImageListColumns?: number;
    /// <summary>
    /// Number of rows in ImageListView mode
    /// </summary>
    ImageListRows?: number;
    AddSortBy?(sortBy: string, defaultDesc: boolean): SiteRequest {
        return this.SortBy(sortBy, true, defaultDesc);
    }
    SetSortBy?(sortBy: string, defaultDesc: boolean): SiteRequest {
        return this.SortBy(sortBy, false, defaultDesc);
    }
    NextPage?(): SiteRequest {
        var req = this.Clone();
        req.Skip += req.Take;
        return req;
    }
    PreviousPage?(): SiteRequest {
        var req = this.Clone();
        req.Skip -= req.Take;
        if (req.Skip < 0)
            req.Skip = 0;
        return req;
    }
    ToggleImageListView?(): SiteRequest {
        var req = this.Clone();
        if (req.View == "ImageList") {
            req.View = null;
            req.ImageListColumns = null;
            req.ImageListRows = null;
            req.Skip = null;
            req.Take = null;
        }
        else {
            req.View = "ImageList";
        }
        return req;
    }
    SortBy?(sortBy: string, add: boolean, defaultDesc: boolean): SiteRequest {
        var req = this.Clone();
        var col = req.Sort.Columns.where(t => t.Name == sortBy).first();
        if (col == null) {
            if (!add)
                req.Sort.Columns.clear();
            req.Sort.Columns.push(new SortColumn({ Name: sortBy, Descending: defaultDesc }));
        }
        else {
            col.Descending = !col.Descending;
            if (!add) {
                req.Sort.Columns.clear();
                req.Sort.Columns.push(col);
            }
        }
        return req;

    }

    ToJavaScript?(): string {
        return this.toString();
    }
    Clone?(changes?: (req: SiteRequest) => void): SiteRequest {
        let x = new SiteRequest({
            Path: this.Path,
            Sort: this.Sort.Clone(),
            HideFiles: this.HideFiles,
            HideFolders: this.HideFolders,
            FolderSize: this.FolderSize,
            MixFilesAndFolders: this.MixFilesAndFolders,
            ShowHiddenFiles: this.ShowHiddenFiles,
            NoCache: this.NoCache,
            View: this.View,
            Skip: this.Skip,
            Take: this.Take,
            ImageListColumns: this.ImageListColumns,
            ImageListRows: this.ImageListRows,
            KeepView: this.KeepView,
            IsRecursive: this.IsRecursive,
            SearchPattern: this.SearchPattern,
        });
        if (changes != null)
            changes(x);
        return x;
    }
    static Load(request: any): SiteRequest {
        return new SiteRequest({
            Path: request.query["p"] || "",
            Sort: SortRequest.Parse(request.query["s"] || "Name"),
            //SortBy : request.QueryString["s"] ?? "Name",
            //SortDescending : request.QueryString["d"] == "1",
            HideFolders: request.query["hd"] == "1",
            HideFiles: request.query["hf"] == "1",
            FolderSize: request.query["fs"] == "1",
            MixFilesAndFolders: request.query["mix"] == "1",
            ShowHiddenFiles: request.query["shf"] == "1",
            NoCache: request.query["noc"] == "1",
            View: request.query["v"],
            Skip: Parse.TryInt(request.query["skip"]),
            Take: Parse.TryInt(request.query["take"]),
            ImageListColumns: Parse.TryInt(request.query["ilcols"]),
            ImageListRows: Parse.TryInt(request.query["ilrows"]),
            KeepView: request.query["kv"] == "1",
            SearchPattern: request.query["sp"],
            IsRecursive: request.query["r"] == "1",
        });
    }
    GetHref?(): string {
        return this.toString();
    }
    toString(): string {
        var dic = this.Serialize();
        var qs = Array.from(dic.keys()).StringConcat(t => t + "=" + encodeURIComponent(dic.get(t)), "", "&", "");
        qs = "?" + qs;
        return qs;
    }

    Serialize?(): Map<string, string> {
        var dic = new Map<string, string>();
        dic.set("p", this.Path);
        if (this.Sort != null && this.Sort.Columns.length > 0) {
            if (this.Sort.Columns.length == 1 && this.Sort.Columns[0].Name == "Name" && !this.Sort.Columns[0].Descending) {
            }
            else {
                dic.set("s", this.Sort.toString());
            }
        }
        if (this.HideFiles)
            dic.set("hf", "1");
        if (this.HideFolders)
            dic.set("hd", "1");
        if (this.FolderSize)
            dic.set("fs", "1");
        if (this.MixFilesAndFolders)
            dic.set("mix", "1");
        if (this.ShowHiddenFiles)
            dic.set("shf", "1");
        if (this.NoCache)
            dic.set("noc", "1");
        if (String.isNotNullOrEmpty(this.View))
            dic.set("v", this.View);
        if (this.ImageListColumns != null)
            dic.set("ilcols", this.ImageListColumns.toString());
        if (this.ImageListRows != null)
            dic.set("ilrows", this.ImageListRows.toString());
        if (this.Skip != null)
            dic.set("skip", this.Skip.toString());
        if (this.Take != null)
            dic.set("take", this.Take.toString());
        if (this.KeepView)
            dic.set("kv", "1");
        if (String.isNotNullOrEmpty(this.SearchPattern))
            dic.set("sp", this.SearchPattern);
        if (this.IsRecursive)
            dic.set("r", "1");
        return dic;
    }

    KeepView?: boolean;

    /// <summary>
    /// How many items to skip, null means no skipping
    /// </summary>
    Skip?: number;
    /// <summary>
    /// How many items to take after skipping, null means all of them
    /// </summary>
    Take?: number;
}


export interface ListFilesRequest extends SiteRequest {
}

export interface ListFilesResponse {
    File: File;
    Files: File[];
    Relatives: FileRelativesInfo;
}



export class SortRequest {
    constructor(cfg?: SortRequest) {
        this.Columns = [];
        if (cfg != null)
            Object.keys(cfg).forEach(key => this[key] = cfg[key]);
    }
    Columns: SortColumn[];

    Clone?(): SortRequest {
        return new SortRequest({ Columns: this.Columns.map(t => t.Clone()).toArray() });
    }
    Contains?(col: string): boolean {
        return this.Columns.filter(t => t.Name == col).first() != null;
    }
    static Parse(s: string): SortRequest {
        var req = new SortRequest();
        if (String.isNotNullOrEmpty(s)) {
            s.split(',').forEach(t => {
                var tokens = t.split(' ');
                var col = new SortColumn({ Name: tokens[0] });
                if (tokens.length == 2)
                    col.Descending = tokens[1].equalsIgnoreCase("d");
                req.Columns.push(col);
            });
        }
        return req;
    }
    toString(): string {
        return this.Columns.StringConcat(t => t.Descending ? t.Name + " d" : t.Name, "", ",", "");
    }
}


export class SortColumn {
    constructor(cfg: SortColumn) {
        Object.keys(cfg).forEach(key => this[key] = cfg[key]);
    }

    Name: string;
    Descending?: boolean;
    Clone?(): SortColumn {
        return new SortColumn({ Name: this.Name, Descending: this.Descending });
    }
}


export interface PathRequest {
    Path: string;
}


