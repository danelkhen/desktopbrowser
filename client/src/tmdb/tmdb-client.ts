import { TmdbApi, TmdbApiMetadata, RateLimit } from "./tmdb-api"
import { Proxy, } from "../utils/proxy"
import { xhr, XhrRequest } from "./xhr"

export class TmdbApiClient extends Proxy<TmdbApi>{
    constructor() {
        super();
        this.onInvoke = pc => {
            let md = TmdbApiMetadata[pc.name];
            let path = md.path;
            let prms: any = { api_key: this.api_key };
            Object.assign(prms, pc.args[0]);
            let body: any = null;
            if (prms.body != null) {
                body = JSON.stringify(prms.body);
                delete prms.body;
            }
            let url = this.base_url + path;
            //let prms = { api_key: this.api_key, ...prms }
            let xhrReq: XhrRequest = {
                url,
                params: prms,
                method: md.method || "GET",
                body: body,
                headers: {},
            };
            if (body != null)
                xhrReq.headers["Content-Type"] = "application/json;charset=utf-8";
            return xhr(xhrReq).then(res => {
                //let x = xhrReq.xhr;
                //this.rateLimit = {
                //    limit: parseInt(x.getResponseHeader("X-RateLimit-Limit")),
                //    remaining: parseInt(x.getResponseHeader("X-RateLimit-Remaining")),
                //    reset: parseInt(x.getResponseHeader("X-RateLimit-Reset")),
                //};
                console.log({ name: pc.name, res, path, pc, prms, });
                return res;
            });
        };
    }
    api_key: string;
    base_url = 'https://api.themoviedb.org/3';
    rateLimit: RateLimit = { limit: null, remaining: null, reset: null };
}
