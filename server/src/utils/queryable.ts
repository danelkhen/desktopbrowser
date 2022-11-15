/* eslint-disable @typescript-eslint/no-explicit-any */
export async function* map<T, R>(
    list: AsyncIterableIterator<T>,
    cb: (item: T, index: number) => R
): AsyncIterableIterator<R> {
    let index = 0
    for await (const item of list) {
        yield cb(item, index)
        index++
    }
}

export async function* filter<T>(
    list: AsyncIterableIterator<T>,
    cb: (item: T, index: number) => boolean
): AsyncIterableIterator<T> {
    let index = 0
    for await (const item of list) {
        if (cb(item, index)) yield item
        index++
    }
}

export async function* skip<T>(list: AsyncIterableIterator<T>, count: number): AsyncIterableIterator<T> {
    let index = 0
    for await (const item of list) {
        if (index >= count) yield item
        index++
    }
}
export async function* take<T>(list: AsyncIterableIterator<T>, count: number): AsyncIterableIterator<T> {
    if (count <= 0) return
    let index = 0
    for await (const item of list) {
        yield item
        index++
        if (index >= count) break
    }
}

export function toQueryable<T>(list: AsyncIterableIterator<T>): Queryable<T> {
    return new Queryable<T>(list)
}

export class Queryable<T> {
    constructor(public source: AsyncIterableIterator<T>) {}
    select<R>(cb: (item: T, index: number) => R): Queryable<R> {
        return new Queryable<R>(map(this.source, cb))
    }
    where(cb: (item: T, index: number) => any): Queryable<T> {
        return new Queryable<T>(filter(this.source, cb))
    }
    skip(count: number): Queryable<T> {
        return new Queryable<T>(skip(this.source, count))
    }
    take(count: number): Queryable<T> {
        return new Queryable<T>(take(this.source, count))
    }

    async toArray(): Promise<T[]> {
        const list: T[] = []
        for await (const item of this.source) {
            list.push(item)
        }
        return list
    }
}
