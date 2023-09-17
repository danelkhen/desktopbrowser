import { removeLast, toDefaultDate, toFriendlyRelative2 } from "../../../../shared/src"
import { FsFile } from "../../../../shared/src/FileService"
import { toFriendlySize } from "../../utils/toFriendlySize"

export function tryParseInt(s: string): number | null {
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

export function getFileNameWithoutExtension(file: FsFile): string {
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
    if (!isNetworkShare) tokens[0] = tokens[0].replace(/:/g, "")
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
    const s2 = s
        .replace(/[ .-]/g, " ")
        .replace(/([0-9][0-9][0-9][0-9]).*$/, "$1")
        .replace(/(S[0-9][0-9]E[0-9][0-9]).*$/i, "$1")
    return s2
}

export function GetSubtitleSearchLink(file: FsFile): string {
    const s = GetFilenameForSearch(file.Name)
    return "https://www.google.com/search?q=" + encodeURIComponent(s + " eng subscene")
}

export function GetGoogleSearchLink(file: FsFile): string {
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
