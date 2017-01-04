import { TmdbApi, TmdbApiMetadata, RateLimit, Response, PagedResponse, PagedRequest } from "./tmdb-api"
import { Proxy, extractInstanceFunctionCall, ProxyCall } from "../utils/proxy"
import { promiseSetTimeout, promiseWhile } from "../utils/utils"
import { xhr, XhrRequest, } from "./xhr"

export class TmdbApiClient extends Proxy<TmdbApi>{
    constructor() {
        super();
        this.onInvoke = pc => this.enqueueXhrRequest(pc);
    }


    executeProxyCall(pc: ProxyCall<TmdbApi>): Promise<any> {
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
        return xhr(xhrReq)
            .then(res => {
                let x = xhrReq.xhr;
                //console.log("Date header:", x.getResponseHeader("Date"));
                let rl: RateLimit = {
                    limit: parseInt(x.getResponseHeader("X-RateLimit-Limit")),
                    remaining: parseInt(x.getResponseHeader("X-RateLimit-Remaining")),
                    reset: parseInt(x.getResponseHeader("X-RateLimit-Reset")),
                };
                if (this.isNewer(rl, this.rateLimit)) {
                    this.rateLimit = rl;
                }
                else {
                    console.log("probably cached response", rl, this.rateLimit);
                    //cached response
                }
                console.log({ name: pc.name, res, path, pc, prms, rateLimit: this.rateLimit });
                return res;
            });
    }
    isNewer(x: RateLimit, y: RateLimit): boolean {
        if (y == null)
            return true;
        if (x.reset < y.reset)
            return false;
        if (x.reset > y.reset)
            return true;
        return x.remaining < y.remaining;
    }

    enqueueXhrRequest(pc: ProxyCall<TmdbApi>): Promise<any> {
        let task = new SingleTask(new ActionTask(() => this.executeProxyCall(pc)));
        task.data = pc;
        this.queue.push(task);
        this.scheduleProcessQueue();
        return task.toPromise();
    }

    isScheduled: boolean;
    scheduleProcessQueue(delay: number = 0) {
        if (this.isScheduled)
            return;
        this.isScheduled = true;
        promiseSetTimeout(delay).then(() => {
            this.isScheduled = false;
            this.processQueue();
        });
    }

    processQueue() {
        console.log("processQueue", "started", this.rateLimit, this.queue.length, JSON.stringify(this.queue.map(t => ({ started: t.started, ended: t.ended, name: t.data.name }))));
        this._processQueue();
        console.log("processQueue", "ended", this.rateLimit, this.queue.length, JSON.stringify(this.queue.map(t => ({ started: t.started, ended: t.ended, name: t.data.name }))));
    }
    _processQueue() {
        if (this.queue.length == 0)
            return;
        this.queue.removeAll(t => t.started != null && t.ended != null);
        if (this.queue.length == 0)
            return;
        let tto = this.getTimeToWait();
        if (tto > 0) {
            console.log("time to wait", tto);
            this.scheduleProcessQueue(tto);
            return;
        }
        //if (this.rateLimit != null && this.rateLimit.remaining == 0)
        //    return this.waitUntilNextResetIfNeeded().then(() => this.scheduleProcessQueue());
        if (this.queue.filter(t => t.started != null && t.ended == null).length > 10)
            return;

        let task = this.queue[0];
        task.execute().then(() => this.scheduleProcessQueue());
    }

    queue: SingleTask<any>[] = [];
    //lastRequestAt: Date;
    //isSlotReady(item: QueueItem): boolean {
    //    return this.queue[0] == item && new Date().valueOf() - this.lastRequestAt.valueOf() >= 250;
    //}
    getTimeToWait(): number {
        if (this.rateLimit == null || this.rateLimit.remaining > 2)
            return 0;
        let endTime = this.rateLimit.reset * 1000;
        let now: number = new Date().valueOf();
        let diff = endTime - now;
        return diff;
    }
    waitUntilNextResetIfNeeded(): Promise<any> {
        let diff = this.getTimeToWait();
        if (diff <= 0)
            return Promise.resolve();
        return promiseSetTimeout(diff);
    }
    //waitForSlot(req: XhrRequest): Promise<any> {
    //    return Promise.resolve();
    //    //let item: QueueItem = { req };
    //    //this.queue.push(item);
    //    //return promiseWhile(() => !this.isSlotReady(item), () => promiseSetTimeout(100))
    //    //    .then(() => this.queue.removeAt(0));

    //}

    getNextPage<T>(action: (req: TmdbApi) => PagedResponse<T>, lastRes: PagedResponse<T>): Promise<T[]> {
        if (lastRes.total_pages <= lastRes.page)
            return Promise.resolve(null);
        let pc = extractInstanceFunctionCall(action);
        let pc2 = Q.copy(pc);
        let req = pc2.args[0] as PagedRequest;
        req.page = lastRes.page + 1;
        return this.onInvoke(pc2);
    }
    getAllPages<T>(action: (req: TmdbApi) => PagedResponse<T>, pageAction?: (res: PagedResponse<T>) => void): Promise<T[]> {
        let list: PagedResponse<T>[] = [];
        let onRes = (res: PagedResponse<T>) => {
            list.push(res);
            if (pageAction != null && res != null)
                pageAction(res);
        };
        let next = () => this.getNextPage(action, list.last()).then(onRes);

        return this.invoke(action)
            .then(res => onRes(res))
            .then(() => promiseWhile(() => list.last() != null, next))
            .then(() => list.exceptNulls().selectMany(t => t.results));
    }
    async getAllPages2<T>(action: (req: TmdbApi) => PagedResponse<T>, pageAction?: (res: PagedResponse<T>) => void): Promise<T[]> {
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

    api_key: string;
    base_url = 'https://api.themoviedb.org/3';
    rateLimit: RateLimit = { limit: null, remaining: null, reset: null };
}
//export interface QueueItem {
//    req: XhrRequest;
//}
export interface Task<T> {
    execute(): Promise<T>;
    started: Date;
    ended: Date;
}

export class ActionTask<T> implements Task<T>{
    constructor(public action: () => Promise<T>) {
    }
    started: Date;
    ended: Date;
    async execute(): Promise<T> {
        this.started = new Date();
        let res = await this.action();
        this.ended = new Date();
        return res;
    }
}

export class SingleTask<T> implements Task<T>{
    constructor(public task: Task<T>) {
    }
    data: any;

    get started(): Date { return this.task.started; }
    get ended(): Date { return this.task.ended; }
    resultPromise: Promise<T>;
    execute(): Promise<T> {
        if (this.resultPromise != null)
            return this.resultPromise;
        this.resultPromise = this.task.execute();
        if (this.resolve != null)
            this.resolve(this.resultPromise);
        return this.resultPromise;
    }
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    toPromise(): Promise<T> {
        if (this.resultPromise != null)
            return this.resultPromise;
        if (this.promise != null)
            return this.promise;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        return this.promise;

    }
}
