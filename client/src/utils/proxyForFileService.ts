import * as C from "../../../shared/src/contracts"
import { getHttpInvoker } from "./ServiceBase"
import { getWebSocketInvoker } from "./webSocket"

export function proxyForFileService() {
    const http2 = getHttpInvoker<C.FileService>("/api/fs")
    const http: C.FileService = {
        saveFileMetadata: req => http2("saveFileMetadata", [req]),
        getFileMetadata: req => http2("getFileMetadata", [req]),
        deleteFileMetadata: req => http2("deleteFileMetadata", [req]),
        getAllFilesMetadata: () => http2("getAllFilesMetadata", []),
        ListFiles: req => http2("ListFiles", [req]),
        GetFiles: req => http2("GetFiles", [req]),
        GetFileRelatives: path => http2("GetFileRelatives", [path]),
        GetFile: req => http2("GetFile", [req]),
        Execute: req => http2("Execute", [req]),
        Explore: req => http2("Explore", [req]),
        Delete: req => http2("Delete", [req]),
        trash: req => http2("trash", [req]),
    }

    const ws2 = getWebSocketInvoker<C.FileService>("fileService")
    const ws: Pick<C.FileService, "ListFiles"> = {
        ListFiles: req => ws2("ListFiles", [req]),
    }

    return {
        http,
        ws,
    }
}
