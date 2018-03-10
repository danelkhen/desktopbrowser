"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_info_1 = require("./utils/path-info");
const config_1 = require("./config");
const io_1 = require("./utils/io");
const child_process = require("child_process");
const rimraf = require("rimraf");
const trash = require("trash");
const os = require("os");
class FileService {
    constructor() {
        this.cache = {};
    }
    init() {
        console.log("SiteService init");
    }
    ListFiles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            //if (req.Path == null) {
            //    return {
            //        Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null },
            //        File: { Name: "", IsFolder: true },
            //        Files: this.GetHomeFiles(),
            //    };
            //}
            if (req.Path != null && req.Path.endsWith(":"))
                req.Path += "\\";
            let res = {
                Relatives: yield this.GetFileRelatives(req.Path),
                File: yield this.GetFile({ Path: req.Path }),
                Files: null,
            };
            if (res.File.IsFolder) {
                res.Files = yield this.GetFiles(req); //.toArray();
            }
            return res;
        });
    }
    GetFiles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.HideFiles && req.HideFolders)
                return [];
            //else if (!req.MixFilesAndFolders && !req.HideFiles && !req.HideFolders && !req.IsRecursive) {
            //    var folders = this.GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, false, true);
            //    var files = this.GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, true, false);
            //    folders = this.ApplyRequest(folders, req);
            //    files = this.ApplyRequest(files, req);
            //    var all = folders.concat(files);
            //    all = this.ApplyPaging(all, req);
            //    all = this.ApplyCaching(all);
            //    return all;
            //}
            //else {
            let files = yield this.GetFileAndOrFolders({ path: req.Path, searchPattern: req.SearchPattern, recursive: req.IsRecursive, files: !req.HideFiles, folders: !req.HideFolders });
            files = yield this.ApplyRequest(files, req);
            files = this.ApplyPaging(files, req);
            files = this.ApplyCaching(files);
            return files;
            //}
        });
    }
    ApplyCaching(files) {
        return files; //TODO: new CachedEnumerable<File>(files);
    }
    ApplyPaging(files, req) {
        if (req.skip != null)
            files = files.skip(req.skip);
        if (req.take != null)
            files = files.take(req.take + 1);
        return files;
    }
    GetFileRelatives(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (String.isNullOrEmpty(path))
                return { ParentFolder: null, NextSibling: null, PreviousSibling: null };
            var pathInfo = new path_info_1.PathInfo(path);
            var info = { ParentFolder: null, NextSibling: null, PreviousSibling: null };
            info.ParentFolder = yield this.GetFile({ Path: pathInfo.ParentPath.Value });
            let xxx = yield this.GetFileAndOrFolders({ path: info.ParentFolder.Path, files: false, folders: true });
            var parentFiles = xxx.where(t => t.IsFolder).orderBy(t => t.Name).toArray();
            var index = parentFiles.findIndex(t => t.Name.equalsIgnoreCase(pathInfo.Name));
            info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : null;
            info.PreviousSibling = index > 0 ? parentFiles[index - 1] : null;
            return info;
        });
    }
    GetFile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var path = req.Path;
            if (String.isNullOrEmpty(path))
                return /*new File*/ { IsFolder: true, Path: "", Name: "Home" };
            var absPath = new path_info_1.PathInfo(path).ToAbsolute();
            if (absPath.IsFile) {
                return this.ToFile(yield io_1.FileSystemInfo.create(absPath.Value));
            }
            else if ((yield absPath.IsDirectory) || absPath.IsRoot) {
                return this.ToFile(yield io_1.FileSystemInfo.create(absPath.Value));
            }
            return null;
        });
    }
    Execute(req) {
        var filename = req.Path;
        let process = child_process.exec(this.quote(filename));
    }
    Explore(req) {
        child_process.exec(`explorer ${this.quote(req.Path)}`);
    }
    quote(s) {
        return `\"${s}\"`;
    }
    Delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var path = req.Path;
            if (yield io_1.IoFile.Exists(path))
                yield io_1.IoFile.Delete(path);
            else if (yield io_1.IoDir.Exists(path)) {
                if (path.split('\\').length <= 2)
                    throw new Error("Delete protection, cannot delete path so short, should be at least depth of 3 levels or more");
                //IoDir.Delete(path, true);
                yield this.rimraf(path, { glob: false, maxBusyTries: null, emfileWait: null, disableGlob: null });
            }
        });
    }
    trash(req) {
        let path = req.Path;
        return trash([path]);
    }
    rimraf(pattern, options) {
        return new Promise((resolve, reject) => {
            rimraf(pattern, options, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    ApplyRequest(files, req) {
        return __awaiter(this, void 0, void 0, function* () {
            var calculatedFolderSize = false;
            if (!req.ShowHiddenFiles)
                files = files.where(t => !t.IsHidden);
            if (req.HideFolders)
                files = files.where(t => !t.IsFolder);
            if (req.HideFiles)
                files = files.where(t => t.IsFolder);
            if (req.Sort != null && req.Sort.Columns != null) {
                for (let t of req.Sort.Columns) {
                    //req.Sort.Columns.forEach(t => {
                    if (t.Name == "Name")
                        files = this.OrderBy(files, x => x.Name, t.Descending);
                    else if (t.Name == "Modified")
                        files = this.OrderBy(files, x => x.Modified, t.Descending);
                    else if (t.Name == "Extension")
                        files = this.OrderBy(files, x => x.Extension, t.Descending);
                    else if (t.Name == "Size") {
                        if (req.FolderSize && !req.HideFolders) {
                            files = yield this.CalculateFoldersSize(files);
                            calculatedFolderSize = true;
                        }
                        files = this.OrderBy(files, x => x.Size, t.Descending);
                    }
                    if (t.Descending)
                        files.reverse();
                } //);
            }
            if (!calculatedFolderSize && req.FolderSize && !req.HideFolders)
                files = yield this.CalculateFoldersSize(files);
            return files;
        });
    }
    GetFileAndOrFolders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let { path, searchPattern, recursive, files, folders } = req;
            //: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean
            var isFiltered = false;
            let files2;
            if (String.isNullOrEmpty(path) && !this.isWindows())
                path = "/";
            if (String.isNullOrEmpty(path)) {
                files2 = this.GetHomeFiles();
            }
            else if (!files && !folders)
                files2 = [];
            else if (recursive) {
                var dir = yield io_1.FileSystemInfo.create(path);
                files2 = (yield dir.EnumerateFileSystemElementsRecursive()).select(t => this.ToFile(t));
            }
            else {
                var dir = yield io_1.FileSystemInfo.create(path);
                if (files && !folders)
                    files2 = (yield dir.EnumerateFiles()).select(t => this.ToFile(t));
                else if (folders && !files)
                    files2 = (yield dir.EnumerateDirectories()).select(t => this.ToFile(t));
                else if (folders && files)
                    files2 = (yield dir.GetFileSystemInfos()).select(t => this.ToFile(t));
                else
                    throw new Error();
                isFiltered = true;
            }
            if (!isFiltered) {
                if (!files)
                    files2 = files2.where(t => t.IsFolder);
                else if (!folders)
                    files2 = files2.where(t => !t.IsFolder);
            }
            return files2;
        });
    }
    isWindows() {
        return os.platform() == "win32";
    }
    GetHomeFiles() {
        var config = this.GetConfig();
        if (config != null && config.HomePage != null)
            return config.HomePage.Files;
        return io_1.DriveInfo.GetDrives().select(t => /*new File*/ ({ IsFolder: true, Name: t.Name, Path: t.Name, Size: t.IsReady ? parseInt(t.AvailableFreeSpace) : null })).toArray();
    }
    CalculateFoldersSize(folders) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            for (let file of folders) {
                try {
                    //console.log("CalculateFoldersSize", file);
                    if (file.IsFolder)
                        file.Size = yield this.CalculateFolderSize(file.Path);
                }
                catch (e) {
                }
                list.push(file);
            }
            return list;
            ////console.log("CalculateFoldersSize", folders.length);
            //let x = await folders.map(file => {
            //    try {
            //        //console.log("CalculateFoldersSize", file);
            //        if (file.IsFolder)
            //            file.Size = await this.CalculateFolderSize(file.Path);
            //    }
            //    catch (e) {
            //    }
            //    return file;
            //});
            //return x;
        });
    }
    CalculateFolderSize(path) {
        return this.CacheMethod(`CalculateFolderSize(${path})`, 100, 100, () => this.CalculateFolderSizeNoCache(path));
    }
    OrderBy(source, keySelector, desc) {
        var source2 = source;
        if (source2 != null) {
            if (desc)
                return source2.ThenByDescending(keySelector);
            return source2.ThenBy(keySelector);
        }
        else {
            if (desc)
                return source.OrderByDescending(keySelector);
            return source.OrderBy(keySelector);
        }
    }
    CalculateFolderSizeNoCache(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var size = 0;
            try {
                var list = yield (yield io_1.FileSystemInfo.create(path)).GetFileSystemInfos();
                for (let item of list) {
                    if (item.isFile)
                        size += item.Length;
                    else if (item.isDir)
                        size += yield this.CalculateFolderSize(item.FullName);
                }
            }
            catch (e) {
                console.log("CalculateFolderSizeNoCache catch", path, e);
            }
            //console.log("CalculateFolderSizeNoCache", path, size);
            return size;
        });
    }
    GetConfig() {
        return this.GetConfigNoCache();
        //return this.CacheMethod("GetConfig()", 10, 0, this.GetConfigNoCache);
    }
    GetConfigNoCache() {
        return config_1.SiteConfiguration.Load();
    }
    ToFile(file) {
        var file2 = {
            type: null,
            Name: file.Name,
            IsFolder: file.isDir,
            Modified: file.LastWriteTime != null ? file.LastWriteTime.ToDefaultString() : null,
            Size: file.isFile ? file.Length : null,
            IsHidden: file.Attributes.HasFlag(io_1.FileAttributes.Hidden),
            Extension: file != null ? file.Extension : null,
        };
        if (file.isDir)
            file2.type = "folder";
        else if (file.isFile)
            file2.type = "file";
        else if (file.isLink)
            file2.type = "link";
        try {
            file2.Path = file.FullName;
        }
        catch (e) {
        }
        return file2;
    }
    AddToHome(file) {
        var config = config_1.SiteConfiguration.Load();
        if (config.HomePage == null)
            config.HomePage = new config_1.Page();
        var file2 = config.HomePage.Files.where(t => t.Name.equalsIgnoreCase(file.Name)).first();
        if (file2 != null)
            config.HomePage.Files.remove(file2);
        config.HomePage.Files.add(file);
        config.Save();
    }
    //TODO: [DllImport("user32.dll")]
    /* static extern */ SetForegroundWindow(hWnd /*IntPtr*/) {
        return false;
    }
    /// <summary>
    /// Executes the specified Func[R] with cache
    /// </summary>
    /// <typeparam name="R"></typeparam>
    /// <param name="cacheKey"></param>
    /// <param name="method"></param>
    /// <returns></returns>
    CacheMethod(cacheKey, expirationInSeconds, methodMinTimeInMs, method) {
        if (expirationInSeconds <= 0)
            return method();
        let cache = this.cache;
        var cacheValue = cache[cacheKey];
        if (cacheValue !== undefined) {
            return cacheValue;
        }
        var stopper = new Stopwatch();
        stopper.Start();
        var x = method();
        stopper.Stop();
        if (methodMinTimeInMs <= 0 || stopper.ElapsedMilliseconds > methodMinTimeInMs) {
            cacheValue = x;
            cache[cacheKey] = cacheValue;
            setTimeout(() => this.clearCache(), 60 * 1000);
        }
        return x;
    }
    clearCache() {
        this.cache = {};
    }
    GetFilesStreaming(req) {
        return __asyncGenerator(this, arguments, function* GetFilesStreaming_1() {
            if (req.HideFiles && req.HideFolders)
                return;
            //else if (!req.MixFilesAndFolders && !req.HideFiles && !req.HideFolders && !req.IsRecursive) {
            //    var folders = this.GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, false, true);
            //    var files = this.GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, true, false);
            //    folders = this.ApplyRequest(folders, req);
            //    files = this.ApplyRequest(files, req);
            //    var all = folders.concat(files);
            //    all = this.ApplyPaging(all, req);
            //    all = this.ApplyCaching(all);
            //    return all;
            //}
            //else {
            let files = yield __await(this.GetFileAndOrFolders({ path: req.Path, searchPattern: req.SearchPattern, recursive: req.IsRecursive, files: !req.HideFiles, folders: !req.HideFolders }));
            files = yield __await(this.ApplyRequest(files, req));
            files = this.ApplyPaging(files, req);
            files = this.ApplyCaching(files);
            return files;
            //}
        });
    }
}
exports.FileService = FileService;
class Stopwatch {
    Start() { }
    Stop() { }
}
exports.Stopwatch = Stopwatch;
