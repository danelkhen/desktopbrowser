import { RateLimit } from "tmdb-v3"
import { Proxy, extractInstanceFunctionCall, ProxyCall } from "../../utils/proxy"
import { promiseSetTimeout, } from "../../utils/utils"


export class TmdbScheduler {
    constructor(public owner: SchedulerOwner) {

    }

    enqueueXhrRequest(pc: ProxyCall<any>): Promise<any> {
        let task = this.queue.find(t => {
            let pc2 = t.data as ProxyCall<any>;
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

    isScheduled: boolean;
    async scheduleProcessQueue(delay: number = 0) {
        if (this.isScheduled)
            return;
        this.isScheduled = true;
        await promiseSetTimeout(delay);
        this.isScheduled = false;
        this.processQueue();
    }

    processQueue() {
        //console.log("processQueue", "started", this.owner.rateLimit, this.queue.length, JSON.stringify(this.queue.map(t => ({ started: t.started, ended: t.ended, name: t.data.name }))));
        this._processQueue();
        //console.log("processQueue", "ended", this.owner.rateLimit, this.queue.length, JSON.stringify(this.queue.map(t => ({ started: t.started, ended: t.ended, name: t.data.name }))));
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
            //if (this.rateLimit != null && this.rateLimit.remaining == 0)
            //    return this.waitUntilNextResetIfNeeded().then(() => this.scheduleProcessQueue());
            if (this.queue.filter(t => t.started != null && t.ended == null).length > 10)
                return;

            let task = this.queue.first(t => !t.started);
            if (task == null)
                return;
            task.execute();
        }
        this.scheduleProcessQueue(100);
    }

    queue: SingleTask<any>[] = [];
    getTimeToWait(): number {
        if (this.owner.rateLimit == null || this.owner.rateLimit.remaining > 10)
            return 0;
        let endTime = this.owner.rateLimit.reset * 1000;
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

}

export interface SchedulerOwner {
    executeProxyCall(pc: ProxyCall<any>): Promise<any>;
    rateLimit: RateLimit;

}


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
export class ActionDataTask<D, T> implements Task<T>{
    constructor(public data: D, public action: (data: D) => Promise<T>) {
    }
    started: Date;
    ended: Date;
    async execute(): Promise<T> {
        this.started = new Date();
        let res = await this.action(this.data);
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

