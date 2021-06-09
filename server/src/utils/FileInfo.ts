import * as fse from "fs-extra"
import * as path from "path"

export interface FsInfo {
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
export namespace FsInfo {
    export async function getChildren(path2: string): Promise<FsInfo[]> {
        let list = await fse.readdir(path2)
        let list2: FsInfo[] = []
        for (let t of list) {
            list2.push(await create(path.join(path2, t)))
        }
        return list2
    }

    export async function getDescendants(path2: string): Promise<FsInfo[]> {
        let list = await getChildren(path2)
        let i = 0
        while (i < list.length) {
            let file = list[i]
            if (file.isDir) {
                let list2 = await getChildren(file.path)
                list.push(...list2)
            }
            i++
        }
        return list
    }

    export async function create(path2: string): Promise<FsInfo> {
        if (path2 == null) {
            return {} as any // TODO:
        }
        const FullName = path.resolve(path2)
        const Name = path.basename(path2)
        const Extension = path.extname(path2)
        const x: FsInfo = {
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
}
