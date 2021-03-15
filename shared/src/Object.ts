export const entries = Symbol("entries")
declare global {
    interface Object {
        [entries]<T>(this: { [s: string]: T }): [string, T][]
        [entries](this: {}): [string, any][]
    }
}

Object.prototype[entries] = function<T>(this: { [s: string]: T }): [string, T][] {
    return Object.entries(this)
}
