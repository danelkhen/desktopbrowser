import { FileService } from "./service";
import { FilenameParser, } from "./filename-parser"
import { TmdbClient } from "./tmdb-client"
import { TmdbMedia, TmdbMovie, TvShow, Response } from "./tmdb/v3/api"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, ByFilename, FilenameParsedInfo } from "contracts"
import { promiseEach, promiseSetTimeout } from "./utils/utils"
import { MediaFile, App } from "./app"

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
            let mf: MediaFile = { file, md, type: null, parsed: null };
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
        let file = mf.file;
        console.log("getImdbInfo", "start", mf.file.Name);
        let info = new FilenameParser().parse(mf.file.Name);
        let isTv = info.season != null;
        let media: TmdbMedia;
        if (isTv) {
            let e = await this.app.tmdb.searchTvShows({ query: info.name })
            media = e.results[0];
        }
        else {
            let e = await this.app.tmdb.searchMovies({ query: info.name })
            media = e.results[0];
        }
        if (media == null) {
            mf.md.tmdbKey = "";
            mf.md = await this.app.byFilename.persist(mf.md);
            return;
        }
        mf.tmdbBasic = media;
        mf.type = mf.tmdbBasic.media_type;
        mf.md.tmdbKey = [mf.tmdbBasic.media_type, mf.tmdbBasic.id].join("|");
        mf.md.lastKnownPath = file.Path;
        if (mf.tmdbBasic.media_type == "tv" && mf.parsed.episode != null && mf.parsed.season != null) {
            mf.md.episodeKey = "s" + mf.parsed.season.format("00") + "e" + mf.parsed.episode.format("00");
        }
        mf.md = await this.app.byFilename.persist(mf.md);
    }


}
