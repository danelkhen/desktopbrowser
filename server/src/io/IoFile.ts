/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fse from "fs-extra"
import * as path from "path"

export interface IoFile {
    stats?: fse.Stats
    path: string
    isLink?: boolean
    isFile?: boolean
    isDir?: boolean
    Name: string
    LastWriteTime?: Date
    FullName?: string
    Length?: number
    Extension?: string
}
export namespace IoFile {
    export async function getChildren(path2: string): Promise<IoFile[]> {
        const list = await fse.readdir(path2)
        const list2: IoFile[] = []
        for (const t of list) {
            list2.push(await get(path.join(path2, t)))
        }
        return list2
    }

    export async function getDescendants(path2: string): Promise<IoFile[]> {
        const list = await getChildren(path2)
        let i = 0
        while (i < list.length) {
            const file = list[i]
            if (file.isDir) {
                const list2 = await getChildren(file.path)
                list.push(...list2)
            }
            i++
        }
        return list
    }

    export async function get(path2: string): Promise<IoFile> {
        if (path2 == null) {
            return {} as any // TODO:
        }
        const FullName = path.resolve(path2)
        const Name = path.basename(path2)
        const Extension = path.extname(path2)
        const x: IoFile = {
            path: path2,
            FullName,
            Name,
            Extension,
        }
        try {
            x.stats = await fse.lstatSync(path2)
            x.Length = x.stats.size
            x.isFile = x.stats.isFile()
            x.isDir = x.stats.isDirectory()
            x.LastWriteTime = x.stats.mtime
            x.isLink = x.stats.isSymbolicLink()
        } catch (e) {}
        if (x.Name == null || x.Name == "") {
            x.Name = path2
        }
        return x
    }
    export async function Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        const stat = await fse.stat(s)
        return stat.isFile()
    }
    export async function Delete(s: string): Promise<boolean> {
        await fse.unlink(s)
        return true
    }
}
