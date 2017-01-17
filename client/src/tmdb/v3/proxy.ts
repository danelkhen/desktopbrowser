import { TmdbV3Api, RateLimit, Response, PagedResponse, PagedRequest } from "tmdb-v3"
import * as tmdb from "tmdb-v3"
import { TmdbV4Api } from "tmdb-v4"
import { TmdbApiMetadata } from "./md"
import { Proxy, extractInstanceFunctionCall, ProxyCall } from "../../utils/proxy"
import { promiseSetTimeout, promiseWhile, tryParseInt } from "../../utils/utils"
import { xhr, XhrRequest, } from "../../utils/xhr"
import { TmdbScheduler } from "./scheduler"

export class TmdbV3Or4Proxy<T extends TmdbV3Api | TmdbV4Api> extends Proxy<T> {
    md: tmdb.ApiMd<T>;
    scheduler: TmdbScheduler;
    base_url = 'https://api.themoviedb.org/3';
    rateLimit: RateLimit = { limit: null, remaining: null, reset: null };
    api_key: string;
    read_access_token: string;
    access_token: string;

    async executeProxyCall(pc: ProxyCall<T>): Promise<any> {
        let md = this.md[pc.name as any];
        let path = md.path;
        let prms: any = { ...pc.args[0] };
        if (this.api_key != null && prms.api_key == null)
            prms.api_key = this.api_key;

        let body: any = null;
        if (prms.body != null) {
            body = JSON.stringify(prms.body);
            delete prms.body;
        }
        let url = this.base_url + path;
        let xhrReq: XhrRequest = {
            url,
            params: prms,
            method: md.method || "GET",
            body: body,
            headers: {
                //"Authorization": "Bearer " + (this.access_token || this.read_access_token),
                //"Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
                //"If-Modified-Since": "Fri, 15 Feb 2013 13:43:19 GMT",
            },
        };
        if (body != null)
            xhrReq.headers["Content-Type"] = "application/json;charset=utf-8";
        if (this.access_token != null || this.read_access_token != null)
            xhrReq.headers["Authorization"] = "Bearer " + (this.access_token || this.read_access_token);
        let res = await xhr(xhrReq);
        let x = xhrReq.xhr;
        let rl: RateLimit = {
            limit: tryParseInt(x.getResponseHeader("X-RateLimit-Limit")),
            remaining: tryParseInt(x.getResponseHeader("X-RateLimit-Remaining")),
            reset: tryParseInt(x.getResponseHeader("X-RateLimit-Reset")),
        };
        let resDate = new Date(x.getResponseHeader("date"));
        let now = new Date();
        let diff = now.valueOf() - resDate.valueOf();
        let probablyCached =  diff > (60 * 1000);
        if (!probablyCached && TmdbHelper.rateLimitIsNewer(rl, this.rateLimit)) {
            this.rateLimit = rl;
        }
        else {
            console.log("probably cached response", rl, this.rateLimit, diff);
            //cached response
        }
        console.log({ name: pc.name, res, path, pc, prms, rateLimit: this.rateLimit });
        return res;
    }

}
export class TmdbV3Proxy extends TmdbV3Or4Proxy<TmdbV3Api> {
    constructor() {
        super();
        this.scheduler = new TmdbScheduler(this);
        this.onInvoke = pc => this.scheduler.enqueueXhrRequest(pc);
        this.md = TmdbApiMetadata;
    }

    getNextPage<T>(action: (req: TmdbV3Api) => PagedResponse<T>, lastRes: PagedResponse<T>): Promise<T[]> {
        if (lastRes.total_pages <= lastRes.page)
            return Promise.resolve(null);
        let pc = extractInstanceFunctionCall(action);
        let pc2 = Q.copy(pc);
        let req = pc2.args[0] as PagedRequest;
        req.page = lastRes.page + 1;
        return this.onInvoke(pc2);
    }
    async getAllPages<T>(action: (req: TmdbV3Api) => PagedResponse<T>, pageAction?: (res: PagedResponse<T>) => void): Promise<T[]> {
        let page1 = await this.invoke(action);
        let rest: Promise<PagedResponse<T>>[] = [];
        let rest2: PagedResponse<T>[] = new Array(page1.total_pages);
        rest2[0] = page1;
        for (let i = 2; i <= page1.total_pages; i++) {
            rest.push(this.getNextPage(action, { page: i - 1 }).then(e => rest2[i - 1] = e));
        }
        await Promise.all(rest);
        let results = rest2.selectMany(t => t.results);
        return results;
    }

}


export class TmdbHelper {
    static rateLimitIsNewer(x: RateLimit, y: RateLimit): boolean {
        if (y == null)
            return true;
        if (x.limit == null || x.remaining == null || x.reset == null)
            return false;
        if (x.reset < y.reset)
            return false;
        if (x.reset > y.reset)
            return true;
        return x.remaining < y.remaining;
    }
}


