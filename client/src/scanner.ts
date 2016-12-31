import { SiteServiceClient } from "./service";
import { FilenameParser } from "./filename-parser"
import { TmdbClient } from "./tmdb-client"
import { Media, Movie, TvShow, Response } from "./tmdb/tmdb-api"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, OmdbGetResponse, ByFilename } from "contracts"
import { promiseEach, promiseSetTimeout } from "./utils/utils"

export class Scanner {
    folders: string[];
    service: SiteServiceClient;
    tmdb: TmdbClient;
    results: any[];
    scan(): Promise<any> {
        this.results = [];
        return promiseEach(this.folders, t => this.scanDir(t));
    }
    scanDir(dir: string): Promise<any> {
        let videoExt = new Set([".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"]);
        return this.service.invoke(t=>t.ListFiles({ Path: dir, IsRecursive: true })).then(res => {
            let videoFiles = res.Files.filter(t => videoExt.has(t.Extension));
            return promiseEach(videoFiles, file => {
                return this.service.db.byFilename.invoke(t => t.findOneById({ id: file.Name })).then(md => {
                    if (md != null && md.tmdbTypeAndId != null) {
                        console.log("tmdbId already exists, skipping", { file, md });
                        return Promise.resolve(null);
                    }
                    console.log(file.Name);
                    return this.getImdbInfo(file).then(res => {
                        this.results.push({ file, res });
                        if (res != null) {
                            console.log("persist", "start", file.Name, res.id);
                            return this.service.db.byFilename.invoke(t => t.persist({ key: file.Name, tmdbTypeAndId: [res.media_type, res.id].join("|"), })).then(() => console.log("persist", "end", file.Name, res.id));
                        }
                        return Promise.resolve(null);
                    });
                });
            });
        });
    }

    getImdbInfo(file: File): Promise<Movie | TvShow> {
        console.log("getImdbInfo", "start", file.Name);
        let info = new FilenameParser().parse(file.Name);
        let isTv = info.season != null;
        return this.tmdb.searchMulti({ query: info.name, include_adult: false }).then(e => {
            console.log("getImdbInfo", "end", file.Name, e);
            let media_type = isTv ? "tv" : "movie";
            return e.results.filter(t => t.media_type == media_type)[0];
        }, (e: Response) => {
            console.warn(e);
            this.errors.push(e);
            if (e != null && e.status_code == 25) {
                return promiseSetTimeout(10*1000);
            }
            if (this.errors.length > 3)
                return Promise.reject(e);
        });
    }
    errors: any[] = [];


}
