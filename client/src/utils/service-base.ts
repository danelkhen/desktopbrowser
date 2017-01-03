import { Proxy, ProxyCall } from "./proxy"
import { ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, DbService, ByFilename as ByFilenameContract, } from "contracts"

export class ServiceBase<T> extends Proxy<T> {
    Url: string;
    constructor() {
        super();
        this.onInvoke = pc => this.Invoke(pc.name, pc.args[0]);
    }

    isQueryStringable(x: any): boolean {
        return x == null || typeof (x) == "string";
    }

    Invoke<R>(action: string, prms?: any): Promise<R> {
        let method = "GET";
        let contentType: string = null;
        let data = null;
        if (prms != null) {
            let json = JSON.stringify(prms);
            if (json.length > 1000) { //prms != null && typeof (prms) == "object" && Object.keys(prms).some(key => !this.isQueryStringable(prms[key])) != null) {
                method = "POST";
                contentType = "application/json";
                data = json;
            }
            else {
                data = { p: json };
            }
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
