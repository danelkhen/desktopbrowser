import { RateLimit } from "./api"
import { Proxy, extractInstanceFunctionCall, ProxyCall } from "../../utils/proxy"
import { promiseSetTimeout, promiseWhile } from "../../utils/utils"


export class TmdbScheduler {
    constructor(public owner: SchedulerOwner) {

    }

    enqueueXhrRequest(pc: ProxyCall<any>): Promise<any> {
        let task = new SingleTask(new ActionTask(() => this.owner.executeProxyCall(pc)));
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
        console.log("processQueue", "started", this.owner.rateLimit, this.queue.length, JSON.stringify(this.queue.map(t => ({ started: t.started, ended: t.ended, name: t.data.name }))));
        this._processQueue();
        console.log("processQueue", "ended", this.owner.rateLimit, this.queue.length, JSON.stringify(this.queue.map(t => ({ started: t.started, ended: t.ended, name: t.data.name }))));
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
        if (this.owner.rateLimit == null || this.owner.rateLimit.remaining > 2)
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

