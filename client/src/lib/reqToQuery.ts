/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListFilesRequest, sortToUrl } from "../services/FileService"

export function reqToQuery(rest: ListFilesRequest) {
    const rest2 = rest as any
    if (rest.sort) {
        rest2.sort = sortToUrl(rest.sort)
    }
    const obj = {} as any
    for (const key of Object.keys(rest2)) {
        if (!rest2[key]) {
            continue
        }
        if (typeof rest2[key] == "boolean") {
            obj[key] = ""
            continue
        }
        obj[key] = rest2[key] ?? ""
    }
    const q = new URLSearchParams(obj)
    return sanitizeQuery(q.toString())
}

function sanitizeQuery(s: string): string {
    return s.replace(/=&/g, "&").replace(/=$/g, "").replace(/%2C/g, ",")
}
