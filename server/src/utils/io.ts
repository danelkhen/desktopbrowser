﻿import * as path from "path"
import * as fs from "fs"
import { getDrives, DiskInfoItem } from "diskinfo"
import { IEnumerable } from "contracts"


export class IoDir {
    static Exists(s: string): boolean { return fs.existsSync(s) && fs.statSync(s).isDirectory(); }
}
export class IoFile {
    static Exists(s: string): boolean { return fs.existsSync(s) && fs.statSync(s).isFile(); }
    static Delete(s: string): boolean {
        fs.unlinkSync(s);
        return true;
    }
}
export class IoPath {
    static GetDirectoryName(path2: string): string { return path.dirname(path2); }
    static Combine(...args: string[]): string { throw new Error(); }
    static GetFileName(s: string): string { return path.basename(s); }
    static GetFullPath(s: string): string { throw new Error(); }
    static IsPathRooted(s: string): boolean { return path.isAbsolute(s); }
    static GetExtension(s: string): string { throw new Error(); }
    static GetPathRoot(s: string): string {
        let max = 1000;
        let i = 0;
        let s2 = path.dirname(s);
        do {
            i++;
            s2 = path.dirname(s2);
            let s3 = path.dirname(s2);
            if (s2 == s3)
                return s2;
        }
        while (i < 100);
        return null;
    }
}


export class FileSystemInfo {
    constructor(path2: string) {
        this.path = path2;
        this.Attributes = {
            HasFlag: () => false, //TODO:
        };
        if (path2 == null)
            return;
        this.FullName = path.resolve(path2);
        this.Name = path.basename(path2);
        this.Extension = path.extname(path2);
        try {
            this.stats = fs.lstatSync(path2);
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
    stats: fs.Stats;
    path: string;
    isLink: boolean;
    isFile: boolean;
    isDir: boolean;
    Name: string;
    LastWriteTime?: Date;
    Attributes?: { HasFlag: Function };
    FullName?: string;
    Length?: number;
    Extension?: string;

    EnumerateFiles(): IEnumerable<FileSystemInfo> {
        return this.GetFileSystemInfos().filter(t => t.isFile);
    }
    EnumerateDirectories(): IEnumerable<FileSystemInfo> {
        return this.GetFileSystemInfos().filter(t => t.isDir);
    }
    EnumerateFileSystemElementsRecursive(): IEnumerable<FileSystemInfo> {
        let list = this.GetFileSystemInfos();
        let i = 0;
        while (i < list.length) {
            let file = list[i];
            if (file.isDir) {
                list.push(...file.GetFileSystemInfos());
            }
            i++;
        }
        return list;
    }
    GetFileSystemInfos(): IEnumerable<FileSystemInfo> {
        let list = fs.readdirSync(this.path);
        return list.map(t => new FileSystemInfo(path.join(this.path, t)));
    }

}
export class DriveInfo extends FileSystemInfo {
    constructor(mount: string) {
        super(null);
        this.path = mount + "\\";
        this.Name = mount;
    }
    static drives: DriveInfo[] = [];
    static GetDrives(): DriveInfo[] { return this.drives; }// [new DriveInfo("C:")];
    static GetDrives3(): Promise<DriveInfo[]> {
        return this.GetDrives2().then(list => {
            this.drives = list.map(t => this.toDriveInfo(t));
            return this.drives;
        });
    }
    static toDriveInfo(x: DiskInfoItem) {
        let di = new DriveInfo(x.mounted);
        di.IsReady = true;
        di.AvailableFreeSpace = x.available;
        di.Capacity = x.capacity;
        return di;
    }
    static GetDrives2(): Promise<DiskInfoItem[]> {
        return new Promise<DiskInfoItem[]>((resolve, reject) => {
            getDrives((err, list) => {
                console.log("getDrives", err, list);
                if (err)
                    reject(err);
                else
                    resolve(list);
            });
        });
    }
    IsReady: boolean;
    AvailableFreeSpace: number | string; /*in mac a string returns */
    Capacity: number;

}


export enum FileAttributes {
    Hidden,
}
