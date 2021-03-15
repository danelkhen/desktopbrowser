declare module "contracts" {
    import { FindManyOptions, FindOneOptions } from "typeorm"
    import { TmdbApiV3 as tmdb } from "tmdb"
    export { FindManyOptions, FindOneOptions }

    export interface Config {
        folders?: ConfigFolder[]
    }
    export interface ConfigFolder {
        path: string
    }
    export interface KeyValueService {
        findOneById<T>(req: { id: any; options?: FindManyOptions<KeyValue<T>> }): Promise<KeyValue<T>>
        findAllWithKeyLike<T>(req: { like: string }): Promise<KeyValue<T>[]>
        persist<T>(obj: KeyValue<T>): Promise<KeyValue<T>>
    }

    export interface HasKey {
        key: string
    }

    export interface KeyValue<T> {
        key: string
        value: T
    }

    export interface ByFilename {
        key: string
        selectedFiles?: string[]
        tmdbKey?: string
        episodeKey?: string
        watched?: boolean
        lastKnownPath?: string
        scanned?: string
    }

    export interface DbService<T> {
        findOneById(req: { id: any; options?: FindManyOptions<T> }): Promise<T | undefined>
        find(req: FindManyOptions<T>): Promise<T[]>
        persist(x: T): Promise<T>
        removeById(req: { id: any }): Promise<T>
    }
    export interface FsEntry {
        key: string
        basename: string
        dirname: string
        extname: string
        type: string
        atime: string
        mtime: string
        ctime: string
    }

    export interface FsEntryService extends DbService<FsEntry> {}

    export interface FileService {
        //init();
        //migrateToSqlite();
        ListFiles(req: ListFilesRequest): Promise<ListFilesResponse>
        GetFiles(req: ListFilesRequest): Promise<File[]>
        GetFileRelatives(path: string): Promise<FileRelativesInfo>
        GetFile(req: PathRequest): Promise<File>
        Execute(req: PathRequest): void
        Explore(req: PathRequest): void
        Delete(req: PathRequest): Promise<void>
        trash(req: PathRequest): Promise<void>
        ApplyRequest(files: IEnumerable<File>, req: ListFilesRequest): Promise<IEnumerable<File>>
        isWindows(): Promise<boolean>
        // GetHomeFiles(): File[]
        CalculateFoldersSize(folders: File[]): Promise<IEnumerable<File>>
        CalculateFolderSize(path: string): Promise<number>
        CalculateFolderSizeNoCache(path: string): Promise<number>
        clearCache(): Promise<void>
    }

    export interface FileService2 {
        ListFiles(req: ListFilesRequest): Promise<ListFilesResponse>
        GetFiles(req: ListFilesRequest): AsyncIterableIterator<File>
        GetFileRelatives(path: string): Promise<FileRelativesInfo>
        GetFile(req: PathRequest): Promise<File>
        Execute(req: PathRequest): void
        Explore(req: PathRequest): void
        Delete(req: PathRequest): Promise<void>
        trash(req: PathRequest): Promise<void>
        isWindows(): boolean
        GetHomeFiles(): File[]
        CalculateFoldersSize(folders: File[]): Promise<IEnumerable<File>>
        CalculateFolderSize(path: string): Promise<number>
        CalculateFolderSizeNoCache(path: string): Promise<number>
        clearCache(): void
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

    export interface IEnumerable<T> extends Array<T> {
        OrderByDescending?(sel: any): IOrderedEnumerable<T>
        OrderBy?(sel: any): IOrderedEnumerable<T>
    }

    export interface IOrderedEnumerable<T> extends IEnumerable<T> {
        ThenByDescending?(sel: any): IOrderedEnumerable<T>
        ThenBy?(sel: any): IOrderedEnumerable<T>
    }

    export interface SortRequest {
        Columns: SortColumn[]
    }

    export interface SortColumn {
        Name: string
        Descending?: boolean
    }

    export interface ListFilesResponse {
        File?: File
        Files?: File[]
        Relatives: FileRelativesInfo
    }

    export interface FilenameParsedInfo {
        name: string
        season: number
        episode: number
        year: number
        date: string
        tags: string[]
        filename: string
    }

    export interface App {
        getConfig(): Promise<Config>
        saveConfig(config: Config): Promise<void>
        scanForMedia(): Promise<MediaScannerStatus>
        scanStatus(): Promise<MediaScannerStatus>
        getMediaFiles(req?: GetMediaFilesRequest): Promise<MediaFile[]>
        fileService: FileService
        // fileService2: FileService2
        keyValueService: KeyValueService
        fsEntryService: FsEntryService
    }
    export interface GetMediaFilesRequest {
        firstResult?: number
        maxResults?: number
        //find?: FindRequest;
        notScannedOnly?: boolean
    }

    export interface MediaScannerStatus {
        stack: number
        scanned: number
        saved: number
        lastScanned: string
        lastSaved: string
        started: Date
        finished: Date
        dir: { path: string; mtime: string }
    }

    export interface MediaFile {
        md: ByFilename
        file?: File
        tmdb?: tmdb.MediaDetails | null
        tmdbBasic?: tmdb.TmdbMedia
        type: string
        parsed: FilenameParsedInfo | null
        fsEntry: FsEntry
    }
}
