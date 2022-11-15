import { getDiskInfo } from "node-disk-info"
import Drive from "node-disk-info/dist/classes/drive"
import { IoFile } from "./IoFile"

export interface IoDrive extends IoFile {
    IsReady: boolean
    /** in mac a string returns */
    AvailableFreeSpace: number | string
    Capacity: string
}

export namespace IoDrive {
    export async function getDrives(): Promise<IoDrive[]> {
        const list = await getDiskInfo()
        const drives = list.map(t => toDriveInfo(t))
        return drives
    }
}

function toDriveInfo(x: Drive) {
    const di: IoDrive = {
        path: x.mounted + "\\",
        Name: x.mounted,
        IsReady: true,
        AvailableFreeSpace: x.available,
        Capacity: x.capacity,
    }
    return di
}
