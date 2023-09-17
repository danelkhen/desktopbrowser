export function tryParseInt(s: string): number | null {
    const x = parseInt(s)
    if (isNaN(x)) return null
    return x
}
