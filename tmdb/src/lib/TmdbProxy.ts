import * as tmdb from "./tmdb-v3"
import { PagedRequest, PagedResponse, RateLimit, TmdbV3Api } from "./tmdb-v3"
import { TmdbV4Api } from "./tmdb-v4"
import { extractInstanceFunctionCall, Proxy, ProxyCall, Invoker } from "./utils/Proxy"
import { tryParseInt } from "shared"
import { xhr, XhrRequest } from "./utils/xhr"
import { TmdbApiMetadata } from "./v3/TmdbApiMetadata"
import { TmdbScheduler, SchedulerOwner } from "./TmdbScheduler"

export class TmdbProxy<T extends TmdbV3Api | TmdbV4Api> implements SchedulerOwner<T> {
    md: tmdb.ApiMd<T> | null = null
    scheduler: TmdbScheduler<T> | null = null
    base_url = "https://api.themoviedb.org/3"
    rateLimit: RateLimit = {}
    api_key: string | null = null
    read_access_token: string | null = null
    access_token: string | null = null

    invoker: Invoker<T> = ({ method, prms }) => {
        return this.executeProxyCall({ name: method, args: prms as any }) as any
    }

    async executeProxyCall(pc: ProxyCall<T>): Promise<any> {
        let md = (this.md as any)?.[pc.name as any]
        let path = md.path
        let prms: any = { ...(pc.args?.[0] ?? []) }
        if (this.api_key != null && prms.api_key == null) prms.api_key = this.api_key

        let body: any = null
        if (prms.body != null) {
            body = JSON.stringify(prms.body)
            delete prms.body
        }
        let url = this.base_url + path
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
        }
        if (body != null) {
            xhrReq.headers!["Content-Type"] = "application/json;charset=utf-8"
        }
        if (this.access_token != null || this.read_access_token != null)
            xhrReq.headers!["Authorization"] = "Bearer " + (this.access_token || this.read_access_token)
        let res = await xhr(xhrReq)
        let x = xhrReq.xhr
        if (x) {
            let rl: RateLimit = {
                limit: tryParseInt(x?.getResponseHeader("X-RateLimit-Limit")) ?? undefined,
                remaining: tryParseInt(x?.getResponseHeader("X-RateLimit-Remaining")) ?? undefined,
                reset: tryParseInt(x?.getResponseHeader("X-RateLimit-Reset")) ?? undefined,
            }
            let resDate = new Date(x.getResponseHeader("date")!)
            let now = new Date()
            let diff = now.valueOf() - resDate.valueOf()
            let probablyCached = diff > 60 * 1000
            if (!probablyCached && TmdbHelper.rateLimitIsNewer(rl, this.rateLimit)) {
                this.rateLimit = rl
            } else {
                console.log("probably cached response", rl, this.rateLimit, diff)
                //cached response
            }
        }
        console.log({ name: pc.name, res, path, pc, prms, rateLimit: this.rateLimit })
        return res
    }
}
export class TmdbV3Proxy extends TmdbProxy<TmdbV3Api> implements SchedulerOwner<TmdbV3Api> {
    constructor() {
        super()
        this.scheduler = new TmdbScheduler(this)
        this.md = TmdbApiMetadata
    }

    getNextPage<T>(
        action: (req: TmdbV3Api) => PagedResponse<T>,
        lastRes: PagedResponse<T>
    ): Promise<PagedResponse<T> | null> {
        if (lastRes.total_pages! <= lastRes.page!) return Promise.resolve(null)
        let pc = extractInstanceFunctionCall(action)
        let pc2: ProxyCall<any> = { ...pc }
        let req = pc2.args![0] as PagedRequest
        req.page = lastRes.page! + 1
        return this.invoker({ method: pc2.name as any, prms: pc2.args as any })
    }
    async getAllPages<T>(
        action: (req: TmdbV3Api) => PagedResponse<T>,
        pageAction?: (res: PagedResponse<T>) => void
    ): Promise<T[]> {
        let page1 = await (this as any).invoke(action) // TODO:
        let rest: Promise<PagedResponse<T> | null>[] = []
        let rest2: (PagedResponse<T> | null)[] = new Array(page1.total_pages)
        rest2[0] = page1
        for (let i = 2; i <= page1.total_pages!; i++) {
            rest.push(this.getNextPage(action, { page: i - 1 }).then(e => (rest2[i - 1] = e)))
        }
        await Promise.all(rest)
        let results = rest2.flatMap(t => t?.results ?? [])
        return results
    }
}

export class TmdbHelper {
    static rateLimitIsNewer(x: RateLimit, y: RateLimit): boolean {
        if (!y) return true
        if (x.limit == null || x.remaining == null || x.reset == null) return false
        if (x.reset < y.reset!) return false
        if (x.reset > y.reset!) return true
        return x.remaining < y.remaining!
    }
}
