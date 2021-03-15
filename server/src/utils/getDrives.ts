import { DiskInfoItem } from "diskinfo"

export async function getDrives(): Promise<DiskInfoItem[]> {
    async function loadDiskInfoModule() {
        try {
            const mod = await import("diskinfo")
            return mod
        } catch (err) {}
    }
    const mod = await loadDiskInfoModule()
    if (!mod) {
        return [{ filesystem: "", blocks: 0, available: 0, used: 0, capacity: 0, mounted: "/" }]
    }
    const res = await new Promise<DiskInfoItem[]>((resolve, reject) => {
        mod.getDrives((err, list) => {
            console.log("getDrives", err, list)
            if (err) {
                return reject(err)
            }
            resolve(list)
        })
    })
    return res
}
