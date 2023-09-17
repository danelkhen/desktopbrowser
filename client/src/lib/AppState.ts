import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "./FileService"
import { Columns } from "./Columns"
import { Columns2, ColumnsConfig } from "../components/Grid"
import { dispatcher } from "./Dispatcher"
import { sortingDefaults } from "./sortingDefaults"
import { SortConfig } from "../hooks/useSorting"

export interface AppState {
    readonly res: ListFilesResponse
    readonly req: ListFilesRequest
    readonly sortingDefaults: FileSortConfig
    readonly reqSorting: Pick<FileSortConfig, "active" | "isDescending">
    readonly sorting: FileSortConfig
    readonly filesMd: { [key: string]: FileInfo }
    // readonly columns: FileColumnsConfig
}

export type FileSortConfig = SortConfig<FsFile, Columns>
export type FileColumnsConfig = ColumnsConfig<FsFile, Columns>
export type FileColumns2 = Columns2<FsFile>

const reqSorting: AppState["reqSorting"] = { active: [], isDescending: {} }
export const initialAppState: AppState = {
    res: { Relatives: {} },
    req: {},
    sortingDefaults,
    reqSorting,
    sorting: { ...sortingDefaults, ...reqSorting },
    filesMd: {},
}

export const gridColumns: FileColumnsConfig = {
    keys: Columns,
    getters: {
        type: t => t.type,
        Name: t => t.Name,
        Size: t => t.Size,
        Modified: t => t.Modified,
        Extension: t => t.Extension,
        hasInnerSelection: t => !!t?.IsFolder && !!dispatcher.getSavedSelectedFile(t.Name),
    },
    visibleColumns: [Columns.type, Columns.Name, Columns.Modified, Columns.Size, Columns.Extension],
}

export const gridColumns2: FileColumns2 = {
    type: { getter: t => t.type },
    Name: { getter: t => t.Name },
    Size: { getter: t => t.Size },
    Modified: { getter: t => t.Modified },
    Extension: { getter: t => t.Extension },
    hasInnerSelection: { getter: t => !!t?.IsFolder && !!dispatcher.getSavedSelectedFile(t.Name) },
}
