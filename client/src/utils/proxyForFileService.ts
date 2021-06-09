import { FileService } from "../../../shared/src/contracts"
import { getHttpInvoker } from "./ServiceBase"
import { getWebSocketInvoker } from "./webSocket"

export function proxyForFileService() {
    const http = getHttpInvoker<FileService>("/api/fs")
    const ws = getWebSocketInvoker<FileService>("fileService")

    const proxy: FileService = {
        ListFiles: req => ws("ListFiles", [req]),

        saveFileMetadata: req => http("saveFileMetadata", [req]),
        getFileMetadata: req => http("getFileMetadata", [req]),
        deleteFileMetadata: req => http("deleteFileMetadata", [req]),
        getAllFilesMetadata: () => http("getAllFilesMetadata", []),
        GetFiles: req => http("GetFiles", [req]),
        GetFileRelatives: path => http("GetFileRelatives", [path]),
        GetFile: req => http("GetFile", [req]),
        Execute: req => http("Execute", [req]),
        Explore: req => http("Explore", [req]),
        Delete: req => http("Delete", [req]),
        trash: req => http("trash", [req]),
    }

    return proxy
}