import { TmdbApi, TmdbApiMetadata, RateLimit, Response, PagedResponse, PagedRequest } from "./tmdb-api"
import { Proxy, extractInstanceFunctionCall } from "../utils/proxy"
import { promiseSetTimeout, promiseWhile } from "../utils/utils"
import { xhr, XhrRequest, } from "./xhr"

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
                headers: {
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
                    console.log({ name: pc.name, res, path, pc, prms, rateLimit: this.rateLimit });
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

    getAllPages<T>(action: (req: TmdbApi) => PagedResponse<T>): Promise<T[]> {
        let pc = extractInstanceFunctionCall(action);
        let reqTemplate: PagedRequest = pc.args[0];
        let responses: PagedResponse<T>[] = [];

        let next = (): Promise<any> => {
            return this.onInvoke(pc).then((res: PagedResponse<T>) => {
                responses.push(res);
                let req = Q.copy(reqTemplate);
                req.page = res.page + 1;
                if (res.total_pages >= req.page) {
                    pc.args[0] = req;
                    return next();
                }
                return Promise.resolve();
            });
        }
        return next().then(() => responses.selectMany(t => t.results));
    }

    api_key: string;
    base_url = 'https://api.themoviedb.org/3';
    rateLimit: RateLimit = { limit: null, remaining: null, reset: null };
}
export interface QueueItem {
    req: XhrRequest;
}
