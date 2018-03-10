"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
class TmdbScheduler {
    constructor(owner) {
        this.owner = owner;
        this.queue = [];
    }
    enqueueXhrRequest(pc) {
        let task = this.queue.find(t => {
            let pc2 = t.data;
            if (pc.name != pc2.name)
                return false;
            if (pc.args.length != pc2.args.length)
                return false;
            if (JSON.stringify(pc.args) != JSON.stringify(pc2.args))
                return false;
            return true;
        });
        if (task != null) {
            console.log("found similar ProxyCall, reusing", task, pc);
            return task.toPromise();
        }
        task = new SingleTask(new ActionDataTask(pc, t => this.owner.executeProxyCall(t)));
        task.data = pc;
        this.queue.push(task);
        this.scheduleProcessQueue();
        return task.toPromise();
    }
    async scheduleProcessQueue(delay = 0) {
        if (this.isScheduled)
            return;
        this.isScheduled = true;
        await utils_1.promiseSetTimeout(delay);
        this.isScheduled = false;
        this.processQueue();
    }
    processQueue() {
        this._processQueue();
    }
    _processQueue() {
        for (let i = 0; i < 10; i++) {
            if (this.queue.length == 0)
                return;
            this.queue.removeAll(t => t.started != null && t.ended != null);
            if (this.queue.length == 0)
                return;
            if (this.queue.filter(t => !t.started).length == 0)
                return;
            let tto = this.getTimeToWait();
            if (tto > 0) {
                console.log("time to wait", tto);
                this.scheduleProcessQueue(tto);
                return;
            }
            if (this.queue.filter(t => t.started != null && t.ended == null).length > 10)
                return;
            let task = this.queue.first(t => !t.started);
            if (task == null)
                return;
            task.execute();
        }
        this.scheduleProcessQueue(100);
    }
    getTimeToWait() {
        if (this.owner.rateLimit == null || this.owner.rateLimit.remaining > 10)
            return 0;
        let endTime = this.owner.rateLimit.reset * 1000;
        let now = new Date().valueOf();
        let diff = endTime - now;
        return diff;
    }
    waitUntilNextResetIfNeeded() {
        let diff = this.getTimeToWait();
        if (diff <= 0)
            return Promise.resolve();
        return utils_1.promiseSetTimeout(diff);
    }
}
exports.TmdbScheduler = TmdbScheduler;
class ActionTask {
    constructor(action) {
        this.action = action;
    }
    async execute() {
        this.started = new Date();
        let res = await this.action();
        this.ended = new Date();
        return res;
    }
}
exports.ActionTask = ActionTask;
class ActionDataTask {
    constructor(data, action) {
        this.data = data;
        this.action = action;
    }
    async execute() {
        this.started = new Date();
        let res = await this.action(this.data);
        this.ended = new Date();
        return res;
    }
}
exports.ActionDataTask = ActionDataTask;
class SingleTask {
    constructor(task) {
        this.task = task;
    }
    get started() { return this.task.started; }
    get ended() { return this.task.ended; }
    execute() {
        if (this.resultPromise != null)
            return this.resultPromise;
        this.resultPromise = this.task.execute();
        if (this.resolve != null)
            this.resolve(this.resultPromise);
        return this.resultPromise;
    }
    toPromise() {
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
exports.SingleTask = SingleTask;
//# sourceMappingURL=scheduler.js.map