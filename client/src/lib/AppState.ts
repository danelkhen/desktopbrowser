import { Columns } from "../components/Grid"
import { SortConfig } from "../hooks/useSorting"
import { FileColumnKeys } from "./Columns"
import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "./FileService"

export interface AppState {
    readonly res: ListFilesResponse
    readonly req: ListFilesRequest
    readonly sortingDefaults: SortConfig
    readonly reqSorting: Pick<SortConfig, "active" | "isDescending">
    readonly sorting: SortConfig
    readonly filesMd: { [key: string]: FileInfo }
    // readonly columns: FileColumnsConfig
}

// export type FileColumnsConfig = ColumnsConfig<FsFile, Columns>
export type FileColumns = Columns<FsFile>

const sortingDefaults: SortConfig = {
    descendingFirst: {
        Size: true,
        Modified: true,
        hasInnerSelection: true,
    },
    // sortGetters: {
    //     type: x => (x.type && dispatcher.getFileTypeOrder(x.type)) ?? 0,
    // },
    isDescending: {},
    active: [FileColumnKeys.type],
}

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
