import { TmdbApiV4, TmdbApiMetadata, Response } from "./tmdb-api-v4"
import { Proxy, extractInstanceFunctionCall } from "../utils/proxy"
import { promiseSetTimeout, promiseWhile } from "../utils/utils"
import { xhr, XhrRequest, } from "./xhr"

export class TmdbApiClient extends Proxy<TmdbApiV4> {
    constructor() {
        super();
        this.onInvoke = pc => {
            let md = TmdbApiMetadata[pc.name];
            let path = md.path;
            let prms: any = {};//api_key: this.api_key };
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
                headers: {
                    "Authorization": "Bearer " + (this.access_token || this.read_access_token),
                    //"Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
                    //"If-Modified-Since": "Fri, 15 Feb 2013 13:43:19 GMT",
                },
            };
            if (body != null)
                xhrReq.headers["Content-Type"] = "application/json;charset=utf-8";
            return this.waitForSlot(xhrReq)
                .then(() => this.xhr(xhrReq))
                .then(res => {
                    //let x = xhrReq.xhr;
                    //console.log("Date header:", x.getResponseHeader("Date"));
                    //this.rateLimit = {
                    //    limit: parseInt(x.getResponseHeader("X-RateLimit-Limit")),
                    //    remaining: parseInt(x.getResponseHeader("X-RateLimit-Remaining")),
                    //    reset: parseInt(x.getResponseHeader("X-RateLimit-Reset")),
                    //};
                    console.log({ name: pc.name, res, path, pc, prms });//, rateLimit: this.rateLimit });
                    return res;
                });
        };
    }

    xhr(req: XhrRequest): Promise<any> {
        this.lastRequestAt = new Date();
        return xhr(req);
        //.catch((e: Response) => {
        //    if (e != null && e.status_code == 25) {
        //        this.lastRequestAt = new Date();
        //        return this.waitForSlot(req).then(() => this.xhr(req));
        //    }
        //    return Promise.reject(e);
        //});
    }

    queue: QueueItem[] = [];
    lastRequestAt: Date;
    isSlotReady(item: QueueItem): boolean {
        return this.queue[0] == item && new Date().valueOf() - this.lastRequestAt.valueOf() >= 250;
    }
    waitForSlot(req: XhrRequest): Promise<any> {
        return Promise.resolve();
        //let item: QueueItem = { req };
        //this.queue.push(item);
        //return promiseWhile(() => !this.isSlotReady(item), () => promiseSetTimeout(100))
        //    .then(() => this.queue.removeAt(0));

    }


    read_access_token: string;
    access_token: string;
    base_url = 'https://api.themoviedb.org/4';
    //rateLimit: RateLimit = { limit: null, remaining: null, reset: null };
}
export interface QueueItem {
    req: XhrRequest;
}

//function test() {
//    var x = new TmdbApiClient();
//    x.read_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmE4NTZkZmY0ZDFkYjQ2NzgyZTYxMzI2MTBkZGIzMiIsInN1YiI6IjU4NGZlYzU1OTI1MTQxNmU0YjAwODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jg-T4s-kFV_FlXwG1tovDvCQhXGaw9cjMA9e669xFaE";
//    x.invoke(t => t.authCreateAccessToken({}));

//}