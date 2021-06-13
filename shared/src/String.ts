export const equalsIgnoreCase = Symbol("equalsIgnoreCase")
export const removeLast = Symbol("removeLast")

declare global {
    interface String {
        [equalsIgnoreCase](s: string): boolean
        [removeLast](x?: number): string
    }
}
String.prototype[equalsIgnoreCase] = function (this: string, s: string): boolean {
    const xx = this.localeCompare(s, [], { sensitivity: "base" }) == 0
    return xx
}
String.prototype[removeLast] = function (this: string, x?: number): string {
    if (x == null) x = 1
    return this.substr(0, this.length - x)
}
