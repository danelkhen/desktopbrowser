export function pathToUrl(p: string | undefined) {
    if (!p) return ""
    let s = p.replace(/\\/g, "/").replace(":", "")
    if (s[0] === "/") {
        s = s.substring(1)
    }
    return s
}
