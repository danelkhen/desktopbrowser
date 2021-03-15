// export interface SymbolMap extends Record<string, symbol> {}

// export namespace SymbolMap {
//     export type KeyValueEntry<T extends SymbolMap> = {
//         [P in keyof T]: { key: P; value: T[P] }
//     }[keyof T]
//     export type Entry<T extends SymbolMap> = {
//         [P in keyof T]: [P, T[P]]
//     }[keyof T]
//     export type Value<T extends SymbolMap> = T[keyof T]
//     export type Inverted<T extends SymbolMap> = {
//         [P in KeyValueEntry<T>["value"]]: Extract<KeyValueEntry<T>, { value: P }>["key"]
//     }
//     export function invert<T extends SymbolMap>(obj: T): Inverted<T> {
//         const res: any = {}
//         for (const [string, symbol] of Object.entries(obj)) {
//             res[symbol] = string
//         }
//         return res
//     }
//     export function values<T extends SymbolMap>(obj: T): T[keyof T][] {
//         return Object.values(obj) as any
//     }
//     export function keys<T extends SymbolMap>(obj: T): (keyof T)[] {
//         return Object.keys(obj)
//     }
//     export function getKey<T extends SymbolMap>(obj: T, value: Value<T>): keyof T {
//         return entries(obj).find(([_, value2]) => value2 == value) as any
//     }
//     export function entries<T extends SymbolMap>(obj: T): Entry<T>[] {
//         return Object.entries(obj) as any
//     }
// }

// export type MetaSymbolMap<K extends SymbolMap, V> = Record<SymbolMap.Value<K>, V>
// export namespace MetaSymbolMap {
//     export type Meta<K extends SymbolMap, V> = Record<SymbolMap.Value<K>, V>
//     export function entries<T extends SymbolMap, V>(obj: Partial<Meta<T, V>>): [SymbolMap.Value<T>, V][] {
//         return keys(obj).map(key => [key, obj[key]]) as any
//     }
//     export function keys<T extends SymbolMap, V>(obj: Partial<Meta<T, V>>): SymbolMap.Value<T>[] {
//         return Object.getOwnPropertySymbols(obj) as any
//     }
// }

// export class SymbolMapHelper<T extends SymbolMap> {
//     private _inverted: SymbolMap.Inverted<T> | undefined
//     constructor(public target: T) {}
//     get values() {
//         return SymbolMap.values(this.target)
//     }
//     get keys() {
//         return SymbolMap.keys(this.target)
//     }
//     getKey(value: SymbolMap.Value<T>): keyof T {
//         return this.inverted[value]
//     }
//     get entries() {
//         return SymbolMap.entries(this.target)
//     }
//     get inverted() {
//         if (!this._inverted) {
//             this._inverted = SymbolMap.invert(this.target)
//         }
//         return this._inverted!
//     }
// }

// export class MetaSymbolMapHelper<T extends SymbolMap, V> {
//     constructor(public target: Partial<MetaSymbolMap<T, V>>) {}
//     get keys() {
//         return MetaSymbolMap.keys(this.target)
//     }
//     get entries() {
//         return MetaSymbolMap.entries(this.target)
//     }
// }
