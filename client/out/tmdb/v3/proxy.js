"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md_1 = require("./md");
const proxy_1 = require("../../utils/proxy");
const utils_1 = require("../../utils/utils");
const xhr_1 = require("../../utils/xhr");
const scheduler_1 = require("./scheduler");
class TmdbV3Or4Proxy extends proxy_1.Proxy {
    constructor() {
        super(...arguments);
        this.base_url = 'https://api.themoviedb.org/3';
        this.rateLimit = { limit: null, remaining: null, reset: null };
    }
    async executeProxyCall(pc) {
        let md = this.md[pc.name];
        let path = md.path;
        let prms = Object.assign({}, pc.args[0]);
        if (this.api_key != null && prms.api_key == null)
            prms.api_key = this.api_key;
        let body = null;
        if (prms.body != null) {
            body = JSON.stringify(prms.body);
            delete prms.body;
        }
        let url = this.base_url + path;
        let xhrReq = {
            url,
            params: prms,
            method: md.method || "GET",
            body: body,
            headers: {},
        };
        if (body != null)
            xhrReq.headers["Content-Type"] = "application/json;charset=utf-8";
        if (this.access_token != null || this.read_access_token != null)
            xhrReq.headers["Authorization"] = "Bearer " + (this.access_token || this.read_access_token);
        let res = await xhr_1.xhr(xhrReq);
        let x = xhrReq.xhr;
        let rl = {
            limit: utils_1.tryParseInt(x.getResponseHeader("X-RateLimit-Limit")),
            remaining: utils_1.tryParseInt(x.getResponseHeader("X-RateLimit-Remaining")),
            reset: utils_1.tryParseInt(x.getResponseHeader("X-RateLimit-Reset")),
        };
        let resDate = new Date(x.getResponseHeader("date"));
        let now = new Date();
        let diff = now.valueOf() - resDate.valueOf();
        let probablyCached = diff > (60 * 1000);
        if (!probablyCached && TmdbHelper.rateLimitIsNewer(rl, this.rateLimit)) {
            this.rateLimit = rl;
        }
        else {
            console.log("probably cached response", rl, this.rateLimit, diff);
        }
        console.log({ name: pc.name, res, path, pc, prms, rateLimit: this.rateLimit });
        return res;
    }
}
exports.TmdbV3Or4Proxy = TmdbV3Or4Proxy;
class TmdbV3Proxy extends TmdbV3Or4Proxy {
    constructor() {
        super();
        this.scheduler = new scheduler_1.TmdbScheduler(this);
        this.onInvoke = pc => this.scheduler.enqueueXhrRequest(pc);
        this.md = md_1.TmdbApiMetadata;
    }
    getNextPage(action, lastRes) {
        if (lastRes.total_pages <= lastRes.page)
            return Promise.resolve(null);
        let pc = proxy_1.extractInstanceFunctionCall(action);
        let pc2 = Q.copy(pc);
        let req = pc2.args[0];
        req.page = lastRes.page + 1;
        return this.onInvoke(pc2);
    }
    async getAllPages(action, pageAction) {
        let page1 = await this.invoke(action);
        let rest = [];
        let rest2 = new Array(page1.total_pages);
        rest2[0] = page1;
        for (let i = 2; i <= page1.total_pages; i++) {
            rest.push(this.getNextPage(action, { page: i - 1 }).then(e => rest2[i - 1] = e));
        }
        await Promise.all(rest);
        let results = rest2.selectMany(t => t.results);
        return results;
    }
}
exports.TmdbV3Proxy = TmdbV3Proxy;
class TmdbHelper {
    static rateLimitIsNewer(x, y) {
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
exports.TmdbHelper = TmdbHelper;
//# sourceMappingURL=proxy.js.map