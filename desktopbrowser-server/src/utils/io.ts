import * as path from "path"
import * as fs from "fs"
import { getDrives, DiskInfoItem } from "diskinfo"

export class IoDir {
    static Exists(s: string): boolean { return fs.existsSync(s) && fs.statSync(s).isDirectory(); }
    static Delete(s: string, x?: boolean): boolean { throw new Error(); }
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
            let x = fs.statSync(path2);
            this.Length = x.size;
            this.isFile = x.isFile();
            this.isDir = x.isDirectory();
            this.LastWriteTime = x.mtime;
        }
        catch (e) {
        }
    }
    path: string;
    isFile: boolean;
    isDir: boolean;
    Name: string;
    LastWriteTime?: Date;
    Attributes?: { HasFlag: Function };
    FullName?: string;
    Length?: number;
    Extension?: string;

    EnumerateFiles(): IEnumerable<FileSystemInfo> {
        return this.EnumerateFileSystemInfos().filter(t => t.isFile);
    }
    EnumerateDirectories(): IEnumerable<FileSystemInfo> {
        return this.EnumerateFileSystemInfos().filter(t => t.isDir);
    }
    EnumerateFileSystemElementsRecursive(): IEnumerable<FileSystemInfo> {
        console.log("not implemented - EnumerateFileSystemElementsRecursive");
        throw new Error();
    }
    EnumerateFileSystemInfos(): IEnumerable<FileSystemInfo> {
        return fs.readdirSync(this.path).map(t => new FileSystemInfo(path.join(this.path, t)));
    }
    GetFileSystemInfos(): FileSystemInfo[] {
        return this.EnumerateFileSystemInfos();
    }

}
export class DriveInfo extends FileSystemInfo {
    constructor(mount: string) {
        super(null);
        this.path = mount+"\\";
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
                if (err)
                    reject(err);
                else
                    resolve(list);
            });
        });
    }
    IsReady: boolean;
    AvailableFreeSpace: number;
    Capacity: number;

}


export enum FileAttributes {
    Hidden,
}
