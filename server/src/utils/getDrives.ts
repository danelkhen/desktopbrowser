import { getDiskInfo } from "node-disk-info"
import Drive from "node-disk-info/dist/classes/drive"

export interface DriveInfoItem {
    filesystem: string
    blocks: number
    used: number
    available: number
    capacity: string
    mounted: string
}
// type UnPromisify<T> = T extends Promise<infer U> ? U : T
// type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
//     ? ElementType
//     : never
// export type Drive = ArrayElement<UnPromisify<ReturnType<typeof getDiskInfo>>>

export async function getDrives(): Promise<DriveInfoItem[]> {
    const res = await getDiskInfo()
    return res
}
