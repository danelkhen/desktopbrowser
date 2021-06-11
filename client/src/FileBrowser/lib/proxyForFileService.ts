import { FileService } from "../../../../shared/src/contracts"
import { getHttpInvoker } from "../../utils/getHttpInvoker"
import { getWebSocketInvoker } from "../../utils/webSocket"

export function proxyForFileService() {
    const http = getHttpInvoker<FileService>("/api/fs")
    const ws = getWebSocketInvoker<FileService>("fileService")

    const proxy: FileService = {
        listFiles: req => ws("listFiles", [req]),
        saveFileMetadata: req => http("saveFileMetadata", [req]),
        getFileMetadata: req => http("getFileMetadata", [req]),
        deleteFileMetadata: req => http("deleteFileMetadata", [req]),
        getAllFilesMetadata: () => http("getAllFilesMetadata", []),
        execute: req => http("execute", [req]),
        explore: req => http("explore", [req]),
        del: req => http("del", [req]),
        trash: req => http("trash", [req]),
    }

    return proxy
}
