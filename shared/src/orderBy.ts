// export const orderBy = Symbol("orderBy")

// declare global {
//     interface Array<T> {
//         [orderBy]<K>(selector: OrderBy<T, K>): T[]
//         [orderBy](...selectors: OrderBy<T, unknown>[]): T[]
//         [orderBy](...selectors: OrderBy<T, unknown>[]): T[]
//     }
// }

// Array.prototype[orderBy] = function <T>(this: Array<T>, ...selectors: OrderBy<T, unknown>[]): T[] {
//     return arrayOrderBy(this, ...selectors)
// }

// export interface OrderBy<T, K> {
//     (item: T): K
//     desc?: boolean
//     comparer?(a: K, b: K): number
// }
// export type OrderByDescending<T, K> = {
//     (item: T): K
//     desc: true
// }
// export type OrderByAscending<T, K> = {
//     (item: T): K
//     desc?: false
// }
// export function desc<T, K>(orderBy: OrderBy<T, K>, desc: true): OrderByDescending<T, K>
// export function desc<T, K>(orderBy: OrderBy<T, K>, desc: false): OrderByAscending<T, K>
// export function desc<T, K>(orderBy: OrderBy<T, K>, desc?: boolean): OrderBy<T, K>
// export function desc<T, K>(orderBy: OrderBy<T, K>, desc = true): OrderBy<T, K> {
//     orderBy.desc = desc
//     return orderBy
// }
// export function comparer<T, K>(orderBy: OrderBy<T, K>, comp: ((a: K, b: K) => number) | undefined): OrderBy<T, K> {
//     orderBy.comparer = comp
//     return orderBy
// }
// function arrayOrderBy<K, T>(list: readonly T[], selector: OrderBy<T, K>): T[]
// function arrayOrderBy<T>(list: readonly T[], ...selectors: OrderBy<T, unknown>[]): T[]
// function arrayOrderBy<T>(list: readonly T[], ...selectors: OrderBy<T, unknown>[]): T[] {
//     if (!selectors.length) {
//         selectors = [t => t]
//     }
//     const comparer = createComparer(selectors)
//     const list2 = list.slice(0)
//     list2.sort(comparer)
//     return list2
// }

// export function createComparer<T>(selectors: Array<OrderBy<T, unknown>>) {
//     const bys: OrderBy<T, unknown>[] = selectors

//     function comparer(a: T, b: T): number {
//         for (const by of bys) {
//             const desc = by.desc ? -1 : 1
//             const bigger = 1 * desc
//             const smaller = -1 * desc
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const x = by(a) as any
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const y = by(b) as any
//             if (by.comparer) {
//                 const res = by.comparer(a, b)
//                 if (res === 0) continue
//                 return res
//             }
//             if (x == y) continue
//             if (x == null) return smaller
//             if (y == null) return bigger
//             if (x > y) return bigger
//             if (x < y) return smaller
//         }
//         return 0
//     }
//     return comparer
// }
