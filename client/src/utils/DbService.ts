import * as C from "../../../shared/src/contracts"
import { getWebSocketInvoker } from "../utils/webSocket"
import { Invoker } from "./Proxy"
import { getHttpInvoker } from "./ServiceBase"

export interface Proxies {
    fileService: {
        http: C.FileService
        ws: C.FileService
    }
    byFilename: C.DbService<C.ByFilename>
    keyValue: C.KeyValueService
    fsEntryService: C.DbService<C.FsEntry>
    appService: C.App
}
export function getProxies(): Proxies {
    return {
        fileService: proxyForFileService(),
        byFilename: proxyForByFilenameService(),
        keyValue: proxyForKeyValueService(),
        fsEntryService: proxyForFsEntryService(),
        appService: proxyForAppService(),
    }
}
export function proxyForDbService<T>(url: string) {
    return httpProxyFor<C.DbService<T>>(url, http => ({
        findOneById: req => http("findOneById", [req]) as Promise<any>,
        persist: obj => http("persist", [obj]) as Promise<any>,
        find: req => http("find", [req]) as Promise<any>,
        removeById: req => http("removeById", [req]),
    }))
}
export function proxyForByFilenameService() {
    return proxyForDbService<C.ByFilename>("/api/byFilename")
}
export function proxyForKeyValueService() {
    return httpProxyFor<C.KeyValueService>("/api/keyValue", http => ({
        findOneById: req => http("findOneById", [req]) as Promise<any>,
        persist: obj => http("persist", [obj]) as Promise<any>,
        findAllWithKeyLike: req => http("findAllWithKeyLike", [req]) as Promise<any>,
    }))
}
function httpProxyFor<T>(url: string, impl: (http: Invoker<T>) => T) {
    const http = getHttpInvoker<T>(url)
    return impl(http)
}
function wsProxyFor<T>(url: string, impl: (ws: Invoker<T>) => T) {
    const ws = getWebSocketInvoker<T>(url)
    return impl(ws)
}

export function proxyForFileService() {
    const impl: (http: Invoker<C.FileService>) => C.FileService = http =>
        ({
            saveFileMetadata: req => http("saveFileMetadata", [req]),
            deleteFileMetadata: req => http("deleteFileMetadata", [req]),
            getAllFilesMetadata: () => http("getAllFilesMetadata", []),
            ListFiles: req => http("ListFiles", [req]),
            // ListFilesWebSocket: req => ws("ListFiles", [req]),
            GetFiles: req => http("GetFiles", [req]),
            GetFileRelatives: path => http("GetFileRelatives", [path]),
            GetFile: req => http("GetFile", [req]),
            Execute: req => http("Execute", [req]),
            Explore: req => http("Explore", [req]),
            Delete: req => http("Delete", [req]),
            trash: req => http("trash", [req]),
            isWindows: () => http("isWindows"),
            // clearCache: () => http("clearCache"),
        } as Partial<C.FileService> as C.FileService) // TODO:

    return {
        http: httpProxyFor<C.FileService>("/api/fs", impl),
        ws: wsProxyFor<C.FileService>("fileService", impl),
    }
}

export function proxyForFsEntryService() {
    return proxyForDbService<C.FsEntry>("/api/fsEntry")
}

export function proxyForAppService() {
    return httpProxyFor<C.App>(
        "/api/app",
        http =>
            ({
                getConfig: () => http("getConfig"),
                saveConfig: config => http("saveConfig", [config]),
                scanForMedia: () => http("scanForMedia"),
                scanStatus: () => http("scanStatus"),
                getMediaFiles: req => http("getMediaFiles", [req]),
            } as Partial<C.App> as C.App) // TODO:
    )
}
