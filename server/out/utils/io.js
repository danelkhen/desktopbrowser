"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAttributes = exports.DriveInfo = exports.FileSystemInfo = exports.IoPath = exports.IoFile = exports.IoDir = void 0;
const path = __importStar(require("path"));
//import * as fs from "fs"
const fse = __importStar(require("fs-extra"));
const getDrives_1 = require("./getDrives");
class IoDir {
    static async Exists(s) {
        if (!(await fse.pathExists(s)))
            return;
        let stat = await fse.stat(s);
        return stat.isDirectory();
    }
}
exports.IoDir = IoDir;
class IoFile {
    static async Exists(s) {
        if (!(await fse.pathExists(s)))
            return;
        let stat = await fse.stat(s);
        return stat.isFile();
    }
    static async Delete(s) {
        await fse.unlink(s);
        return true;
    }
}
exports.IoFile = IoFile;
class IoPath {
    static GetDirectoryName(path2) {
        return path.dirname(path2);
    }
    static Combine(...args) {
        throw new Error();
    }
    static GetFileName(s) {
        return path.basename(s);
    }
    static GetFullPath(s) {
        throw new Error();
    }
    static IsPathRooted(s) {
        return path.isAbsolute(s);
    }
    static GetExtension(s) {
        throw new Error();
    }
    static GetPathRoot(s) {
        let max = 1000;
        let i = 0;
        let s2 = path.dirname(s);
        do {
            i++;
            s2 = path.dirname(s2);
            let s3 = path.dirname(s2);
            if (s2 == s3)
                return s2;
        } while (i < 100);
        return null;
    }
}
exports.IoPath = IoPath;
class FileSystemInfo {
    constructor(path2) {
        this.stats = undefined;
        this.isLink = undefined;
        this.isFile = undefined;
        this.isDir = undefined;
        this.Name = undefined;
        this.path = path2;
    }
    static async create(path2) {
        let x = new FileSystemInfo(path2);
        await x.init();
        return x;
    }
    async init() {
        let path2 = this.path;
        this.Attributes = {
            HasFlag: () => false, //TODO:
        };
        if (path2 == null)
            return;
        this.FullName = path.resolve(path2);
        this.Name = path.basename(path2);
        this.Extension = path.extname(path2);
        try {
            this.stats = await fse.lstatSync(path2);
            this.Length = this.stats.size;
            this.isFile = this.stats.isFile();
            this.isDir = this.stats.isDirectory();
            this.LastWriteTime = this.stats.mtime;
            this.isLink = this.stats.isSymbolicLink();
        }
        catch (e) { }
        if (this.Name == null || this.Name == "")
            this.Name = this.path; //console.log(path2, this);
    }
    async EnumerateFiles() {
        return (await this.GetFileSystemInfos()).filter(t => t.isFile);
    }
    async EnumerateDirectories() {
        return (await this.GetFileSystemInfos()).filter(t => t.isDir);
    }
    async EnumerateFileSystemElementsRecursive() {
        let list = await this.GetFileSystemInfos();
        let i = 0;
        while (i < list.length) {
            let file = list[i];
            if (file.isDir) {
                let list2 = await file.GetFileSystemInfos();
                list.push(...list2);
            }
            i++;
        }
        return list;
    }
    async GetFileSystemInfos() {
        let list = await fse.readdir(this.path);
        let list2 = [];
        for (let t of list) {
            list2.push(await FileSystemInfo.create(path.join(this.path, t)));
        }
        return list2;
    }
}
exports.FileSystemInfo = FileSystemInfo;
class DriveInfo extends FileSystemInfo {
    constructor(mount) {
        super(null);
        this.IsReady = undefined;
        this.AvailableFreeSpace = undefined; /*in mac a string returns */
        this.Capacity = undefined;
        this.path = mount + "\\";
        this.Name = mount;
    }
    static GetDrives() {
        return this.drives;
    }
    static async GetDrives3() {
        const list = await this.GetDrives2();
        this.drives = list.map(t => this.toDriveInfo(t));
        return this.drives;
    }
    static toDriveInfo(x) {
        let di = new DriveInfo(x.mounted);
        di.IsReady = true;
        di.AvailableFreeSpace = x.available;
        di.Capacity = x.capacity;
        return di;
    }
    static async GetDrives2() {
        return await getDrives_1.getDrives();
    }
}
exports.DriveInfo = DriveInfo;
DriveInfo.drives = [];
var FileAttributes;
(function (FileAttributes) {
    FileAttributes[FileAttributes["Hidden"] = 0] = "Hidden";
})(FileAttributes = exports.FileAttributes || (exports.FileAttributes = {}));
