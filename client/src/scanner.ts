import { FileService } from "./service";
import { FilenameParser, } from "./filename-parser"
import { TmdbClient } from "./tmdb-client"
import { TmdbMedia, TmdbMovie, TvShow, Response } from "./tmdb/v3/api"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, ByFilename, FilenameParsedInfo } from "contracts"
import { promiseEach, promiseSetTimeout } from "./utils/utils"

export class Scanner {
    folders: string[];
    service: FileService;
    tmdb: TmdbClient;
    results: any[];
    errors: any[] = [];

    videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"];
    isVideoFile(name: string): boolean {
        return this.videoExts.first(t=>name.endsWith(t))!=null;

    }
    async scan(): Promise<any> {
        this.results = [];
        for (let folder of this.folders)
            await this.scanDir(folder);
    }
    async scanDir(dir: string): Promise<any> {
        let res = await this.service.ListFiles({ Path: dir, IsRecursive: true });
        let videoFiles = res.Files.filter(t => this.isVideoFile(t.Name));//videoExt.has(t.Extension));
        for (let file of videoFiles) {
            let md = await this.service.db.byFilename.findOneById({ id: file.Name });
            if (md != null && md.tmdbKey != null) {
                console.log("tmdbId already exists, skipping", { file, md });
                continue;
            }
            console.log(file.Name);
            let res2 = await this.getImdbInfo(file)
            this.results.push({ file, res2 });
            if (res2 != null) {
                let res = res2.movie || res2.tv;
                if (res != null) {
                    let tmdbKey = [res.media_type, res.id].join("|");
                    let episodeKey = null;
                    if (res2.tv != null && res2.fileInfo.episode != null && res2.fileInfo.season != null) {
                        episodeKey = "s" + res2.fileInfo.season.format("00") + "e" + res2.fileInfo.episode.format("00");
                    }
                    console.log("persist", "start", file.Name, res.id);
                    await this.service.db.byFilename.persist({ key: file.Name, tmdbKey, episodeKey, lastKnownPath: file.Path });
                    console.log("persist", "end", file.Name, res.id);
                }
            }
        }
    }

    async getImdbInfo(file: File): Promise<{ tv?: TvShow, movie?: TmdbMovie, fileInfo: FilenameParsedInfo, file: File }> {
        try {
            console.log("getImdbInfo", "start", file.Name);
            let info = new FilenameParser().parse(file.Name);
            let isTv = info.season != null;
            if (isTv) {
                let e = await this.tmdb.searchTvShows({ query: info.name })
                console.log("getImdbInfo", "end", file.Name, e);
                return { tv: e.results[0], file, fileInfo: info, };
            }
            else {
                let e = await this.tmdb.searchMovies({ query: info.name })
                console.log("getImdbInfo", "end", file.Name, e);
                return { movie: e.results[0], file, fileInfo: info, };
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
