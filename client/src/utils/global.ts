import { removeLast } from "../../../shared/src"

// interface StringConstructor {
//     isNullOrEmpty(s: string): boolean
//     isNotNullOrEmpty(s: string): boolean
//     Format(format: string, ...args: any[]): string
// }

// interface Array<T> {
//     StringConcat(selector: (obj: T) => any, prefix: string, separator: string, suffix: string): string
//     GetSiblingOrEdge(item: T, offset: number): T
//     ItemGetter<V>(prop: (item: T) => V): (item: T) => V
// }

// Array.prototype.GetSiblingOrEdge = function<T>(item: T, offset: number): T {
//     let list: T[] = this
//     if (offset == null || offset == 0) return item
//     var index = list.indexOf(item)
//     var newIndex = (index += offset)
//     if (newIndex < 0 || newIndex >= list.length) {
//         if (offset > 0) return list[list.length - 1]
//         return list[0]
//     }
//     return list[newIndex]
// }

// interface String {
//     equalsIgnoreCase(s: string): boolean
//     removeLast(x?: number): string
//     // ToDefaultDate(): Date;
// }

// // String.isNullOrEmpty = s => s == null || s == ""
// // String.isNotNullOrEmpty = s => s != null && s != ""
// String.prototype.equalsIgnoreCase = function(this: string, s: string): boolean {
//     let x: string = this
//     let xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0
//     console.log("EIC", this, s, xx)
//     return xx
// }
// String.prototype.removeLast = function(this: string, x?: number): string {
//     let s: string = this
//     if (x == null) x = 1
//     return s.substr(0, s.length - x)
// }
// const ToFriendlySize
declare global {
    // interface Function {
    //     ToComparer<T, V>(desc?: boolean): (x: T, y: T) => number
    // }

    // interface Date {
    //     // ToFriendlyRelative2(): string;
    // }

    interface Number {
        ToFriendlySize(): string
        toFriendlyNumber(): string
    }
}
Number.prototype.ToFriendlySize = function (this: number): string {
    const bytes = this
    const kb = bytes / 1024.0
    const mb = kb / 1024.0
    const gb = mb / 1024.0
    const tb = gb / 1024.0
    if (kb < 1) return bytes.toFriendlyNumber()
    if (mb < 1) return kb.toFriendlyNumber() + " kb"
    if (mb < 1) return kb.toFriendlyNumber() + " kb"
    if (gb < 1) return mb.toFriendlyNumber() + " mb"
    if (tb < 1) return gb.toFriendlyNumber() + " gb"
    return tb.toFriendlyNumber() + " tb"
}

Number.prototype.toFriendlyNumber = function (this: number): string {
    const x: number = this
    let s: string
    if (x == 0) return "0"
    if (x > 0 && x < 10) s = x.toFixed(2)
    else if (x >= 10 && x < 100) s = x.toFixed(1)
    else s = x.toFixed(0)
    //while (s.endsWith("0"))
    //    s = s.removeLast(1);
    if (s.endsWith(".0")) s = s[removeLast](2)
    if (s.endsWith(".00")) s = s[removeLast](3)
    return s
}

interface LessStatic {
    modifyVars(obj: any): void
}

//interface AsyncIterableIterator<T> extends AsyncIterator<T> {
//    toA

//}
