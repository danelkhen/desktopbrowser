import { TmdbApi, TmdbApiMetadata, RateLimit } from "./tmdb-api"
import { Proxy } from "../utils/proxy"
import { xhr, XhrRequest } from "./xhr"

export class TmdbApiClient extends Proxy<TmdbApi>{
    constructor() {
        super();
        this.onInvoke = pc => {
            let md = TmdbApiMetadata[pc.name];
            let path = md.path;
            let req = pc.args[0];
            let url = this.base_url + path;
            let prms = { api_key: this.api_key, ...req }
            let xhrReq: XhrRequest = {
                url,
                params: prms,
                //headers: {
                //    "Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
                //}
            };
            return xhr(xhrReq).then(res => {
                //let x = xhrReq.xhr;
                //this.rateLimit = {
                //    limit: parseInt(x.getResponseHeader("X-RateLimit-Limit")),
                //    remaining: parseInt(x.getResponseHeader("X-RateLimit-Remaining")),
                //    reset: parseInt(x.getResponseHeader("X-RateLimit-Reset")),
                //};
                console.log({ pc, path, req, res });
                return res;
            });
        };
    }
    api_key: string;
    base_url = 'https://api.themoviedb.org/3';
    rateLimit: RateLimit = { limit: null, remaining: null, reset: null };
}
