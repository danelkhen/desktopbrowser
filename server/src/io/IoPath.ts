/* eslint-disable @typescript-eslint/no-unused-vars */
import * as path from "path"
import { removeLast } from "../shared/removeLast"
import { IoFile } from "./IoFile"
import { IoDir } from "./IoDir"

export class IoPath {
    static GetDirectoryName(path2: string): string {
        return path.dirname(path2)
    }
    static Combine(...args: string[]): string {
        throw new Error()
    }
    static GetFileName(s: string): string {
        return path.basename(s)
    }
    static GetFullPath(s: string): string {
        throw new Error()
    }
    static IsPathRooted(s: string): boolean {
        return path.isAbsolute(s)
    }
    static GetExtension(s: string): string {
        throw new Error()
    }
    static GetPathRoot(s: string): string | null {
        const max = 1000
        let i = 0
        let s2 = path.dirname(s)
        do {
            i++
            s2 = path.dirname(s2)
            const s3 = path.dirname(s2)
            if (s2 == s3) return s2
        } while (i < 100)
        return null
    }
    Value: string

    constructor(path: string) {
        this.Value = path
    }

    get IsRoot(): boolean {
        if (this.IsEmpty) return false
        const abs = this.ToAbsolute()
        return IoPath.GetPathRoot(abs.Value) == abs.Value
    }
    get IsEmpty(): boolean {
        return !this.Value
    }
    Combine(path: IoPath | string): IoPath {
        if (typeof path == "string") {
            if (this.IsEmpty) return new IoPath(path)
            return new IoPath(IoPath.Combine(this.Value, path))
        }
        return this.Combine(path.Value)
    }

    ToAbsolute(): IoPath {
        if (this.IsEmpty) return this
        if (IoPath.IsPathRooted(this.Value)) return this
        return new IoPath(IoPath.GetFullPath(this.Value))
    }
    async ToAbsoluteExact(): Promise<IoPath> {
        if (this.IsEmpty) return this
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return new IoPath((await IoFile.get(this.Value)).FullName!)
    }

    toString(): string {
        return this.Value
    }

    get IsFile(): Promise<boolean | undefined> {
        return IoFile.Exists(this.Value)
    }
    get IsDirectory(): Promise<boolean | undefined> {
        return IoDir.Exists(this.Value)
    }
    get ParentPath(): IoPath {
        if (this.IsEmpty) return this
        if (this.IsRoot) return new IoPath("")
        let x = this.Value
        if (x.endsWith("\\")) x = removeLast(x, 1)
        return new IoPath(IoPath.GetDirectoryName(x))
    }

    get Name(): string {
        if (this.IsRoot) return this.Value
        return IoPath.GetFileName(this.Value)
    }

    get Extension(): string {
        return IoPath.GetExtension(this.Value)
    }
}
