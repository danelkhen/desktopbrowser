export function getFilenameForSearch(s: string): string {
    const s2 = s
        .replace(/[ .-]/g, " ")
        .replace(/([0-9][0-9][0-9][0-9]).*$/, "$1")
        .replace(/(S[0-9][0-9]E[0-9][0-9]).*$/i, "$1")
    return s2
}
