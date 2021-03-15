//import "./global";
//import { DefaultPage2 } from "./page"

//fixArray();
//clearTextNodes();

//window["_page"] = new DefaultPage2();

//function clearTextNodes(el?: Element) {
//    if (el == null)
//        el = document.body;
//    $(el).find("*+*").toArray().forEach(el2 => {
//        var prev = el2.previousSibling;
//        while (prev != null && prev.nodeType == 3) {
//            var tmp = prev;
//            prev = prev.previousSibling;
//            (tmp as Element).remove();
//        }
//    });
//}

//function fixArray() {
//    let ce = Array.prototype;
//    Object.keys(ce).forEach(key => {
//        Object.defineProperty(ce, key, { enumerable: false });
//    });
//}

//getMediaInfo(typeAndId: string): TmdbMediaInfo {
//    let x = this.mediaInfos.get(typeAndId);
//    if (x == null) {
//        x = { key: "mediainfo_" + typeAndId };
//        this.mediaInfos.set(typeAndId, x);
//    }
//    return x;
//}

//mediaInfos: Map<string, TmdbMediaInfo> = new Map<string, TmdbMediaInfo>();
//async refreshMediaInfos(): Promise<Map<string, TmdbMediaInfo>> {
//    let list = await this.keyValue.findAllWithKeyLike<TmdbMediaInfo>({ like: "mediainfo_%" });
//    list.forEach(info => {
//        let typeAndId = info.key.substr("mediainfo_".length);
//        this.mediaInfos.set(typeAndId, info.value);
//    });
//    Array.from(this.mediaInfos.entries()).filter(t => t[1].watched).forEach(t => this.tmdb.watched.add(t[0]));
//    return this.mediaInfos;
//}
//getMedia(typeAndId: string): DsMedia {
//    let media = DsMedia.fromTmdbKey(typeAndId, this);
//    return media;
//}
//export interface MediaFile {
//    md: ByFilename;
//    file: File
//    tmdb?: MediaDetails;
//    tmdbBasic?: TmdbMedia;
//    type: string;
//    parsed: FilenameParsedInfo;
//    fsEntry: FsEntry;
//}
//async getLatestMediaFiles(): Promise<MediaFile[]> {
//    let x = await this.getLatestFsEntries();
//    console.log({ x });
//    let mfs = x.map(t => this.fsEntryToMediaFile(t));
//    for (let mf of mfs)
//        mf.md = await this.getFileMetadata(mf.fsEntry.basename);
//    return mfs;
//}

//scanAllFsEntries: () => Promise<void> = promiseReuseIfStillRunning(() => this._scanAllFsEntries());
//async checkFileMds() {
//    let mds = await this.getAllFilesMetadata();
//    for (let md of mds) {
//        if (md.lastKnownPath == null)
//            continue;
//        let file = await this.fileService.GetFile({ Path: md.lastKnownPath });
//        if (file == null) {
//            console.log("file in lastKnownPath wasn't found", md);
//            continue;
//        }
//        if (md.modified == null) {
//            md.modified = file.Modified;
//            this.byFilename.persist(md);
//        }
//    }
//}
//async getAvailableMedia(): Promise<C.MediaFile[]> {
//    let orderBy: Provide<ByFilename, OrderBy> = { modified: "DESC" };
//    let orderBy2 = {};
//    Object.keys(orderBy).forEach(key => orderBy2["t." + key] = orderBy[key]);
//    let mds = await this.byFilename.find({ options: { alias: "t", orderBy: orderBy2, maxResults: 100, } });
//    let scanner = this.createScanner();
//    mds = mds.filter(t => scanner.isVideoFile(t.key));
//    let mfs = mds.map(t => <C.MediaFile>{ md: t, tmdb: null, type: t.tmdbKey != null ? t.tmdbKey.split("|")[0] : null, parsed: new FilenameParser().parse(t.key) });
//    //let selectedFiles = new Set(mds.selectMany(t => t.selectedFiles || []));
//    //let groups = mfs.where(t => t.md.tmdbKey != null && t.md.tmdbKey != "").groupBy(t => t.md.tmdbKey);
//    //let medias = groups.map(group => {
//    //    let typeAndId = group[0].md.tmdbKey;
//    //    if (typeAndId == null)
//    //        return null;
//    //    let media = this.getMedia(typeAndId);
//    //    media.filenames = group.map(t => t.key);
//    //    if (!media.info.watched && media.filenames.some(t => selectedFiles.has(t))) {
//    //        media.info.watched = true;
//    //    }
//    //    return media;
//    //});
//    //console.log({ medias });
//    return mfs;

//}
