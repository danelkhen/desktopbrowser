import { Columns } from "../components/Grid"
import { SortConfig } from "../hooks/useSorting"
import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "./FileService"
import { sortingDefaults } from "./sortingDefaults"

export interface AppState {
    readonly res: ListFilesResponse
    readonly req: ListFilesRequest
    readonly sortingDefaults: FileSortConfig
    readonly reqSorting: Pick<FileSortConfig, "active" | "isDescending">
    readonly sorting: FileSortConfig
    readonly filesMd: { [key: string]: FileInfo }
    // readonly columns: FileColumnsConfig
}

export type FileSortConfig = SortConfig<FsFile>
// export type FileColumnsConfig = ColumnsConfig<FsFile, Columns>
export type FileColumns = Columns<FsFile>

const reqSorting: AppState["reqSorting"] = { active: [], isDescending: {} }
export const initialAppState: AppState = {
    res: { Relatives: {} },
    req: {},
    sortingDefaults,
    reqSorting,
    sorting: { ...sortingDefaults, ...reqSorting },
    filesMd: {},
}

// export const gridColumns: FileColumnsConfig = {
//     keys: Columns,
//     getters: {
//         type: t => t.type,
//         Name: t => t.Name,
//         Size: t => t.Size,
//         Modified: t => t.Modified,
//         Extension: t => t.Extension,
//         hasInnerSelection: t => !!t?.IsFolder && !!dispatcher.getSavedSelectedFile(t.Name),
//     },
//     visibleColumns: [Columns.type, Columns.Name, Columns.Modified, Columns.Size, Columns.Extension],
// }
