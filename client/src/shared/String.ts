export function equalsIgnoreCase(_this: string, s: string): boolean {
    const xx = _this.localeCompare(s, [], { sensitivity: "base" }) == 0
    return xx
}
export function removeLast(_this: string, x?: number): string {
    if (x == null) x = 1
    return _this.substring(0, _this.length - x)
}
