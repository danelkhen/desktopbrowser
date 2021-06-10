import * as fse from "fs-extra"
import { IoFile } from "./IoFile"

export namespace IoDir {
    export async function Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        let stat = await fse.stat(s)
        return stat.isDirectory()
    }
    export async function getSize(path: string, cache: DirSizeCache = {}): Promise<number> {
        if (cache[path] !== undefined) {
            return cache[path]
        }
        let size = 0
        try {
            const list = await IoFile.getChildren(path)
            for (let item of list) {
                if (item.isFile) {
                    size += item.Length!
                } else if (item.isDir) {
                    const dirSize = await getSize(item.FullName!, cache)
                    size += dirSize
                }
            }
        } catch (e) {
            console.log("IoDir.getSize() error", path, e)
        }
        cache[path] = size
        return size
    }
}

export type DirSizeCache = { [path: string]: number }
