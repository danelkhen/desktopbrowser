"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_1 = require("../v3/proxy");
const md_1 = require("./md");
const scheduler_1 = require("../v3/scheduler");
class TmdbV4Proxy extends proxy_1.TmdbV3Or4Proxy {
    constructor() {
        super();
        this.scheduler = new scheduler_1.TmdbScheduler(this);
        this.onInvoke = pc => this.scheduler.enqueueXhrRequest(pc);
        this.base_url = 'https://api.themoviedb.org/4';
        this.md = md_1.TmdbApiMetadata;
    }
}
exports.TmdbV4Proxy = TmdbV4Proxy;
//# sourceMappingURL=proxy.js.map