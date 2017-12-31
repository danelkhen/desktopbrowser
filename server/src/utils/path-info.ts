import {IoFile, IoDir, IoPath, FileSystemInfo } from "./io"

export class PathInfo {
    Value: string;

    constructor(path: string) {
        this.Value = path;
    }

    get IsRoot(): boolean {
        if (this.IsEmpty)
            return false;
        var abs = this.ToAbsolute();
        return IoPath.GetPathRoot(abs.Value) == abs.Value;
    }
    get IsEmpty(): boolean {
        return String.isNullOrEmpty(this.Value);
    }
    Combine(path: PathInfo | string): PathInfo {
        if (typeof (path) == "string") {
            if (this.IsEmpty)
                return new PathInfo(path);
            return new PathInfo(IoPath.Combine(this.Value, path));
        }
        return this.Combine(path.Value);
    }

    ToAbsolute(): PathInfo {
        if (this.IsEmpty)
            return this;
        if (IoPath.IsPathRooted(this.Value))
            return this;
        return new PathInfo(IoPath.GetFullPath(this.Value));
    }
    async ToAbsoluteExact(): Promise<PathInfo> {
        if (this.IsEmpty)
            return this;
        return new PathInfo((await FileSystemInfo.create(this.Value)).FullName);
    }

    toString(): string {
        return this.Value;
    }

    get IsFile(): Promise<boolean> {
        return IoFile.Exists(this.Value);
    }
    get IsDirectory(): Promise<boolean> {
        return IoDir.Exists(this.Value);
    }
    get ParentPath(): PathInfo {
        if (this.IsEmpty)
            return this;
        if (this.IsRoot)
            return new PathInfo("");
        var x = this.Value;
        if (x.endsWith("\\"))
            x = x.removeLast(1);
        return new PathInfo(IoPath.GetDirectoryName(x));
    }

    get Name(): string {
        if (this.IsRoot)
            return this.Value;
        return IoPath.GetFileName(this.Value);
    }


    get Extension(): string {
        return IoPath.GetExtension(this.Value);
    }
}
