import { SiteRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File } from "./model"
import { Movie, MovieRequest } from 'imdb-api';

export class SiteServiceClient {
    Url: string;
    constructor() {
        this.Url = "/api";
    }

    ListFiles(req: ListFilesRequest): Promise<ListFilesResponse> {
        return this.Invoke("ListFiles", req);
    }
    GetFiles(req: SiteRequest): Promise<File[]> {
        return this.Invoke("GetFiles", req);
    }

    GetFileRelatives(req: PathRequest): Promise<FileRelativesInfo> {
        return this.Invoke("GetFileRelatives", req);
    }

    GetFile(req: PathRequest): Promise<File> {
        return this.Invoke("GetFile", req);
    }

    Execute(req: PathRequest): Promise<any> {
        return this.Invoke("Execute", req);
    }

    Delete(req: PathRequest): Promise<any> {
        return this.Invoke("Delete", req);
    }
    trash(req: PathRequest): Promise<any> {
        return this.Invoke("trash", req);
    }
    Explore(req: PathRequest): Promise<any> {
        return this.Invoke("Explore", req);
    }


    isPrimitive(x: any): boolean {
        if (x == null)
            return true;
        if (typeof (x) != "object")
            return true;
        return false;
    }
    Invoke<T>(action: string, prms: any): Promise<T> {
        let method = "GET";
        let contentType: string = null;
        let data = prms;
        if (prms != null && typeof (prms) == "object" && Object.keys(prms).first(key => !this.isPrimitive(prms[key])) != null) {
            method = "POST";
            contentType = "application/json";
            data = JSON.stringify(prms);
        }
        return new Promise((resolve, reject) => {
            var xhr = jQuery.ajax({
                contentType,
                method,
                url: this.Url + "/" + action,
                data: data,
                complete: (a, b) => resolve(a.responseJSON),
            });
        });
    }

    omdbGet(req: MovieRequest): Promise<OmdbGetResponse> {
        return this.Invoke("omdbGet", req);
    }

    imdbRss(req: { path: string }): Promise<string> {
        return this.Invoke("imdbRss", req);
    }
    baseDbGet(req: { key: string }): Promise<BaseDbItem> {
        return this.Invoke("baseDbGet", req);
    }
    baseDbDelete(req: { key: string }): Promise<any> {
        return this.Invoke("baseDbDelete", req);
    }
    baseDbGetAll(): Promise<Bucket<BaseDbItem>[]> {
        return this.Invoke("baseDbGetAll", null);
    }

    baseDbSet(req: Bucket<BaseDbItem>): Promise<any> {
        return this.Invoke("baseDbSet", req);
    }




}


export interface OmdbGetResponse {
    data: Movie;
    err: { meesage: string, name: string };
}

export interface Bucket<T> {
    key: string;
    value: T;
}

export interface BaseDbItem {
    selectedFiles?: string[];
}
