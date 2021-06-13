export const equalsIgnoreCase = Symbol("equalsIgnoreCase")
export const removeLast = Symbol("removeLast")

declare global {
    interface String {
        [equalsIgnoreCase](s: string): boolean
        [removeLast](x?: number): string
    }
}
String.prototype[equalsIgnoreCase] = function (this: string, s: string): boolean {
    const x: string = this
    const xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0
    return xx
}
String.prototype[removeLast] = function (this: string, x?: number): string {
    const s: string = this
    if (x == null) x = 1
    return s.substr(0, s.length - x)
}
