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
    results: MediaFileEx[];
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
            let md = await this.app.byFilename.findOneById({ id: file.Name });
            if (md != null && md.tmdbKey != null) {
                console.log("tmdbId already exists, skipping", { file, md });
                continue;
            }
            let mf: MediaFileEx = { file, md, type: null, parsed: null };
            await this.analyze(mf);
            this.results.push(mf);
            if (mf == null)
                continue;
            let res = mf.movie || mf.tv;
            if (res == null)
                continue;
            let tmdbKey = [res.media_type, res.id].join("|");
            let episodeKey = null;
            if (mf.tv != null && mf.parsed.episode != null && mf.parsed.season != null) {
                episodeKey = "s" + mf.parsed.season.format("00") + "e" + mf.parsed.episode.format("00");
            }
            Object.assign(md, <ByFilename>{ key: file.Name, tmdbKey, episodeKey, lastKnownPath: file.Path });
            await this.app.byFilename.persist(md);
            console.log("persist", "end", file.Name, res.id);
        }
    }

    async analyze(mf: MediaFileEx): Promise<any> {
        let file = mf.file;
        try {
            console.log("getImdbInfo", "start", file.Name);
            let info = new FilenameParser().parse(file.Name);
            let isTv = info.season != null;
            if (isTv) {
                let e = await this.app.tmdb.searchTvShows({ query: info.name })
                console.log("getImdbInfo", "end", file.Name, e);
                Object.assign(mf, <MediaFileEx>{ tv: e.results[0], file, parsed: info, md: null, tmdb: null, type: "tv", tmdbBasic: e.results[0] });
                return;
            }
            else {
                let e = await this.app.tmdb.searchMovies({ query: info.name })
                console.log("getImdbInfo", "end", file.Name, e);
                Object.assign(mf, <MediaFileEx>{ movie: e.results[0], file, parsed: info, md: null, tmdb: null, type: "movie", tmdbBasic: e.results[0] });
                return;
            }
        }
        catch (e2) {
            let e: Response = e2;
            console.warn(e);
            this.errors.push(e);
            if (e != null && e.status_code == 25) {
                return promiseSetTimeout(10 * 1000);
            }
            if (this.errors.length > 3)
                throw e2;
        }
    }


}
export interface MediaFileEx extends MediaFile {
    tv?: TvShow,
    movie?: TmdbMovie,
}