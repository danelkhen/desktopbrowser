declare module "contracts" {

    export interface ByFilename {
        key: string;
        selectedFiles?: string[];
    }

    export interface DbService<T> {
        findOneById(req: { id: any, options?: FindOptions }): Promise<T | undefined>;
        find(): Promise<T[]>;
        persist(x: T): Promise<T>;
        removeById(req: { id: any }): Promise<T>;
    }

    export interface ByFilenameService extends DbService<ByFilename> { }

    export interface SiteService {
        init();
        migrateToSqlite();
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
        omdbGet(req: MovieRequest): Promise<OmdbGetResponse>;
        imdbRss(req: { path: string }): Promise<string>;
    }

    export interface OmdbGetResponse {
        data: OmdbMovie;
        err: { meesage: string, name: string };
    }

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

    export interface OmdbMovie {
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

    export interface ObjectLiteral {
        [key: string]: any;
    }

    /**
     * Options to be passed to find methods.
     *
     * Example:
     *  const options: FindOptions = {
     *     alias: "photo",
     *     limit: 100,
     *     offset: 0,
     *     firstResult: 5,
     *     maxResults: 10,
     *     where: "photo.likesCount > 0 && photo.likesCount < 10",
     *     having: "photo.viewsCount > 0 && photo.viewsCount < 1000",
     *     whereConditions: {
     *         "photo.isPublished": true,
     *         "photo.name": "Me and Bears"
     *     },
     *     havingConditions: {
     *         "photo.filename": "bears.jpg"
     *     },
     *     orderBy: {
     *         "photo.id": "DESC"
     *     },
     *     groupBy: [
     *         "photo.name"
     *     ],
     *     leftJoin: {
     *         author: "photo.author",
     *         categories: "categories",
     *         user: "categories.user",
     *         profile: "user.profile"
     *     },
     *     innerJoin: {
     *         author: "photo.author",
     *         categories: "categories",
     *         user: "categories.user",
     *         profile: "user.profile"
     *     },
     *     leftJoinAndSelect: {
     *         author: "photo.author",
     *         categories: "categories",
     *         user: "categories.user",
     *         profile: "user.profile"
     *     },
     *     innerJoinAndSelect: {
     *         author: "photo.author",
     *         categories: "categories",
     *         user: "categories.user",
     *         profile: "user.profile"
     *     }
     * };
     */
    export interface FindOptions {
        /**
         * Alias of the selected entity.
         */
        alias: string;
        /**
         * Selection limitation, e.g. LIMIT expression.
         */
        limit?: number;
        /**
         * From what position to select, e.g. OFFSET expression.
         */
        offset?: number;
        /**
         * First results to select (offset using pagination).
         */
        firstResult?: number;
        /**
         * Maximum result to select (limit using pagination).
         */
        maxResults?: number;
        /**
         * Regular WHERE expression.
         */
        where?: string;
        /**
         * Regular HAVING expression.
         */
        having?: string;
        /**
         * WHERE conditions. Key-value object pair, where each key is a column name and value is a column value.
         * "AND" is applied between all parameters.
         */
        whereConditions?: ObjectLiteral;
        /**
         * HAVING conditions. Key-value object pair, where each key is a column name and value is a column value.
         * "AND" is applied between all parameters.
         */
        havingConditions?: ObjectLiteral;
        /**
         * Array of ORDER BY expressions.
         */
        orderBy?: OrderByCondition;
        /**
         * Array of column to GROUP BY.
         */
        groupBy?: string[];
        /**
         * Array of columns to LEFT JOIN.
         */
        leftJoinAndSelect?: {
            [key: string]: string;
        };
        /**
         * Array of columns to INNER JOIN.
         */
        innerJoinAndSelect?: {
            [key: string]: string;
        };
        /**
         * Array of columns to LEFT JOIN.
         */
        leftJoin?: {
            [key: string]: string;
        };
        /**
         * Array of columns to INNER JOIN.
         */
        innerJoin?: {
            [key: string]: string;
        };
        /**
         * Parameters used in the WHERE and HAVING expressions.
         */
        parameters?: Object;
        /**
         * Indicates if query builder should add virtual columns to the entity too.
         */
        enabledOptions?: ("RELATION_ID_VALUES")[];
    }

    export type OrderByCondition = {
        [columnName: string]: "ASC" | "DESC";
    };

    export interface ByFilename {
        key: string;
        selectedFiles?: string[];
    }

    export interface FilenameParsedInfo {
        name: string;
        season: number;
        episode: number;
        year: number;
        tags: string[];
        filename: string;
    }


}