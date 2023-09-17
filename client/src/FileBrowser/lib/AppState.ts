import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { Columns } from "../Columns"
import { ColumnsConfig } from "../Grid/Grid"
import { SortConfig } from "./useSorting"

export interface AppState {
    readonly res: ListFilesResponse
    readonly req: ListFilesRequest
    readonly sortingDefaults: FileSortConfig
    readonly reqSorting: Pick<FileSortConfig, "active" | "isDescending">
    readonly sorting: FileSortConfig
    readonly filesMd: { [key: string]: FileInfo }
    readonly columns: FileColumnsConfig
}

export type FileSortConfig = SortConfig<FsFile, Columns>
export type FileColumnsConfig = ColumnsConfig<FsFile, Columns>
