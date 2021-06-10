import * as fse from "fs-extra"
import * as path from "path"
import { DriveInfoItem, getDrives } from "./getDrives"
import { IoFile } from "./IoFile"

export namespace IoDir {
    export async function Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        let stat = await fse.stat(s)
        return stat.isDirectory()
    }
}
export namespace IoPath {
    export function GetDirectoryName(path2: string): string {
        return path.dirname(path2)
    }
    export function Combine(...args: string[]): string {
        throw new Error()
    }
    export function GetFileName(s: string): string {
        return path.basename(s)
    }
    export function GetFullPath(s: string): string {
        throw new Error()
    }
    export function IsPathRooted(s: string): boolean {
        return path.isAbsolute(s)
    }
    export function GetExtension(s: string): string {
        throw new Error()
    }
    export function GetPathRoot(s: string): string | null {
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

export interface IoDrive extends IoFile {
    IsReady: boolean
    /** in mac a string returns */
    AvailableFreeSpace: number | string
    Capacity: string
}
export namespace IoDrive {
    export function create(mount: string): IoDrive {
        return {
            path: mount + "\\",
            Name: mount,
        } as any // TODO:
    }
    let drives: IoDrive[] = []
    export function GetDrives(): IoDrive[] {
        return drives
    }
    export async function GetDrives3(): Promise<IoDrive[]> {
        const list = await GetDrives2()
        drives = list.map(t => toDriveInfo(t))
        return drives
    }
    export function toDriveInfo(x: DriveInfoItem) {
        let di = IoDrive.create(x.mounted)
        di.IsReady = true
        di.AvailableFreeSpace = x.available
        di.Capacity = x.capacity
        return di
    }
    export async function GetDrives2(): Promise<DriveInfoItem[]> {
        return await getDrives()
    }
    // const IsReady: boolean = undefined!
    // const AvailableFreeSpace: number | string = undefined! /*in mac a string returns */
    // const Capacity: string = undefined!
}

export enum FileAttributes {
    Hidden,
}
