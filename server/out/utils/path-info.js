"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_1 = require("./io");
class PathInfo {
    constructor(path) {
        this.Value = path;
    }
    get IsRoot() {
        if (this.IsEmpty)
            return false;
        var abs = this.ToAbsolute();
        return io_1.IoPath.GetPathRoot(abs.Value) == abs.Value;
    }
    get IsEmpty() {
        return String.isNullOrEmpty(this.Value);
    }
    Combine(path) {
        if (typeof (path) == "string") {
            if (this.IsEmpty)
                return new PathInfo(path);
            return new PathInfo(io_1.IoPath.Combine(this.Value, path));
        }
        return this.Combine(path.Value);
    }
    ToAbsolute() {
        if (this.IsEmpty)
            return this;
        if (io_1.IoPath.IsPathRooted(this.Value))
            return this;
        return new PathInfo(io_1.IoPath.GetFullPath(this.Value));
    }
    async ToAbsoluteExact() {
        if (this.IsEmpty)
            return this;
        return new PathInfo((await io_1.FileSystemInfo.create(this.Value)).FullName);
    }
    toString() {
        return this.Value;
    }
    get IsFile() {
        return io_1.IoFile.Exists(this.Value);
    }
    get IsDirectory() {
        return io_1.IoDir.Exists(this.Value);
    }
    get ParentPath() {
        if (this.IsEmpty)
            return this;
        if (this.IsRoot)
            return new PathInfo("");
        var x = this.Value;
        if (x.endsWith("\\"))
            x = x.removeLast(1);
        return new PathInfo(io_1.IoPath.GetDirectoryName(x));
    }
    get Name() {
        if (this.IsRoot)
            return this.Value;
        return io_1.IoPath.GetFileName(this.Value);
    }
    get Extension() {
        return io_1.IoPath.GetExtension(this.Value);
    }
}
exports.PathInfo = PathInfo;
