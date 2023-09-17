export function stringRemoveLast(_this: string, x?: number): string {
    if (x == null) x = 1
    return _this.substring(0, _this.length - x)
}
