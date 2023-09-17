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
}

export type FileColumns = Columns<FsFile>

const sortingDefaults: SortConfig = {
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
