export function arrayItemsEqual<T>(x: T[], y: T[]): boolean {
    if (y === x) return true
    if (y.length !== x.length) return false
    for (let i = 0; i < x.length; i++)
        if (!Object.is(x[i], y[i])) {
            return false
        }
    return true
}
