import { ListFilesRequest, urlToSort } from "./FileService"

export function queryToReq(s: string): ListFilesRequest {
    const x = Object.fromEntries(new URLSearchParams(s).entries()) as any
    for (const key of Object.keys(x)) {
        if (x[key] === "") {
            x[key] = true
        }
    }
    const z = { ...x, sort: urlToSort(x.sort) } as ListFilesRequest
    return z
}
