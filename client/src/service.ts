import { Proxy, ProxyCall } from "./utils/proxy"
import { ServiceBase } from "./utils/service-base"
import { FindOptions, HasKey, KeyValueService as KeyValueServiceContract, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, DbService, ByFilename as ByFilenameContract, FileService as FileServiceContract, KeyValue } from "contracts"

export class ByFilenameService extends ServiceBase<DbService<ByFilenameContract>> {
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

}

