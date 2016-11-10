import { SiteRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File } from "./model"

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

    GetFile(req: PathRequest):Promise<File> {
        return this.Invoke("GetFile", req);
    }

    Execute(req: PathRequest):Promise<any> {
        return this.Invoke("Execute", req);
    }

    Delete(req: PathRequest):Promise<any> {
        return this.Invoke("Delete", req);
    }
    Explore(req: PathRequest):Promise<any> {
        return this.Invoke("Explore", req);
    }


    Invoke<T>(action: string, prms: any): Promise<T> {
        return new Promise((resolve, reject) => {
            var xhr = jQuery.ajax({
                url: this.Url + "/" + action,
                data: prms,
                complete: (a, b) => resolve(a.responseJSON),
            });
        });
    }


}




