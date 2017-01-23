export class Name {
    static of<T>(): NameFunc<T> {
        return nameof;
    }
}
export interface NameFunc<T> {
    (prop: SelectorFunc<T, any>): string
}

export function nameof<T>(prop: SelectorFunc<T, any>): string {
    let prop2: any = prop;
    let code: string;
    if (prop2.isDelegate)
        code = prop2.func.toString();
    else
        code = prop.toString();
    return code.substringBetween(".", ";");
}

export function promiseEach<T>(list: T[], handler: (obj: T, index: number) => Promise<any> | any): Promise<any> {
    return promiseMap<T, any>(list, handler);
}

export function promiseMap<T, R>(list: T[], handler: (obj: T, index: number) => Promise<R> | R): Promise<R[]> {
    let res: R[] = [];
    let promise = Promise.resolve();
    list.forEach((obj, i) => promise = promise.then(() => handler(obj, i)).then(e => { res.push(e); }));
    return promise.then(() => res);
}

export function arrayDistinctBy<T, V>(list: T[], selector: (obj: T) => V): T[] {
    let pairs = list.map(t => [selector(t), t] as [V, T]);
    let map = new Map<V, T>(pairs);
    let list2 = Array.from(map.values());
    return list2;
}

export function tryParseInt(s: string): number {
    let x = parseInt(s);
    if (isNaN(x))
        return null;
    return x;
}

export function promiseSetTimeout(ms: number): Promise<any> {
    return new Promise((resolve, reject) => window.setTimeout(resolve, ms));
}
export function promiseWhile(condition: () => boolean, action: () => Promise<any>): Promise<any> {
    function loop() {
        if (!condition())
            return Promise.resolve();
        return action().then(loop);
    }
    return loop();
}


export function setMinus<T>(x: Set<T>, y: Set<T>): Set<T> {
    let list: T[] = [];
    x.forEach(t => !y.has(t) && list.push(t));
    return new Set(list);
}
export function setPlus<T>(x: Set<T>, y: Set<T>): Set<T> {
    return new Set<T>([...Array.from(x), ...Array.from(y)]);
}
export function setIntersect<T>(x: Set<T>, y: Set<T>): Set<T> {
    let list: T[] = [];
    x.forEach(t => x.has(t) && y.has(t) && list.push(t));
    return new Set(list);
}

export function promiseReuseIfStillRunning<T>(action: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> = null;
    return function () {
        console.log("promiseReuseIfStillRunning", { this: this });
        if (promise != null)
            return promise;
        promise = action.call(this).then(t => { promise = null; return t; });
        return promise;
    };
}

/** Will wrap the function and cause it to be reused if it's still running, use for long running async operations that should never run in parallel */
export function ReusePromiseIfStillRunning(): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalFuncKey = "_" + propertyKey + "_original";
        let promiseKey = "_" + propertyKey + "_promise";
        target[originalFuncKey] = descriptor.value;
        descriptor.value = new Function(`// generated code
if (this.${promiseKey} == null) {
    this.${promiseKey} = this.${originalFuncKey}().then(t => { 
        this.${promiseKey} = null; 
        return t;
    }, 
    err => {
        this.${promiseKey} = null; 
        return Promise.reject(err); 
    });
}
return this.${promiseKey};
`);
    };
}

/** Will wrap the function and cause it to run only once, regardless of how many times it was called, use for things like init() */
export function ReusePromise(): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalFuncKey = "_" + propertyKey + "_original";
        let promiseKey = "_" + propertyKey + "_promise";
        target[originalFuncKey] = descriptor.value;
        descriptor.value = new Function(`// generated code
if (this.${promiseKey} == null)
    this.${promiseKey} = this.${originalFuncKey}();
return this.${promiseKey};
`);
    };
}
