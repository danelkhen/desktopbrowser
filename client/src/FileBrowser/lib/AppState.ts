import { FileInfo, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { FileColumnsConfig } from "./FileColumnsConfig"
import { FileSortConfig } from "./Helper"

export interface AppState {
    res: ListFilesResponse
    req: ListFilesRequest
    sortingDefaults: FileSortConfig
    reqSorting: Pick<FileSortConfig, "active" | "isDescending">
    sorting: FileSortConfig
    filesMd: { [key: string]: FileInfo }
    columns: FileColumnsConfig
}
