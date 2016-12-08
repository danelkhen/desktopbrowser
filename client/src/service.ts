import { SiteRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File } from "./model"
import { Movie, MovieRequest } from 'imdb-api';


export class ServiceBase {
    Url: string;
    isPrimitive(x: any): boolean {
        if (x == null)
            return true;
        if (typeof (x) != "object")
            return true;
        return false;
    }

    Invoke<T>(action: string, prms?: any): Promise<T> {
        let method = "GET";
        let contentType: string = null;
        let data = prms;
        if (prms != null && typeof (prms) == "object" && Object.keys(prms).first(key => !this.isPrimitive(prms[key])) != null) {
            method = "POST";
            contentType = "application/json";
            data = JSON.stringify(prms);
        }
        return new Promise((resolve, reject) => {
            var xhr = jQuery.ajax({
                contentType,
                method,
                url: this.Url + "/" + action,
                data: data,
                complete: (a, b) => resolve(a.responseJSON),
            });
        });
    }
}

export class ByFilenameService extends ServiceBase {
    constructor() {
        super();
        this.Url = "/api/service.byFilename";
    }

    findOneById(id: any, options?: FindOptions): Promise<ByFilename | undefined> {
        return this.Invoke("findOneById", { id, options });
    }
    find(): Promise<ByFilename[]> {
        return this.Invoke("find");
    }
    removeById(req: { id: any }): Promise<ByFilename> {
        return this.Invoke("remove", req);
    }
    persist(x: ByFilename): Promise<ByFilename> {
        return this.Invoke("persist", x);
    }

}
export class SiteServiceClient extends ServiceBase {
    constructor() {
        super();
        this.Url = "/api/service";
        this.db = { byFilename: new ByFilenameService() };
    }
    db: { byFilename: ByFilenameService };

    ListFiles(req: ListFilesRequest): Promise<ListFilesResponse> {
        return this.Invoke("ListFiles", req);
    }
    GetFiles(req: SiteRequest): Promise<File[]> {
        return this.Invoke("GetFiles", req);
    }

    GetFileRelatives(req: PathRequest): Promise<FileRelativesInfo> {
        return this.Invoke("GetFileRelatives", req);
    }

    GetFile(req: PathRequest): Promise<File> {
        return this.Invoke("GetFile", req);
    }

    Execute(req: PathRequest): Promise<any> {
        return this.Invoke("Execute", req);
    }

    Delete(req: PathRequest): Promise<any> {
        return this.Invoke("Delete", req);
    }
    trash(req: PathRequest): Promise<any> {
        return this.Invoke("trash", req);
    }
    Explore(req: PathRequest): Promise<any> {
        return this.Invoke("Explore", req);
    }



    omdbGet(req: MovieRequest): Promise<OmdbGetResponse> {
        return this.Invoke("omdbGet", req);
    }

    imdbRss(req: { path: string }): Promise<string> {
        return this.Invoke("imdbRss", req);
    }
    //baseDbGet(req: { key: string }): Promise<BaseDbItem> {
    //    return this.Invoke("baseDbGet", req);
    //}
    //baseDbDelete(req: { key: string }): Promise<any> {
    //    return this.Invoke("baseDbDelete", req);
    //}
    //baseDbGetAll(): Promise<Bucket<BaseDbItem>[]> {
    //    return this.Invoke("baseDbGetAll", null);
    //}

    //baseDbSet(req: Bucket<BaseDbItem>): Promise<any> {
    //    return this.Invoke("baseDbSet", req);
    //}




}


export interface OmdbGetResponse {
    data: Movie;
    err: { meesage: string, name: string };
}

export interface Bucket<T> {
    key: string;
    value: T;
}

export interface BaseDbItem {
    selectedFiles?: string[];
}

export interface ObjectLiteral {
    [key: string]: any;
}

export interface Repository<Entity extends ObjectLiteral> {
    /**
     * Checks if entity has an id.
     * If entity contains compose ids, then it checks them all.
     */
    hasId(entity: Entity): boolean;
    /**
     * Creates a new entity instance.
     */
    create(): Entity;
    /**
     * Creates a new entities and copies all entity properties from given objects into their new entities.
     * Note that it copies only properties that present in entity schema.
     */
    create(plainObjects: Object[]): Entity[];
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that present in entity schema.
     */
    create(plainObject: Object): Entity;
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    preload(object: Object): Promise<Entity>;
    /**
     * Merges multiple entities (or entity-like objects) into a one new entity.
     */
    merge(...objects: ObjectLiteral[]): Entity;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist(entities: Entity[]): Promise<Entity[]>;
    /**
     * Persists (saves) a given entity in the database.
     * If entity does not exist in the database then inserts, otherwise updates.
     */
    persist(entity: Entity): Promise<Entity>;
    /**
     * Removes a given entities from the database.
     */
    remove(entities: Entity[]): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove(entity: Entity): Promise<Entity>;
    /**
     * Finds all entities.
     */
    find(): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find(conditions: ObjectLiteral): Promise<Entity[]>;
    /**
     * Finds entities with given find options.
     */
    find(options: FindOptions): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions and find options.
     */
    find(conditions: ObjectLiteral, options: FindOptions): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(conditions: ObjectLiteral): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(options: FindOptions): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(conditions: ObjectLiteral, options: FindOptions): Promise<[Entity[], number]>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(conditions: ObjectLiteral): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given find options.
     */
    findOne(options: FindOptions): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions and find options.
     */
    findOne(conditions: ObjectLiteral, options: FindOptions): Promise<Entity | undefined>;
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    findByIds(ids: any[], options?: FindOptions): Promise<Entity[]>;
    /**
     * Finds entity with given id.
     * Optionally find options can be applied.
     */
    findOneById(id: any, options?: FindOptions): Promise<Entity | undefined>;
    /**
     * Executes a raw SQL query and returns a raw database results.
     */
    query(query: string): Promise<any>;
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided repository.
     */
    transaction(runInTransaction: (repository: Repository<Entity>) => Promise<any> | any): Promise<any>;
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


export declare type OrderByCondition = {
    [columnName: string]: "ASC" | "DESC";
};


export interface ByFilename {
    key: string;
    selectedFiles?: string[];
}
