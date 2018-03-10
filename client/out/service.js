"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var service_base_1 = require("./utils/service-base");
var DbService = (function (_super) {
    __extends(DbService, _super);
    function DbService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DbService.prototype.findOneById = function (req) { return this.invoke(function (t) { return t.findOneById(req); }); };
    DbService.prototype.find = function (req) { return this.invoke(function (t) { return t.find(req); }); };
    DbService.prototype.persist = function (x) { return this.invoke(function (t) { return t.persist(x); }); };
    DbService.prototype.removeById = function (req) { return this.invoke(function (t) { return t.removeById(req); }); };
    return DbService;
}(service_base_1.ServiceBase));
exports.DbService = DbService;
var ByFilenameService = (function (_super) {
    __extends(ByFilenameService, _super);
    function ByFilenameService() {
        var _this = _super.call(this) || this;
        _this.Url = "/api/byFilename";
        return _this;
    }
    return ByFilenameService;
}(DbService));
exports.ByFilenameService = ByFilenameService;
var KeyValueService = (function (_super) {
    __extends(KeyValueService, _super);
    function KeyValueService() {
        var _this = _super.call(this) || this;
        _this.Url = "/api/keyValue";
        return _this;
    }
    KeyValueService.prototype.findOneById = function (req) { return this.invoke(function (t) { return t.findOneById(req); }); };
    KeyValueService.prototype.persist = function (obj) { return this.invoke(function (t) { return t.persist(obj); }); };
    KeyValueService.prototype.findAllWithKeyLike = function (req) { return this.invoke(function (t) { return t.findAllWithKeyLike(req); }); };
    return KeyValueService;
}(service_base_1.ServiceBase));
exports.KeyValueService = KeyValueService;
var FileService = (function (_super) {
    __extends(FileService, _super);
    function FileService() {
        var _this = _super.call(this) || this;
        console.log("SiteServiceClient ctor");
        _this.Url = "/api/fs";
        return _this;
    }
    FileService.prototype.ListFiles = function (req) { return this.invoke(function (t) { return t.ListFiles(req); }); };
    FileService.prototype.GetFiles = function (req) { return this.invoke(function (t) { return t.GetFiles(req); }); };
    FileService.prototype.GetFileRelatives = function (path) { return this.invoke(function (t) { return t.GetFileRelatives(path); }); };
    FileService.prototype.GetFile = function (req) { return this.invoke(function (t) { return t.GetFile(req); }); };
    FileService.prototype.Execute = function (req) { return this.invoke(function (t) { return t.Execute(req); }); };
    FileService.prototype.Explore = function (req) { return this.invoke(function (t) { return t.Explore(req); }); };
    FileService.prototype.Delete = function (req) { return this.invoke(function (t) { return t.Delete(req); }); };
    FileService.prototype.trash = function (req) { return this.invoke(function (t) { return t.trash(req); }); };
    FileService.prototype.isWindows = function () { return this.invoke(function (t) { return t.isWindows(); }); };
    FileService.prototype.GetHomeFiles = function () { return this.invoke(function (t) { return t.GetHomeFiles(); }); };
    FileService.prototype.clearCache = function () { return this.invoke(function (t) { return t.clearCache(); }); };
    return FileService;
}(service_base_1.ServiceBase));
exports.FileService = FileService;
var FsEntryService = (function (_super) {
    __extends(FsEntryService, _super);
    function FsEntryService() {
        var _this = _super.call(this) || this;
        _this.Url = "/api/fsEntry";
        return _this;
    }
    return FsEntryService;
}(DbService));
exports.FsEntryService = FsEntryService;
var AppService = (function (_super) {
    __extends(AppService, _super);
    function AppService() {
        var _this = _super.call(this) || this;
        _this.Url = "/api/app";
        return _this;
    }
    AppService.prototype.getConfig = function () { return this.invoke(function (t) { return t.getConfig(); }); };
    AppService.prototype.saveConfig = function (config) { return this.invoke(function (t) { return t.saveConfig(config); }); };
    AppService.prototype.scanForMedia = function () { return this.invoke(function (t) { return t.scanForMedia(); }); };
    AppService.prototype.scanStatus = function () { return this.invoke(function (t) { return t.scanStatus(); }); };
    AppService.prototype.getMediaFiles = function (req) { return this.invoke(function (t) { return t.getMediaFiles(req); }); };
    return AppService;
}(service_base_1.ServiceBase));
exports.AppService = AppService;
//# sourceMappingURL=service.js.map