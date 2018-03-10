"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
//import * as fs from "fs"
const fse = require("fs-extra");
const diskinfo_1 = require("diskinfo");
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
    static GetDirectoryName(path2) { return path.dirname(path2); }
    static Combine(...args) { throw new Error(); }
    static GetFileName(s) { return path.basename(s); }
    static GetFullPath(s) { throw new Error(); }
    static IsPathRooted(s) { return path.isAbsolute(s); }
    static GetExtension(s) { throw new Error(); }
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
            HasFlag: () => false,
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
        catch (e) {
        }
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
        this.path = mount + "\\";
        this.Name = mount;
    }
    static GetDrives() { return this.drives; } // [new DriveInfo("C:")];
    static GetDrives3() {
        return this.GetDrives2().then(list => {
            this.drives = list.map(t => this.toDriveInfo(t));
            return this.drives;
        });
    }
    static toDriveInfo(x) {
        let di = new DriveInfo(x.mounted);
        di.IsReady = true;
        di.AvailableFreeSpace = x.available;
        di.Capacity = x.capacity;
        return di;
    }
    static GetDrives2() {
        return new Promise((resolve, reject) => {
            diskinfo_1.getDrives((err, list) => {
                console.log("getDrives", err, list);
                if (err)
                    reject(err);
                else
                    resolve(list);
            });
        });
    }
}
DriveInfo.drives = [];
exports.DriveInfo = DriveInfo;
var FileAttributes;
(function (FileAttributes) {
    FileAttributes[FileAttributes["Hidden"] = 0] = "Hidden";
})(FileAttributes = exports.FileAttributes || (exports.FileAttributes = {}));
