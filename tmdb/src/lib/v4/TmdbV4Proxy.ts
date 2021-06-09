import { TmdbV4Api } from "../tmdb-v4"
import { TmdbProxy } from "../TmdbProxy"
import { TmdbScheduler } from "../TmdbScheduler"
import { TmdbApiMetadata } from "./TmdbApiMetadata"

export class TmdbV4Proxy extends TmdbProxy<TmdbV4Api> {
    constructor() {
        super()
        const base = this.invoker
        this.invoker = ({ method, prms }) =>
            this.scheduler!.enqueueXhrRequest({ name: method, args: prms as any }, base) as any
        this.scheduler = new TmdbScheduler(this)
        this.base_url = "https://api.themoviedb.org/4"
        this.md = TmdbApiMetadata
    }

    //read_access_token: string;
    //access_token: string;
    //base_url = 'https://api.themoviedb.org/4';
    //scheduler: TmdbScheduler;
    //rateLimit: RateLimit = { limit: null, remaining: null, reset: null };

    //async executeProxyCall(pc: ProxyCall<TmdbV4Api>): Promise<void> {
    //    let md = TmdbApiMetadata[pc.name];
    //    let path = md.path;
    //    let prms: any = {...pc.args[0]};
    //    let body: any = null;
    //    if (prms.body != null) {
    //        body = JSON.stringify(prms.body);
    //        delete prms.body;
    //    }
    //    let url = this.base_url + path;
    //    let xhrReq: XhrRequest = {
    //        url,
    //        params: prms,
    //        method: md.method || "GET",
    //        body: body,
    //        headers: {
    //            "Authorization": "Bearer " + (this.access_token || this.read_access_token),
    //            //"Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
    //            //"If-Modified-Since": "Fri, 15 Feb 2013 13:43:19 GMT",
    //        },
    //    };
    //    if (body != null)
    //        xhrReq.headers["Content-Type"] = "application/json;charset=utf-8";
    //    let res = await xhr(xhrReq);

    //    let x = xhrReq.xhr;
    //    let rl: RateLimit = {
    //        limit: parseInt(x.getResponseHeader("X-RateLimit-Limit")),
    //        remaining: parseInt(x.getResponseHeader("X-RateLimit-Remaining")),
    //        reset: parseInt(x.getResponseHeader("X-RateLimit-Reset")),
    //    };
    //    if (TmdbHelper.rateLimitIsNewer(rl, this.rateLimit)) {
    //        this.rateLimit = rl;
    //    }
    //    else {
    //        console.log("probably cached response", rl, this.rateLimit);
    //    }
    //    console.log({ name: pc.name, res, path, pc, prms, rateLimit: this.rateLimit });
    //    return res;
    //}
}