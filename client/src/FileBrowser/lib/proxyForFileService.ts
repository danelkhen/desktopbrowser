import { FileService } from "../../../../shared/src/FileService"
import { getHttpInvoker } from "../../utils/getHttpInvoker"
import { getWebSocketInvoker } from "../../utils/webSocket"

export function proxyForFileService() {
    const http = getHttpInvoker<FileService>("/api/fs")
    const ws = getWebSocketInvoker<FileService>("fileService")

    const proxy: FileService = {
        listFiles: req => ws("listFiles", req),
        saveFileMetadata: req => http("saveFileMetadata", req),
        getFileMetadata: req => http("getFileMetadata", req),
        deleteFileMetadata: req => http("deleteFileMetadata", req),
        getAllFilesMetadata: () => http("getAllFilesMetadata"),
        execute: req => http("execute", req),
        explore: req => http("explore", req),
        del: req => http("del", req),
        trash: req => http("trash", req),
        appInspect: () => http("appInspect"),
        appOpen: () => http("appOpen"),
        appExit: () => http("appExit"),
        checkForUpdates: () => http("checkForUpdates"),
        appGetVersion: () => http("appGetVersion"),
        appHide: () => http("appHide"),
    }

    return proxy
}
