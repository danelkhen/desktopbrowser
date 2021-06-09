import * as M from "../../../shared/src/media"
import { httpProxyFor } from "../utils/httpProxyFor"

export function proxyForDbService<T>(url: string) {
    return httpProxyFor<M.DbService<T>>(url, http => ({
        findOneById: req => http("findOneById", [req]) as Promise<any>,
        persist: obj => http("persist", [obj]) as Promise<any>,
        find: req => http("find", [req]) as Promise<any>,
        removeById: req => http("removeById", [req]),
    }))
}
export function proxyForKeyValueService() {
    return httpProxyFor<M.KeyValueService>("/api/keyValue", http => ({
        findOneById: req => http("findOneById", [req]) as Promise<any>,
        persist: obj => http("persist", [obj]) as Promise<any>,
        findAllWithKeyLike: req => http("findAllWithKeyLike", [req]) as Promise<any>,
    }))
}

export function proxyForAppService() {
    return httpProxyFor<M.MediaApp>(
        "/api/app",
        http =>
            ({
                getConfig: () => http("getConfig"),
                saveConfig: config => http("saveConfig", [config]),
                scanForMedia: () => http("scanForMedia"),
                scanStatus: () => http("scanStatus"),
                getMediaFiles: req => http("getMediaFiles", [req]),
            } as M.MediaApp)
    )
}
