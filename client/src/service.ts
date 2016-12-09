import {  OmdbGetResponse, Movie, MovieRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, ByFilenameService as ByFilenameServiceContract, SiteService as SiteServiceContract } from "contracts"
//import { Movie, MovieRequest } from 'imdb-api';

export class ServiceBase<T> {
    Url: string;
    extractInstanceFunctionCall(func: Function): { name: string, args: any[] } {
        let code = func.toString();
        let index = code.indexOf(".");
        let index2 = code.indexOf("(", index);
        let funcName = code.substring(index + 1, index2);
        let fake: any = {};
        let args;
        fake[funcName] = function () {
            args = Array.from(arguments);
        };
        func(fake);
        if (args == null)
            args = [];
        return { name: funcName, args };
    }

    invoke<R>(action: (obj: T) => R | Promise<R>): Promise<R> {
        let info = this.extractInstanceFunctionCall(action);
        return this.Invoke(info.name, info.args[0]);
    }

    isPrimitive(x: any): boolean {
        if (x == null)
            return true;
        if (typeof (x) != "object")
            return true;
        return false;
    }

    Invoke<R>(action: string, prms?: any): Promise<R> {
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
}

export class ByFilenameService extends ServiceBase<ByFilenameServiceContract> {
    constructor() {
        super();
        this.Url = "/api/service.byFilename";
    }

}
export class SiteServiceClient extends ServiceBase<SiteServiceContract> {
    constructor() {
        super();
        this.Url = "/api/service";
        this.db = { byFilename: new ByFilenameService() };
    }
    db: { byFilename: ByFilenameService };

    //ListFiles(req: ListFilesRequest): Promise<ListFilesResponse> {
    //    return this.invoke(t => t.ListFiles(req));
    //}
    //GetFiles(req: SiteRequest): Promise<File[]> {
    //    return this.Invoke("GetFiles", req);
    //}

    //GetFileRelatives(req: PathRequest): Promise<FileRelativesInfo> {
    //    return this.Invoke("GetFileRelatives", req);
    //}

    //GetFile(req: PathRequest): Promise<File> {
    //    return this.Invoke("GetFile", req);
    //}

    //Execute(req: PathRequest): Promise<any> {
    //    return this.Invoke("Execute", req);
    //}

    //Delete(req: PathRequest): Promise<any> {
    //    return this.Invoke("Delete", req);
    //}
    //trash(req: PathRequest): Promise<any> {
    //    return this.Invoke("trash", req);
    //}
    //Explore(req: PathRequest): Promise<any> {
    //    return this.Invoke("Explore", req);
    //}

    //omdbGet(req: MovieRequest): Promise<OmdbGetResponse> {
    //    return this.Invoke("omdbGet", req);
    //}

    //imdbRss(req: { path: string }): Promise<string> {
    //    return this.Invoke("imdbRss", req);
    //}

}


//export interface OmdbGetResponse {
//    data: Movie;
//    err: { meesage: string, name: string };
//}


