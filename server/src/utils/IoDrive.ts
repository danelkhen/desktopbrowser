import { DriveInfoItem, getDrives } from "./getDrives"
import { IoFile } from "./IoFile"

export interface IoDrive extends IoFile {
    IsReady: boolean
    /** in mac a string returns */
    AvailableFreeSpace: number | string
    Capacity: string
}
export enum FileAttributes {
    Hidden,
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
