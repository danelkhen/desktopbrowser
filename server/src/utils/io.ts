//import * as fs from "fs"
import * as fse from "fs-extra"
import * as path from "path"
import { DriveInfoItem, getDrives } from "./getDrives"
import { FileSystemInfo } from "./FileSystemInfo"

export class IoDir {
    static async Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        let stat = await fse.stat(s)
        return stat.isDirectory()
    }
}
export class IoFile {
    static async Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        let stat = await fse.stat(s)
        return stat.isFile()
    }
    static async Delete(s: string): Promise<boolean> {
        await fse.unlink(s)
        return true
    }
}
export class IoPath {
    static GetDirectoryName(path2: string): string {
        return path.dirname(path2)
    }
    static Combine(...args: string[]): string {
        throw new Error()
    }
    static GetFileName(s: string): string {
        return path.basename(s)
    }
    static GetFullPath(s: string): string {
        throw new Error()
    }
    static IsPathRooted(s: string): boolean {
        return path.isAbsolute(s)
    }
    static GetExtension(s: string): string {
        throw new Error()
    }
    static GetPathRoot(s: string): string | null {
        let max = 1000
        let i = 0
        let s2 = path.dirname(s)
        do {
            i++
            s2 = path.dirname(s2)
            let s3 = path.dirname(s2)
            if (s2 == s3) return s2
        } while (i < 100)
        return null
    }
}

export class DriveInfo extends FileSystemInfo {
    constructor(mount: string) {
        super(null!)
        this.path = mount + "\\"
        this.Name = mount
    }
    static drives: DriveInfo[] = []
    static GetDrives(): DriveInfo[] {
        return this.drives
    }
    static async GetDrives3(): Promise<DriveInfo[]> {
        const list = await this.GetDrives2()
        this.drives = list.map(t => this.toDriveInfo(t))
        return this.drives
    }
    static toDriveInfo(x: DriveInfoItem) {
        let di = new DriveInfo(x.mounted)
        di.IsReady = true
        di.AvailableFreeSpace = x.available
        di.Capacity = x.capacity
        return di
    }
    static async GetDrives2(): Promise<DriveInfoItem[]> {
        return await getDrives()
    }
    IsReady: boolean = undefined!
    AvailableFreeSpace: number | string = undefined! /*in mac a string returns */
    Capacity: string = undefined!
}

export enum FileAttributes {
    Hidden,
}
