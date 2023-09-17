import { FileInfo, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { FileColumnsConfig } from "./FileColumnsConfig"
import { FileSortConfig } from "./Helper"

export interface AppState {
    readonly res: ListFilesResponse
    readonly req: ListFilesRequest
    readonly sortingDefaults: FileSortConfig
    readonly reqSorting: Pick<FileSortConfig, "active" | "isDescending">
    readonly sorting: FileSortConfig
    readonly filesMd: { [key: string]: FileInfo }
    readonly columns: FileColumnsConfig
}
