//export interface ImdbRssItem {
//    id: string;
//    rating: number;
//    title: string;
//}

//LoadReq2(): void {
//    this.Req = {};
//    QueryString.parse(null, this.Req, this.DefaultReq);
//    var req: any = this.Req;
//    var defs: any = this.DefaultReq;
//    Object.keys(req).forEach(key => {
//        var value = req[key];
//        var def = defs[key];

//        if (typeof (def) == "boolean") {
//            if (value == "1")
//                req[key] = true;
//            else if (value == "0")
//                req[key] = false;
//            if (String.isNullOrEmpty(value))
//                req[key] = def;
//        }
//        if (typeof (def) == "number" && String.isNullOrEmpty(value)) {
//            req[key] = parseFloat(value);
//        }
//    });
//    //var path = "/" + this.urlSnapshot.join("/");// decodeURI(window.location.pathname);
//    //TEMP path = this.Path_LinuxToWin(path);
//    //this.Req.Path = path;
//    this.onPathChanged();
//    console.info("LoadReq", this.Req);
//}
//serializeReq2(req: SiteRequest): string {
//    var state = Q.copy(this.Req);
//    var state2: any = state;
//    var defs: any = this.DefaultReq;
//    Object.keys(state2).forEach(key => {
//        var val = state2[key];
//        if (val == null || defs[key] == val) {
//            delete (state2[key]);
//            return;
//        }
//        if (val === true)
//            state2[key] = "1";
//        else if (val === false)
//            state2[key] = "0";
//    });
//    var q = QueryString.stringify(state);
//    if (String.isNotNullOrEmpty(q))
//        q = "?" + q;
//    return q;
//}
//getImdbInfo_old(file: File) {
//    let info = parseTorrentName(file.Name);
//    console.log(info);
//    this.Service.invoke(t => t.omdbGet({ name: info.title, year: info.year })).then(res2 => {
//        console.log(res2);
//        if (res2.err != null)
//            return;
//        this.imdb = res2.data;
//        let res = res2.data;
//        this.getImdbRatings().then(list => this.yourRating = list.first(t => t.id == res.imdbid));
//    });
//}
//getImdbRatings(): Promise<ImdbRssItem[]> {
//    let json = this.GetStorageItem("imdbRatings");
//    if (json != null && json != "") {
//        return Promise.resolve(JSON.parse(json));
//    }
//    if (this.imdbRatings != null)
//        return Promise.resolve(this.imdbRatings)
//    let userId = this.getImdbUserId();
//    if (userId == null || userId == "")
//        return Promise.resolve([]);
//    return this.server.invoke(t => t.imdbRss({ path: `/user/${userId}/ratings` })).then(e => {
//        let doc = $.parseXML(e);
//        let items = $(doc).find("item").toArray();
//        let items2 = items.map(item => {
//            let item3 = $(item);
//            let item2: ImdbRssItem = {
//                id: item3.children("guid").text().split("/")[4],
//                rating: parseInt(item3.children("description").text().split(/[ \.]+/)[4]),
//                title: item3.children("title").text(),
//            };
//            return item2;
//        });
//        this.SetStorageItem("imdbRatings", JSON.stringify(items2));
//        return items2;
//    });

//}
//Service: SiteServiceClient;
//imdbRatings: ImdbRssItem[];
//imdb: OmdbMovie;
//url: Observable<string[]>;
//urlSnapshot: string[];
//yourRating: ImdbRssItem;
//migrateDbIfNeeded() {
//    if (this.filesMd == null || this.filesMd.length > 0)
//        return;
//    if (localStorage.length == 0)
//        return;
//    console.log("migrating db");
//    let i = 0;
//    while (i < localStorage.length) {
//        let key = localStorage.key(i);
//        let value = localStorage.getItem(key);
//        this.SetStorageItem(key, value);
//        localStorage.removeItem(key);
//    }
//    console.log("done");
//}
