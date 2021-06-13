export const remove = Symbol("remove")
export const itemsAre = Symbol("itemsAre")
export const groupBy = Symbol("itemsAre")
export const takeWhile = Symbol("takeWhile")
export const last = Symbol("last")

declare global {
    interface Array<T> {
        [remove](item: T): void
        [itemsAre](y: T[]): boolean
        [groupBy]<K>(keySelector: (item: T) => K): T[][]
        [takeWhile](pred: (item: T, index?: number) => boolean): T[]
        readonly [last]: T | undefined
    }
}

Array.prototype[takeWhile] = function <T>(this: Array<T>, pred: (item: T, index?: number) => boolean): T[] {
    return arrayTakeWhile(this, pred)
}
Array.prototype[remove] = function <T>(this: Array<T>, item: T): void {
    return arrayRemove(this, item)
}
Array.prototype[itemsAre] = function <T>(this: Array<T>, y: T[]): boolean {
    return arrayItemsEqual(this, y)
}
Array.prototype[groupBy] = function <T, K>(this: Array<T>, keySelector: (item: T) => K): T[][] {
    return arrayGroupBy(this, keySelector)
}
Object.defineProperty(Array.prototype, last, {
    get: function <T>(this: Array<T>): T | undefined {
        const length = this.length
        return length ? this[this.length - 1] : undefined
    },
})

function arrayTakeWhile<T>(list: T[], pred: (item: T, index?: number) => boolean): T[] {
    const took: T[] = []
    list.find(t => {
        const take = pred(t)
        if (take) took.push(t)
        return !take
    })
    return took
}

function arrayGroupBy<T, K>(list: T[], keySelector: (item: T) => K): T[][] {
    const map = new Map<K, T[]>()
    for (const item of list) {
        const key = keySelector(item)
        let list = map.get(key)
        if (!list) {
            list = []
            map.set(key, list)
        }
        list.push(item)
    }
    return Array.from(map.values())
}

function arrayItemsEqual<T>(x: T[], y: T[]): boolean {
    if (y === x) return true
    if (y.length !== x.length) return false
    for (let i = 0; i < x.length; i++)
        if (!Object.is(x[i], y[i])) {
            return false
        }
    return true
}

function arrayRemove<T>(x: T[], item: T) {
    const index = x.indexOf(item)
    if (index < 0) return
    x.splice(index, 1)
}

// function arrayDistinctBy<T, V>(list: T[], selector: (obj: T) => V): T[] {
//     const pairs = list.map(t => [selector(t), t] as [V, T])
//     const map = new Map<V, T>(pairs)
//     const list2 = Array.from(map.values())
//     return list2
// }
