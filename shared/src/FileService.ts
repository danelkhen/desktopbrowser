import { removeLast } from "./String"

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
    key: string
    collection: string
    selectedFiles?: string[]
    tmdbKey?: string
    episodeKey?: string
    watched?: boolean
    lastKnownPath?: string
    scanned?: string
}

export interface ListFilesRequest {
    sort?: SortColumn[]
    foldersFirst?: boolean
    ByInnerSelection?: boolean
    SearchPattern?: string
    IsRecursive?: boolean
    FolderSize?: boolean
    HideFolders?: boolean
    HideFiles?: boolean
    Path?: string
    Sort?: SortRequest
    ShowHiddenFiles?: boolean
    NoCache?: boolean
    View?: string
    hideWatched?: boolean
    // TODO:
    KeepView?: boolean
    skip?: number
    take?: number
}

export interface ListFilesResponse {
    File?: FsFile
    Files?: FsFile[]
    Relatives: FileRelativesInfo
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
    Name: Column
    Descending?: boolean
}

export interface ListFilesResponse {
    File?: FsFile
    Files?: FsFile[]
    Relatives: FileRelativesInfo
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
                    ? ({ Name: t[removeLast](1) as Column, Descending: true } as SortColumn)
                    : ({ Name: t as Column } as SortColumn)
            ) ?? []
    )
}
