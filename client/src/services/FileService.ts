import { ColumnKey } from "../components/Grid"
import { stringRemoveLast } from "../lib/stringRemoveLast"

export interface FileService {
    saveFileMetadata(md: FileInfo): Promise<void>
    deleteFileMetadata(req: { key: string }): Promise<void>
    getAllFilesMetadata(): Promise<FileInfo[]>
    getFileMetadata(req: { key: string }): Promise<FileInfo>
    listFiles(req: ListFilesRequest): Promise<ListFilesResponse>
    execute(req: PathRequest): void
    explore(req: PathRequest): void
    del(req: PathRequest): Promise<void>
    trash(req: PathRequest): Promise<void>

    appInspect(): Promise<void>
    checkForUpdates(): Promise<{ isLatest: boolean; latest: string; current: string }>
    appOpen(): Promise<void>
    appExit(): Promise<void>
    appGetVersion(): Promise<string>
    appHide(): Promise<void>
}

export interface FileInfo {
    readonly key: string
    readonly collection: string
    readonly selectedFiles?: string[]
    readonly tmdbKey?: string
    readonly episodeKey?: string
    readonly watched?: boolean
    readonly lastKnownPath?: string
    readonly scanned?: string
}

export interface ListFilesRequest {
    readonly sort?: SortColumn[]
    readonly foldersFirst?: boolean
    readonly ByInnerSelection?: boolean
    readonly SearchPattern?: string
    readonly IsRecursive?: boolean
    readonly FolderSize?: boolean
    readonly HideFolders?: boolean
    readonly HideFiles?: boolean
    readonly Path?: string
    readonly Sort?: SortRequest
    readonly ShowHiddenFiles?: boolean
    readonly NoCache?: boolean
    readonly View?: string
    readonly hideWatched?: boolean
    // TODO:
    readonly KeepView?: boolean
    readonly skip?: number
    readonly take?: number
}

export interface ListFilesResponse {
    readonly File?: FsFile
    readonly Files?: FsFile[]
    readonly Relatives: FileRelativesInfo
}

export interface FsFile {
    IsFolder: boolean
    Name: string
    Path?: string
    Modified?: string
    IsHidden?: boolean
    Size?: number
    Extension?: string
    type?: "file" | "folder" | "link" | string
}

export interface FileRelativesInfo {
    ParentFolder?: FsFile
    NextSibling?: FsFile
    PreviousSibling?: FsFile
}

export interface PathRequest {
    Path: string
}

export interface SortRequest {
    Columns: SortColumn[]
}

export type Column = "Name" | "Modified" | "Extension" | "Size" | "type" | "hasInnerSelection"
export interface SortColumn {
    readonly Name: ColumnKey
    readonly Descending?: boolean
}

export function sortToUrl(cols: SortColumn[]): string {
    return cols.map(t => (t.Descending ? `${t.Name}_` : t.Name)).join(",")
}
export function urlToSort(sort: string | undefined): SortColumn[] {
    return (
        sort
            ?.split(",")
            .map(t =>
                t.endsWith("_")
                    ? ({ Name: stringRemoveLast(t, 1) as Column, Descending: true } as SortColumn)
                    : ({ Name: t as Column } as SortColumn)
            ) ?? []
    )
}
