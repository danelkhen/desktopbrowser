declare module "contracts" {
    export interface Config {
        key: string;
        folders?: ConfigFolder[];
    }
    export interface ConfigFolder {
        path: string;
    }
    export interface KeyValueService {
        findOneById<T extends HasKey>(req: { id: any, options?: FindOptions }): Promise<T | undefined>;
        findAllWithKeyLike<T extends HasKey>(req: { like: string }): Promise<T[]>;
        persist<T extends HasKey>(obj: T): Promise<T>;
    }

    export interface HasKey {
        key: string;
    }

    export interface KeyValue {
        key: string;
        value: any;
    }

    export interface ByFilename {
        key: string;
        selectedFiles?: string[];
        tmdbKey?: string;
        episodeKey?: string;
        watched?: boolean;
        lastKnownPath?: string;
        modified?: string;
    }

    export interface DbService<T> {
        findOneById(req: { id: any, options?: FindOptions }): Promise<T | undefined>;
        find(req: FindRequest): Promise<T[]>;
        persist(x: T): Promise<T>;
        removeById(req: { id: any }): Promise<T>;
    }
    export interface FsEntry {
        key: string;
        basename: string;
        dirname: string;
        extname: string;
        type: string;
        atime: string;
        mtime: string;
        ctime: string;
    }

    export interface FsEntryService extends DbService<FsEntry> {
    }

    export interface FindRequest {
        conditions?: ObjectLiteral;
        options?: FindOptions;
    }

    export interface FileService {
        //init();
        //migrateToSqlite();
        ListFiles(req: ListFilesRequest): ListFilesResponse;
        GetFiles(req: ListFilesRequest): File[];
        GetFileRelatives(path: string): FileRelativesInfo;
        GetFile(req: PathRequest): File;
        Execute(req: PathRequest): void;
        Explore(req: PathRequest): void;
        Delete(req: PathRequest): Promise<any>;
        trash(req: PathRequest): Promise<any>;
        ApplyRequest(files: IEnumerable<File>, req: ListFilesRequest): IEnumerable<File>;
        isWindows();
        GetHomeFiles(): File[];
        CalculateFoldersSize(folders: File[]): IEnumerable<File>;
        CalculateFolderSize(path: string): number;
        CalculateFolderSizeNoCache(path: string): number;
        clearCache();
        //omdbGet(req: MovieRequest): Promise<OmdbGetResponse>;
        //imdbRss(req: { path: string }): Promise<string>;
    }

    //export interface OmdbGetResponse {
    //    data: OmdbMovie;
    //    err: { meesage: string, name: string };
    //}

    export interface ListFilesRequest {
        sortBy?: string;
        sortByDesc?: boolean;
        foldersFirst?: boolean;
        ByInnerSelection?: boolean;
        SearchPattern?: string;
        IsRecursive?: boolean;
        FolderSize?: boolean;
        HideFolders?: boolean;
        HideFiles?: boolean;
        Path?: string;
        Sort?: SortRequest;
        ShowHiddenFiles?: boolean;
        NoCache?: boolean;
        View?: string;
        /** Number of columns in ImageListView mode */
        //ImageListColumns?: number;
        /** Number of rows in ImageListView mode */
        //ImageListRows?: number;
        /** How many items to skip, null means no skipping */
        skip?: number;
        /** How many items to take after skipping, null means all of them */
        take?: number;
    }


    export interface ListFilesResponse {
        File: File;
        Files: File[];
        Relatives: FileRelativesInfo;
    }

    export interface File {
        IsFolder: boolean;
        Name: string;
        Path?: string;
        Modified?: string;
        IsHidden?: boolean;
        Size?: number;
        Extension?: string;
        type?: "file" | "folder" | "link" | string;
    }

    export interface FileRelativesInfo {
        ParentFolder: File;
        NextSibling: File;
        PreviousSibling: File;
    }

    export interface PathRequest {
        Path: string;
    }


    interface IEnumerable<T> extends Array<T> {
        OrderByDescending?(sel): IOrderedEnumerable<T>;
        OrderBy?(sel): IOrderedEnumerable<T>;
    }

    interface IOrderedEnumerable<T> extends IEnumerable<T> {
        ThenByDescending?(sel): IOrderedEnumerable<T>;
        ThenBy?(sel): IOrderedEnumerable<T>;
    }


    export interface SortRequest {
        Columns: SortColumn[];
    }

    export interface SortColumn {
        Name: string;
        Descending?: boolean;
    }

    export interface ListFilesResponse {
        File: File;
        Files: File[];
        Relatives: FileRelativesInfo;
    }


    export interface FilenameParsedInfo {
        name: string;
        season: number;
        episode: number;
        year: number;
        tags: string[];
        filename: string;
    }

    export interface App {
        scanForMedia(): Promise<MediaScannerStatus>;
        scanStatus(): MediaScannerStatus;
        getMediaFiles(): Promise<MediaFile[]>;
    }

    export interface MediaScannerStatus {
        stack: number;
        scanned: number;
        saved: number;
        lastScanned: string;
        lastSaved: string;
        started: Date;
        finished: Date;
    }
    
    export interface MediaFile {
        md: ByFilename;
        file: File
        tmdb?;//TODO:: MediaDetails;
        tmdbBasic?//TODO:: TmdbMedia;
        type: string;
        parsed: FilenameParsedInfo;
        fsEntry: FsEntry;
    }

}