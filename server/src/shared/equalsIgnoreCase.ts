export function equalsIgnoreCase(_this: string, s: string): boolean {
    const xx = _this.localeCompare(s, [], { sensitivity: "base" }) == 0
    return xx
}
