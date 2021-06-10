import { FindManyOptions, FindOneOptions } from "typeorm"
export { FindManyOptions, FindOneOptions }

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

export interface FileService {
    saveFileMetadata(md: FileInfo): Promise<void>
    deleteFileMetadata(req: { key: string }): Promise<void>
    getAllFilesMetadata(): Promise<FileInfo[]>
    getFileMetadata(req: { key: string }): Promise<FileInfo>
    ListFiles(req: ListFilesRequest): Promise<ListFilesResponse>
    Execute(req: PathRequest): void
    Explore(req: PathRequest): void
    Delete(req: PathRequest): Promise<void>
    trash(req: PathRequest): Promise<void>
}

export interface ListFilesRequest {
    sortBy?: string
    sortByDesc?: boolean
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
    // TODO:
    KeepView?: boolean
    /** Number of columns in ImageListView mode */
    //ImageListColumns?: number;
    /** Number of rows in ImageListView mode */
    //ImageListRows?: number;
    /** How many items to skip, null means no skipping */
    skip?: number
    /** How many items to take after skipping, null means all of them */
    take?: number
}

export interface ListFilesResponse {
    File?: File
    Files?: File[]
    Relatives: FileRelativesInfo
}

export interface File {
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
    ParentFolder?: File
    NextSibling?: File
    PreviousSibling?: File
}

export interface PathRequest {
    Path: string
}

export interface SortRequest {
    Columns: SortColumn[]
}

export interface SortColumn {
    Name: "Name" | "Modified" | "Extension" | "Size"
    Descending?: boolean
}

export interface ListFilesResponse {
    File?: File
    Files?: File[]
    Relatives: FileRelativesInfo
}
