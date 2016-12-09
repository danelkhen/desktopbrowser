
declare module "contracts" {
    export interface ByFilename {
        key: string;
        selectedFiles?: string[];
    }

    export interface ByFilenameService {
        init();
        findOneById(req: { id: any/*, options?: FindOptions*/ }): Promise<ByFilename | undefined>;
        find(): Promise<ByFilename[]>;

        persist(x: ByFilename): Promise<ByFilename>;

        removeById(req: { id: any }): Promise<ByFilename>;

    }
    export interface SiteService {
        init();
        migrateToSqlite();

        ListFiles(req: ListFilesRequest): ListFilesResponse;

        GetFiles(req: SiteRequest): File[];

        GetFileRelatives(path: string): FileRelativesInfo;

        GetFile(req: PathRequest): File;

        Execute(req: PathRequest): void;

        Explore(req: PathRequest): void;


        Delete(req: PathRequest): Promise<any>;

        trash(req: PathRequest): Promise<any>;

        //rimraf(pattern: string, options?: rimraf.Options);



        ApplyRequest(files: IEnumerable<File>, req: SiteRequest): IEnumerable<File>;

        GetFileAndOrFolders(path: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean): IEnumerable<File>;
        isWindows();

        GetHomeFiles(): File[];

        CalculateFoldersSize(folders: File[]): IEnumerable<File>;

        CalculateFolderSize(path: string): number;

        CalculateFolderSizeNoCache(path: string): number;

        //GetConfig(): SiteConfiguration;

        //GetConfigNoCache(): SiteConfiguration;

        clearCache();

        omdbGet(req: MovieRequest): Promise<Movie>;

        imdbRss(req: { path: string }): Promise<string>;


    }

    export interface OmdbGetResponse {
        data: Movie;
        err: { meesage: string, name: string };
    }


    export interface SiteRequest {
        pathPrefix?: string;
        SearchPattern?: string;
        IsRecursive?: boolean;
        FolderSize?: boolean;
        HideFolders?: boolean;
        HideFiles?: boolean;
        Path?: string;
        Sort?: SortRequest;
        MixFilesAndFolders?: boolean;
        ShowHiddenFiles?: boolean;
        NoCache?: boolean;
        View?: string;
        /// <summary>
        /// Number of columns in ImageListView mode
        /// </summary>
        ImageListColumns?: number;
        /// <summary>
        /// Number of rows in ImageListView mode
        /// </summary>
        ImageListRows?: number;
        KeepView?: boolean;

        /// <summary>
        /// How many items to skip, null means no skipping
        /// </summary>
        Skip?: number;
        /// <summary>
        /// How many items to take after skipping, null means all of them
        /// </summary>
        Take?: number;
    }


    export interface ListFilesRequest extends SiteRequest {
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

    export interface Movie {
        imdbid: string;
        imdburl: string;
        genres: string;
        languages: string;
        country: string;
        votes: string;
        series: boolean;
        rating: number;
        runtime: string;
        title: string;
        year: number;
        type: string;
        poster: string;
        metascore: string;
        plot: string;
        rated: string;
        director: string;
        writer: string;
        actors: string;
        released: Date;
    }

    export interface MovieRequest {
        name?: string;
        id?: string;
        year?: number;
    }

    interface IEnumerable<T> extends Array<T> {
        OrderByDescending?(sel): IOrderedEnumerable<T>;
        OrderBy?(sel): IOrderedEnumerable<T>;
        ToCachedEnumerable?(): CachedIEnumerable<T>;
    }
    interface IOrderedEnumerable<T> extends IEnumerable<T> {
        ThenByDescending?(sel): IOrderedEnumerable<T>;
        ThenBy?(sel): IOrderedEnumerable<T>;
    }

    interface CachedIEnumerable<T> extends IEnumerable<T> {
    }

    export interface SortRequest {
        Columns: SortColumn[];
    }


    export interface SortColumn {
        Name: string;
        Descending?: boolean;
    }


    export interface ListFilesRequest extends SiteRequest {
    }

    export interface ListFilesResponse {
        File: File;
        Files: File[];
        Relatives: FileRelativesInfo;
    }

}