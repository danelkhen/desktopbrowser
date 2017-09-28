﻿import { Proxy, ProxyCall } from "./utils/proxy"
import { ServiceBase } from "./utils/service-base"
import { FindManyOptions, FindOneOptions, HasKey, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File, KeyValue, FsEntry } from "contracts"
import * as C from "contracts"
//import { FindManyOptions } from "typeorm"

export class DbService<T> extends ServiceBase<C.DbService<T>>{
    findOneById(req: { id: any, options?: C.FindManyOptions<T> }): Promise<T | undefined> { return this.invoke(t => t.findOneById(req)); }
    find(req?: C.FindManyOptions<T>): Promise<T[]> { return this.invoke(t => t.find(req)); }
    persist(x: T): Promise<T> { return this.invoke(t => t.persist(x)); }
    removeById(req: { id: any }): Promise<T> { return this.invoke(t => t.removeById(req)); }
}
export class ByFilenameService extends DbService<C.ByFilename> {
    constructor() {
        super();
        this.Url = "/api/byFilename";
    }

}
export class KeyValueService extends ServiceBase<C.KeyValueService> {
    constructor() {
        super();
        this.Url = "/api/keyValue";
    }
    findOneById<T>(req: { id: any, options?: C.FindOneOptions<KeyValue<T>> }): Promise<KeyValue<T>> { return this.invoke(t => t.findOneById<T>(req)); }
    persist<T>(obj: KeyValue<T>): Promise<KeyValue<T>> { return this.invoke(t => t.persist<T>(obj)); }
    findAllWithKeyLike<T>(req: { like: string }): Promise<C.KeyValue<T>[]> { return this.invoke(t => t.findAllWithKeyLike<T>(req)); }
}

export class FileService extends ServiceBase<C.FileService> {
    constructor() {
        super();
        console.log("SiteServiceClient ctor");
        this.Url = "/api/fs";
        //this.db = {
        //    byFilename: new ByFilenameService(),
        //    KeyValue: new KeyValueService(),
        //};
    }
    //db: {
    //    byFilename: ByFilenameService,
    //    KeyValue: KeyValueService,
    //};

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

export class FsEntryService extends DbService<FsEntry> {
    constructor() {
        super();
        this.Url = "/api/fsEntry";
    }
}

export class AppService extends ServiceBase<C.App> {
    constructor() {
        super();
        this.Url = "/api/app";
    }
    getConfig(): Promise<C.Config> { return this.invoke(t => t.getConfig()); }
    saveConfig(config: C.Config): Promise<any> { return this.invoke(t => t.saveConfig(config)); }
    scanForMedia(): Promise<C.MediaScannerStatus> { return this.invoke(t => t.scanForMedia()); }
    scanStatus(): Promise<C.MediaScannerStatus> { return this.invoke(t => t.scanStatus()); }
    getMediaFiles(req?: C.GetMediaFilesRequest): Promise<C.MediaFile[]> { return this.invoke(t => t.getMediaFiles(req)); }

}

