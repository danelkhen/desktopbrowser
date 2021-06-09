import * as C from "../../../shared/src/contracts"
import * as M from "../../../shared/src/media"
import { getWebSocketInvoker } from "../utils/webSocket"
import { Invoker } from "./Proxy"
import { getHttpInvoker } from "./ServiceBase"

export interface Proxies {
    fileService: {
        http: C.FileService
        ws: C.FileService
    }
    appService: M.MediaApp
}
export function getProxies(): Proxies {
    return {
        fileService: proxyForFileService(),
        appService: proxyForAppService(),
    }
}
export function proxyForDbService<T>(url: string) {
    return httpProxyFor<M.DbService<T>>(url, http => ({
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
    return httpProxyFor<M.KeyValueService>("/api/keyValue", http => ({
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
            getFileMetadata: req => http("getFileMetadata", [req]),
            deleteFileMetadata: req => http("deleteFileMetadata", [req]),
            getAllFilesMetadata: () => http("getAllFilesMetadata", []),
            ListFiles: req => http("ListFiles", [req]),
            GetFiles: req => http("GetFiles", [req]),
            GetFileRelatives: path => http("GetFileRelatives", [path]),
            GetFile: req => http("GetFile", [req]),
            Execute: req => http("Execute", [req]),
            Explore: req => http("Explore", [req]),
            Delete: req => http("Delete", [req]),
            trash: req => http("trash", [req]),
        } as C.FileService)

    return {
        http: httpProxyFor<C.FileService>("/api/fs", impl),
        ws: wsProxyFor<C.FileService>("fileService", impl),
    }
}

export function proxyForFsEntryService() {
    return proxyForDbService<M.FsEntry>("/api/fsEntry")
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
