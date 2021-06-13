import * as C from "../../../shared/src/contracts"
import { toDefaultDate, toFriendlyRelative2, removeLast } from "../../../shared/src"
import { toFriendlySize } from "../utils/global"

export function TryParse(s: string): number | null {
    const x = parseInt(s)
    if (isNaN(x)) return null
    return x
}

export function FormatFriendlyDate(value: string | null): string {
    if (!value) return ""
    return toFriendlyRelative2(toDefaultDate(value))
}

export function FormatFriendlySize(value: number | null | undefined): string {
    if (!value) return ""
    return toFriendlySize(value)
}

export function getFileNameWithoutExtension(file: C.File): string {
    if (file.IsFolder) return file.Name
    let s = file.Name
    const index = s.lastIndexOf(".")
    if (index < 0) return s
    s = s.substr(0, index)
    return s
}

export function Path_WinToLinux(path: string): string {
    if (!path) return path
    const isNetworkShare = path.startsWith("\\\\")
    if (isNetworkShare)
        //network share
        path = "net/" + path.substr(2)
    const tokens = path.split("\\") //.where(t=>t.length>0);
    if (!isNetworkShare) tokens[0] = tokens[0].replace(/\:/g, "")
    //tokens[0] = tokens[0].replaceAll(":", "");
    //tokens = tokens;
    path = tokens.join("/")
    //path = path.replaceAll(":\\", "/").replaceAll("\\", "/");
    //path = "/" + path;
    path = encodeURI(path)
    path = "/" + path
    //if (!path.startsWith("/"))
    //    path = "/" + path;
    if (!path.endsWith("/")) path += "/"
    return path
}

export function GetFilenameForSearch(s: string): string {
    const tokens = s.split(/[ .-]/).map(t => t.toLowerCase())
    const ignoreWords = new Set(["xvid", "720p", "1080p", "dimension", "sample", "nfo", "par2"])
    const list: string[] = []
    for (const token of tokens) {
        if (ignoreWords.has(token)) break
        if (token.length == 3) {
            const season = TryParse(token.substr(0, 1))
            const episode = TryParse(token.substr(1))
            if (season != null && episode != null && episode < 30) {
                const normalized = "S" + season.toString().padStart(2, "0") + "E" + episode.toString().padStart(2, "0")
                list.push(normalized)
                break
            }
        }
        list.push(token)
    }
    const s2 = list.join(" ")
    return s2
}

export function GetSubtitleSearchLink(file: C.File): string {
    const s = GetFilenameForSearch(file.Name)
    return "https://www.google.com/search?q=" + encodeURIComponent(s + " eng subscene")
}

export function GetGoogleSearchLink(file: C.File): string {
    const s = GetFilenameForSearch(file.Name)
    return "https://www.google.com/search?q=" + encodeURIComponent(s)
}

export function Path_LinuxToWin(path: string): string {
    if (!path) return path
    if (path == "/") {
        path = ""
    } else if (path.startsWith("/net/")) {
        const tokens = path.split("/")
        path = "\\\\" + tokens.slice(2).join("\\")
    } else {
        path = path.substr(1) //skip first / to get real drive name
        const tokens = path.split("/")
        tokens[0] += ":"
        path = tokens.join("\\")
    }
    if (path.endsWith("\\")) {
        path = path[removeLast](1)
    }
    return path
}
