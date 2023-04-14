/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fse from "fs-extra"
import { rimraf } from "rimraf"
import { IoFile } from "./IoFile"

export namespace IoDir {
    export async function Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        const stat = await fse.stat(s)
        return stat.isDirectory()
    }
    export async function getSize(path: string, cache: DirSizeCache = {}): Promise<number> {
        if (cache[path] !== undefined) {
            return cache[path]
        }
        let size = 0
        try {
            const list = await IoFile.getChildren(path)
            for (const item of list) {
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
    export async function del(path: string) {
        return await rimraf(path, { glob: false })
    }
}

export type DirSizeCache = { [path: string]: number }

// export function rimrafAsync(pattern: string, options: rimraf.Options = {}): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//         rimraf(pattern, options, err => {
//             if (err) reject(err)
//             else resolve()
//         })
//     })
// }
