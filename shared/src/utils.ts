import moment from "moment"
import { Moment } from "moment"

export function tryParseInt(s: string | null | undefined): number | null {
    if (!s) return null
    let x = parseInt(s)
    if (isNaN(x)) return null
    return x
}

export function promiseReuseIfStillRunning<T>(action: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> | null = null
    return function(this: any) {
        console.log("promiseReuseIfStillRunning", { this: this })
        if (promise != null) return promise
        promise = action.call(this).then((t: any) => {
            promise = null
            return t
        })
        return promise
    }
}

/** Will wrap the function and cause it to be reused if it's still running, use for long running async operations that should never run in parallel */
export function ReusePromiseIfStillRunning(): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let originalFuncKey = "_" + String(propertyKey) + "_original"
        let promiseKey = "_" + String(propertyKey) + "_promise"
        target[originalFuncKey] = descriptor.value
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
`)
    }
}

/** Will wrap the function and cause it to run only once, regardless of how many times it was called, use for things like init() */
export function ReusePromise(): MethodDecorator {
    return function(target: any, propertyKey: string | Symbol, descriptor: PropertyDescriptor) {
        let originalFuncKey = "_" + String(propertyKey) + "_original"
        let promiseKey = "_" + String(propertyKey) + "_promise"
        target[originalFuncKey] = descriptor.value
        descriptor.value = new Function(`// generated code
if (this.${promiseKey} == null)
    this.${promiseKey} = this.${originalFuncKey}();
return this.${promiseKey};
`)
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms || 0))
}

export interface SelectorFunc<T, R> {
    (obj: T): R
}

export interface ComparerFunc<T> {
    (x: T, y: T): number
}

export function tryParseExactMoment(s: string, format: string): Moment | null {
    const x = moment(s, format)
    if (!x.isValid()) return null
    return x
}
export function tryParseExactDate(s: string, format: string): Date | null {
    const x = tryParseExactMoment(s, format)
    if (!x) return null
    return x.toDate()
}

let DefaultDateFormat = "YYYY-MM-DD hh:mm:ss"

export function toDefaultDate(s: string): Date | null {
    return tryParseExactDate(s, DefaultDateFormat)
}

export function toFriendlyRelative2(dt2: Date | null, rel2?: Date) {
    const dt = moment(dt2!)
    if (rel2 == null) rel2 = new Date()
    const rel = moment(rel2)
    if (dt.year() == rel.year()) {
        if (dt.month() == rel.month()) {
            if (dt.day() == rel.day()) {
                return dt.format("HH:mm")
            }
            return dt.format("MMM D")
        }
        return dt.format("MMM D")
    }
    return dt.format("YYYY-MM-DD")
}

export type ExtractKeysOfType<T extends object, U> = {
    [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

export type FilterKeysOfType<T extends object, U> = Pick<T, ExtractKeysOfType<T, U>>

export type AllowOnly<T, U> = Record<keyof T, U>
