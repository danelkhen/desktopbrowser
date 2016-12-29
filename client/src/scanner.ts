import { SiteServiceClient } from "./service";
import { FilenameParser } from "./filename-parser"
import { TmdbClient } from "./tmdb-client"
import { Media, Movie, TvShow } from "./tmdb/tmdb-api"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, OmdbGetResponse, ByFilename } from "contracts"

export class Scanner {
    folders: string[];
    service: SiteServiceClient;
    tmdb: TmdbClient;
    results: any[];
    scan(): Promise<any> {
        this.results = [];
        let dir = this.folders[0];
        let videoExt = new Set([".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"]);
        return this.service.invoke(t => t.ListFiles({ Path: dir, IsRecursive: true })).then(res => {
            let videoFiles = res.Files.filter(t => videoExt.has(t.Extension));
            return promiseEach(videoFiles, file => {
                return this.service.db.byFilename.invoke(t => t.findOneById({ id: file.Name })).then(md => {
                    if (md != null && md.tmdbId != null) {
                        console.log("tmdbId already exists, skipping", { file, md });
                        return Promise.resolve(null);
                    }
                    return this.getImdbInfo(file).then(res => {
                        this.results.push({ file, res });
                        if (res != null) {
                            console.log("persist", "start", file.Name, res.id);
                            return this.service.db.byFilename.invoke(t => t.persist({ key: file.Name, tmdbId: [res.media_type,res.id].join("|"), })).then(() => console.log("persist", "end", file.Name, res.id));
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
        return this.tmdb.invoke(t => t.searchMulti({ query: info.name, })).then(e => {
            console.log("getImdbInfo", "end", file.Name, e);
            let media_type = isTv ? "tv" : "movie";
            return e.results.filter(t => t.media_type == media_type)[0];
        });
    }

}

export function promiseEach<T>(list: T[], handler: (obj: T, index: number) => Promise<any> | any): Promise<any> {
    return promiseMap<T, any>(list, handler);
}

export function promiseMap<T, R>(list: T[], handler: (obj: T, index: number) => Promise<R> | R): Promise<R[]> {
    let res: R[] = [];
    let promise = Promise.resolve();
    list.forEach((obj, i) => promise = promise.then(() => handler(obj, i)).then(e => { res.push(e); }));
    return promise.then(() => res);
}