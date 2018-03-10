"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filename_parser_1 = require("./filename-parser");
class Scanner {
    constructor() {
        this.errors = [];
        this.videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"];
    }
    isVideoFile(name) {
        return this.videoExts.first(t => name.endsWith(t)) != null;
    }
    async scan() {
        this.results = [];
        for (let folder of this.folders)
            await this.scanDir(folder);
    }
    async scanDir(dir) {
        let res = await this.app.fileService.ListFiles({ Path: dir, IsRecursive: true });
        let videoFiles = res.Files.filter(t => this.isVideoFile(t.Name));
        for (let file of videoFiles) {
            let md = await this.app.getFileMetadata(file);
            if (md != null && md.tmdbKey != null) {
                console.log("tmdbId already exists, skipping", { file, md });
                continue;
            }
            let mf = { file, md, type: null, parsed: null, fsEntry: null };
            try {
                await this.analyze(mf);
            }
            catch (e2) {
                let e = e2;
                console.warn(e);
                this.errors.push(e);
                if (this.errors.length > 3)
                    throw e2;
            }
            this.results.push(mf);
        }
    }
    async analyze(mf, opts) {
        if (mf.md.scanned != null && mf.md.scanned != "" && (opts == null || !opts.force))
            return;
        mf.md.scanned = new Date().format("yyyy-MM-dd HH:mm:ss");
        await this._analyze(mf);
        this.app.byFilename.persist(mf.md);
    }
    async _analyze(mf) {
        let filename = (mf.fsEntry && mf.fsEntry.basename) || (mf.file && mf.file.Name);
        let path = (mf.fsEntry && mf.fsEntry.key) || (mf.file && mf.file.Path);
        console.log("getImdbInfo", "start", filename);
        mf.parsed = new filename_parser_1.FilenameParser().parse(filename);
        if (mf.parsed == null) {
            console.log("filename parsing returned null", filename);
            return;
        }
        let isTv = mf.parsed.season != null;
        let media;
        if (isTv) {
            let e = await this.app.tmdb.searchTvShows({ query: mf.parsed.name });
            media = e.results[0];
        }
        else {
            let e = await this.app.tmdb.searchMulti({ query: mf.parsed.name });
            media = e.results.first(t => t.media_type == "tv" || t.media_type == "movie");
        }
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
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map