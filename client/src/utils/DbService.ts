import * as C from "../../../shared/src/contracts"
import { httpProxyFor } from "./httpProxyFor"
import { Invoker } from "./Proxy"
import { wsProxyFor } from "./wsProxyFor"

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
