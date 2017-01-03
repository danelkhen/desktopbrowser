import { Proxy, ProxyCall } from "./utils/proxy"
import { ServiceBase } from "./utils/service-base"
import { FindOptions, HasKey, KeyValueService as KeyValueServiceContract, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, DbService as DbServiceContract, ByFilename as ByFilenameContract, FileService as FileServiceContract, KeyValue } from "contracts"

export class DbService<T> extends ServiceBase<DbServiceContract<T>>{
    findOneById(req: { id: any, options?: FindOptions }): Promise<T | undefined> { return this.invoke(t => t.findOneById(req)); }
    find(): Promise<T[]> { return this.invoke(t => t.find()); }
    persist(x: T): Promise<T> { return this.invoke(t => t.persist(x)); }
    removeById(req: { id: any }): Promise<T> { return this.invoke(t => t.removeById(req)); }
}
export class ByFilenameService extends DbService<ByFilenameContract> {
    constructor() {
        super();
        this.Url = "/api/byFilename";
    }

}
export class KeyValueService extends ServiceBase<KeyValueServiceContract> {
    constructor() {
        super();
        this.Url = "/api/keyValue";
    }
    findOneById<T extends HasKey>(req: { id: any, options?: FindOptions }): Promise<T | undefined> { return this.invoke(t => t.findOneById(req)); }
    persist<T extends HasKey>(obj: T): Promise<T> { return this.invoke(t => t.persist(obj)); }
    findAllWithKeyLike<T extends HasKey>(req: { like: string }): Promise<T[]> { return this.invoke(t => t.findAllWithKeyLike(req)); }
}

export class FileService extends ServiceBase<FileServiceContract> {
    constructor() {
        super();
        console.log("SiteServiceClient ctor");
        this.Url = "/api/fs";
        this.db = {
            byFilename: new ByFilenameService(),
            KeyValue: new KeyValueService(),
        };
    }
    db: {
        byFilename: ByFilenameService,
        KeyValue: KeyValueService,
    };

    ListFiles(req: ListFilesRequest): Promise<ListFilesResponse> { return this.invoke(t => t.ListFiles(req)); }
    GetFiles(req: ListFilesRequest): Promise<File[]> { return this.invoke(t => t.GetFiles(req)); }
    GetFileRelatives(path: string): Promise<FileRelativesInfo> { return this.invoke(t => t.GetFileRelatives(path)); }
    GetFile(req: PathRequest): Promise<File> { return this.invoke(t => t.GetFile(req)); }
    Execute(req: PathRequest): Promise<void> { return this.invoke(t => t.Execute(req)); }
    Explore(req: PathRequest): Promise<void> { return this.invoke(t => t.Explore(req)); }
    Delete(req: PathRequest): Promise<any> { return this.invoke(t => t.Delete(req)); }
    trash(req: PathRequest): Promise<any> { return this.invoke(t => t.trash(req)); }
    isWindows(): Promise<boolean> { return this.invoke(t => t.isWindows()); }
    GetHomeFiles(): Promise<File[]> { return this.invoke(t => t.GetHomeFiles()); }
    //CalculateFoldersSize(folders: File[]): Promise<File[]> { return this.invoke(t => t.CalculateFoldersSize(req)); }
    //CalculateFolderSize(path: string): Promise<number> { return this.invoke(t => t.CalculateFolderSize(req)); }
    //CalculateFolderSizeNoCache(path: string): Promise<number> { return this.invoke(t => t.CalculateFolderSizeNoCache(req)); }
    clearCache(): Promise<any> { return this.invoke(t => t.clearCache()); }

}

