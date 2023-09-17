import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { Columns } from "../Columns"
import { ColumnsConfig } from "../Grid/Grid"
import { helper } from "./Helper"
import { sortingDefaults } from "./sortingDefaults"
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

const reqSorting: AppState["reqSorting"] = { active: [], isDescending: {} }
export const initialAppState: AppState = {
    res: { Relatives: {} },
    req: {},
    sortingDefaults,
    reqSorting,
    sorting: { ...sortingDefaults, ...reqSorting },
    filesMd: {},
    columns: {
        keys: Columns,
        getters: {
            type: t => t.type,
            Name: t => t.Name,
            Size: t => t.Size,
            Modified: t => t.Modified,
            Extension: t => t.Extension,
            hasInnerSelection: t => !!t?.IsFolder && !!helper.getSavedSelectedFile(t.Name),
        },
        visibleColumns: [Columns.type, Columns.Name, Columns.Modified, Columns.Size, Columns.Extension],
    },
}
