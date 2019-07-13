import * as path from "path";
//import * as fs from "fs"
import * as fse from "fs-extra";
// import { getDrives, DiskInfoItem } from "diskinfo";
import { IEnumerable } from "contracts";
import * as drivelist from "drivelist";

export class IoDir {
    static async Exists(s: string): Promise<boolean> {
        if (!(await fse.pathExists(s))) return;
        let stat = await fse.stat(s);
        return stat.isDirectory();
    }
}
export class IoFile {
    static async Exists(s: string): Promise<boolean> {
        if (!(await fse.pathExists(s))) return;
        let stat = await fse.stat(s);
        return stat.isFile();
    }
    static async Delete(s: string): Promise<boolean> {
        await fse.unlink(s);
        return true;
    }
}
export class IoPath {
    static GetDirectoryName(path2: string): string {
        return path.dirname(path2);
    }
    static Combine(...args: string[]): string {
        throw new Error();
    }
    static GetFileName(s: string): string {
        return path.basename(s);
    }
    static GetFullPath(s: string): string {
        throw new Error();
    }
    static IsPathRooted(s: string): boolean {
        return path.isAbsolute(s);
    }
    static GetExtension(s: string): string {
        throw new Error();
    }
    static GetPathRoot(s: string): string {
        let max = 1000;
        let i = 0;
        let s2 = path.dirname(s);
        do {
            i++;
            s2 = path.dirname(s2);
            let s3 = path.dirname(s2);
            if (s2 == s3) return s2;
        } while (i < 100);
        return null;
    }
}

export class FileSystemInfo {
    protected constructor(path2: string) {
        this.path = path2;
    }

    static async create(path2: string): Promise<FileSystemInfo> {
        let x = new FileSystemInfo(path2);
        await x.init();
        return x;
    }

    async init() {
        let path2 = this.path;
        this.Attributes = {
            HasFlag: () => false, //TODO:
        };
        if (path2 == null) return;
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
        } catch (e) {}
        if (this.Name == null || this.Name == "") this.Name = this.path; //console.log(path2, this);
    }
    stats: fse.Stats;
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

    async EnumerateFiles(): Promise<IEnumerable<FileSystemInfo>> {
        return (await this.GetFileSystemInfos()).filter(t => t.isFile);
    }
    async EnumerateDirectories(): Promise<IEnumerable<FileSystemInfo>> {
        return (await this.GetFileSystemInfos()).filter(t => t.isDir);
    }
    async EnumerateFileSystemElementsRecursive(): Promise<IEnumerable<FileSystemInfo>> {
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
    async GetFileSystemInfos(): Promise<FileSystemInfo[]> {
        let list = await fse.readdir(this.path);
        let list2: FileSystemInfo[] = [];
        for (let t of list) {
            list2.push(await FileSystemInfo.create(path.join(this.path, t)));
        }
        return list2;
    }
}
export class DriveInfo extends FileSystemInfo {
    constructor(mount: string) {
        super(null);
        this.path = mount + "\\";
        this.Name = mount;
    }
    static drives: DriveInfo[] = [];
    static GetDrives(): DriveInfo[] {
        return this.drives;
    }
    static async GetDrives3(): Promise<DriveInfo[]> {
        const list = await this.GetDrives4();
        this.drives = list.map(t => this.toDriveInfo2(t));
        return this.drives;
    }
    // static toDriveInfo(x: DiskInfoItem) {
    //     let di = new DriveInfo(x.mounted);
    //     di.IsReady = true;
    //     di.AvailableFreeSpace = x.available;
    //     di.Capacity = x.capacity;
    //     return di;
    // }
    static toDriveInfo2(x: drivelist.Drive) {
        let di = new DriveInfo(x.mountpoints[0].label);
        di.IsReady = true;
        di.AvailableFreeSpace = x.size; // TODO
        di.Capacity = x.size;
        return di;
    }
    // static GetDrives2(): Promise<DiskInfoItem[]> {
    //     return new Promise<DiskInfoItem[]>((resolve, reject) => {
    //         getDrives((err, list) => {
    //             console.log("getDrives", err, list);
    //             if (err) reject(err);
    //             else resolve(list);
    //         });
    //     });
    // }
    static async GetDrives4(): Promise<drivelist.Drive[]> {
        const drives = await drivelist.list();
        return drives;
        // const list:DiskInfoItem[] = []
        // for(const drive of drives){
        //     const item:DiskInfoItem = {
        //         capacity:item.
        //     }

        // }
    }
    IsReady: boolean;
    AvailableFreeSpace: number | string; /*in mac a string returns */
    Capacity: number;
}

export enum FileAttributes {
    Hidden,
}
