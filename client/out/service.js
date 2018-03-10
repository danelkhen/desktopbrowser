"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_base_1 = require("./utils/service-base");
class DbService extends service_base_1.ServiceBase {
    findOneById(req) { return this.invoke(t => t.findOneById(req)); }
    find(req) { return this.invoke(t => t.find(req)); }
    persist(x) { return this.invoke(t => t.persist(x)); }
    removeById(req) { return this.invoke(t => t.removeById(req)); }
}
exports.DbService = DbService;
class ByFilenameService extends DbService {
    constructor() {
        super();
        this.Url = "/api/byFilename";
    }
}
exports.ByFilenameService = ByFilenameService;
class KeyValueService extends service_base_1.ServiceBase {
    constructor() {
        super();
        this.Url = "/api/keyValue";
    }
    findOneById(req) { return this.invoke(t => t.findOneById(req)); }
    persist(obj) { return this.invoke(t => t.persist(obj)); }
    findAllWithKeyLike(req) { return this.invoke(t => t.findAllWithKeyLike(req)); }
}
exports.KeyValueService = KeyValueService;
class FileService extends service_base_1.ServiceBase {
    constructor() {
        super();
        console.log("SiteServiceClient ctor");
        this.Url = "/api/fs";
    }
    ListFiles(req) { return this.invoke(t => t.ListFiles(req)); }
    GetFiles(req) { return this.invoke(t => t.GetFiles(req)); }
    GetFileRelatives(path) { return this.invoke(t => t.GetFileRelatives(path)); }
    GetFile(req) { return this.invoke(t => t.GetFile(req)); }
    Execute(req) { return this.invoke(t => t.Execute(req)); }
    Explore(req) { return this.invoke(t => t.Explore(req)); }
    Delete(req) { return this.invoke(t => t.Delete(req)); }
    trash(req) { return this.invoke(t => t.trash(req)); }
    isWindows() { return this.invoke(t => t.isWindows()); }
    GetHomeFiles() { return this.invoke(t => t.GetHomeFiles()); }
    clearCache() { return this.invoke(t => t.clearCache()); }
}
exports.FileService = FileService;
class FsEntryService extends DbService {
    constructor() {
        super();
        this.Url = "/api/fsEntry";
    }
}
exports.FsEntryService = FsEntryService;
class AppService extends service_base_1.ServiceBase {
    constructor() {
        super();
        this.Url = "/api/app";
    }
    getConfig() { return this.invoke(t => t.getConfig()); }
    saveConfig(config) { return this.invoke(t => t.saveConfig(config)); }
    scanForMedia() { return this.invoke(t => t.scanForMedia()); }
    scanStatus() { return this.invoke(t => t.scanStatus()); }
    getMediaFiles(req) { return this.invoke(t => t.getMediaFiles(req)); }
}
exports.AppService = AppService;
//# sourceMappingURL=service.js.map