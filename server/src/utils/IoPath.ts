import * as path from "path"

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
