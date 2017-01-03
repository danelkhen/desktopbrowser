import { FileService } from "./service";
import { FilenameParser } from "./filename-parser"
import { TmdbClient } from "./tmdb-client"
import { Media, Movie, TvShow, Response } from "./tmdb/tmdb-api"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, ByFilename } from "contracts"
import { promiseEach, promiseSetTimeout } from "./utils/utils"

export class Scanner {
    folders: string[];
    service: FileService;
    tmdb: TmdbClient;
    results: any[];
    errors: any[] = [];

    async scan(): Promise<any> {
        this.results = [];
        for (let folder of this.folders)
            await this.scanDir(folder);
    }
    async scanDir(dir: string): Promise<any> {
        let videoExt = new Set([".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"]);
        let res = await this.service.invoke(t => t.ListFiles({ Path: dir, IsRecursive: true }))
        let videoFiles = res.Files.filter(t => videoExt.has(t.Extension));
        for (let file of videoFiles) {
            let md = await this.service.db.byFilename.invoke(t => t.findOneById({ id: file.Name }));
            if (md != null && md.tmdbTypeAndId != null) {
                console.log("tmdbId already exists, skipping", { file, md });
                continue;
            }
            console.log(file.Name);
            let res = await this.getImdbInfo(file)
            this.results.push({ file, res });
            if (res != null) {
                console.log("persist", "start", file.Name, res.id);
                await this.service.db.byFilename.invoke(t => t.persist({ key: file.Name, tmdbTypeAndId: [res.media_type, res.id].join("|") }));
                console.log("persist", "end", file.Name, res.id);
            }
        }
    }

    async getImdbInfo(file: File): Promise<Movie | TvShow> {
        console.log("getImdbInfo", "start", file.Name);
        let info = new FilenameParser().parse(file.Name);
        let isTv = info.season != null;
        try {
            let e = await this.tmdb.searchMulti({ query: info.name, include_adult: false })
            console.log("getImdbInfo", "end", file.Name, e);
            let media_type = isTv ? "tv" : "movie";
            return e.results.filter(t => t.media_type == media_type)[0] as Movie | TvShow;
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
