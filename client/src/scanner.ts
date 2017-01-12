import { FileService } from "./service";
import { FilenameParser, } from "./filename-parser"
import { TmdbClient } from "./tmdb-client"
import { TmdbMedia, TmdbMovie, TvShow, Response } from "tmdb-v3"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, ByFilename, FilenameParsedInfo } from "contracts"
import { promiseEach, promiseSetTimeout, promiseReuseIfStillRunning } from "./utils/utils"
import { MediaFile, App } from "./app"
import * as C from "contracts"

export class Scanner {
    folders: string[];
    app: App;
    results: MediaFile[];
    errors: any[] = [];

    videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"];
    isVideoFile(name: string): boolean {
        return this.videoExts.first(t => name.endsWith(t)) != null;

    }
    async scan(): Promise<any> {
        this.results = [];
        for (let folder of this.folders)
            await this.scanDir(folder);
    }
    async scanDir(dir: string): Promise<any> {
        let res = await this.app.fileService.ListFiles({ Path: dir, IsRecursive: true });
        let videoFiles = res.Files.filter(t => this.isVideoFile(t.Name));
        for (let file of videoFiles) {
            let md = await this.app.getFileMetadata(file);
            md.modified = file.Modified;
            if (md != null && md.tmdbKey != null) {
                console.log("tmdbId already exists, skipping", { file, md });
                continue;
            }
            let mf: MediaFile = { file, md, type: null, parsed: null, fsEntry: null };
            try {
                await this.analyze(mf);
            }
            catch (e2) {
                let e: Response = e2;
                console.warn(e);
                this.errors.push(e);
                if (this.errors.length > 3)
                    throw e2;
            }
            this.results.push(mf);
        }
    }


    async analyze(mf: MediaFile): Promise<any> {
        if (mf.md.scanned != null && mf.md.scanned != "")
            return;
        mf.md.scanned = new Date().format("yyyy-MM-dd HH:mm:ss");
        await this._analyze(mf);
        this.app.byFilename.persist(mf.md);
    }
    async _analyze(mf: MediaFile): Promise<any> {
        let filename = (mf.fsEntry && mf.fsEntry.basename) || (mf.file && mf.file.Name);
        let path = (mf.fsEntry && mf.fsEntry.key) || (mf.file && mf.file.Path);
        console.log("getImdbInfo", "start", filename);
        mf.parsed = new FilenameParser().parse(filename);
        if (mf.parsed == null) {
            console.log("filename parsing returned null", filename);
            return;
        }
        let isTv = mf.parsed.season != null;
        let media: TmdbMedia;
        if (isTv) {
            let e = await this.app.tmdb.searchTvShows({ query: mf.parsed.name })
            media = e.results[0];
        }
        else {
            let e = await this.app.tmdb.searchMovies({ query: mf.parsed.name })
            media = e.results[0];
        }
        mf.tmdbBasic = media;
        if (mf.tmdbBasic != null) {
            mf.type = mf.tmdbBasic.media_type;
            mf.md.tmdbKey = [mf.tmdbBasic.media_type, mf.tmdbBasic.id].join("|");
            if (mf.tmdbBasic.media_type == "tv" && mf.parsed.episode != null && mf.parsed.season != null)
                mf.md.episodeKey = "s" + mf.parsed.season.format("00") + "e" + mf.parsed.episode.format("00");
        }
        mf.md.lastKnownPath = path;
    }


}
