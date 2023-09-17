import { removeLast } from "../../../../shared/src"

export function path_LinuxToWin(path: string): string {
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
