import { HasKey, KeyValueService as KeyValueServiceContract, ListFilesRequest, ListFilesResponse, File, FileRelativesInfo, PathRequest, IEnumerable, IOrderedEnumerable, DbService as DbServiceContract, ByFilename as ByFilenameContract, FileService as FileServiceContract,  } from "contracts"
import { PathInfo } from "./utils/path-info"
import { SiteConfiguration, Page } from "./config"
import * as fs from "fs";
import { IoFile, IoDir, IoPath, DriveInfo, FileSystemInfo, FileAttributes, } from "./utils/io"
import * as child_process from "child_process"
import * as omdb from 'imdb-api';
//import XMLHttpRequest = require('xhr2');
import * as rimraf from "rimraf";
import * as trash from 'trash';
import * as path from "path";
//import { KeyValueStorage, Bucket } from "./db";
import * as os from "os";
import { Db, ByFilename, KeyValue } from "./db2";
import { FindOptions, Repository } from "typeorm"
import { ByFilenameService } from "./service"
import { KeyValueService } from "./key-value-service"


export class FileService implements FileServiceContract {
    init(): Promise<any> {
        console.log("SiteService init");
        this.byFilename = new ByFilenameService();
        this.keyValue = new KeyValueService();
        return Promise.all([this.byFilename.init(), this.keyValue.init()]);
    }
    keyValue: KeyValueService;
    byFilename: ByFilenameService;
    baseDbFilename: string;

    ListFiles(req: ListFilesRequest): ListFilesResponse {
        //if (req.Path == null) {
        //    return {
        //        Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null },
        //        File: { Name: "", IsFolder: true },
        //        Files: this.GetHomeFiles(),
        //    };
        //}
        if (req.Path != null && req.Path.endsWith(":"))
            req.Path += "\\";
        var res: ListFilesResponse =
            {
                Relatives: this.GetFileRelatives(req.Path),
                File: this.GetFile({ Path: req.Path }),
                Files: null,
            };
        if (res.File.IsFolder) {
            res.Files = this.GetFiles(req).toArray();
        }
        return res;
    }

    public GetFiles(req: ListFilesRequest): File[] {
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
        var files = this.GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, !req.HideFiles, !req.HideFolders);
        files = this.ApplyRequest(files, req);
        files = this.ApplyPaging(files, req);
        files = this.ApplyCaching(files);
        return files;
        //}
    }

    private ApplyCaching(files: IEnumerable<File>): IEnumerable<File> {
        return files;//TODO: new CachedEnumerable<File>(files);
    }

    private ApplyPaging(files: IEnumerable<File>, req: ListFilesRequest): IEnumerable<File> {
        if (req.skip != null)
            files = files.skip(req.skip);
        if (req.take != null)
            files = files.take(req.take + 1);
        return files;
    }

    public GetFileRelatives(path: string): FileRelativesInfo {
        if (String.isNullOrEmpty(path))
            return { ParentFolder: null, NextSibling: null, PreviousSibling: null };
        var pathInfo = new PathInfo(path);
        var info: FileRelativesInfo = { ParentFolder: null, NextSibling: null, PreviousSibling: null };
        info.ParentFolder = this.GetFile({ Path: pathInfo.ParentPath.Value });
        var parentFiles = this.GetFileAndOrFolders(info.ParentFolder.Path, null, false, false, true).where(t => t.IsFolder).orderBy(t => t.Name).toArray();
        var index = parentFiles.findIndex(t => t.Name.equalsIgnoreCase(pathInfo.Name));
        info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : null;
        info.PreviousSibling = index > 0 ? parentFiles[index - 1] : null;
        return info;
    }

    public GetFile(req: PathRequest): File {
        var path = req.Path;
        if (String.isNullOrEmpty(path))
            return /*new File*/ { IsFolder: true, Path: "", Name: "Home" };
        var absPath = new PathInfo(path).ToAbsolute();
        if (absPath.IsFile) {
            return this.ToFile(new FileSystemInfo(absPath.Value));
        }
        else if (absPath.IsDirectory || absPath.IsRoot) {
            return this.ToFile(new FileSystemInfo(absPath.Value));
        }
        return null;
    }

    public Execute(req: PathRequest): void {
        var filename = req.Path;
        let process = child_process.exec(this.quote(filename));
    }

    public Explore(req: PathRequest): void {
        child_process.exec(`explorer ${this.quote(req.Path)}`);
    }

    quote(s: string): string {
        return `\"${s}\"`;
    }


    Delete(req: PathRequest): Promise<any> {
        var path = req.Path;
        if (IoFile.Exists(path))
            IoFile.Delete(path);
        else if (IoDir.Exists(path)) {
            if (path.split('\\').length <= 2)
                throw new Error("Delete protection, cannot delete path so short, should be at least depth of 3 levels or more");
            //IoDir.Delete(path, true);
            return this.rimraf(path, { glob: false, maxBusyTries: null, emfileWait: null, disableGlob: null });
        }
        return Promise.resolve();
    }

    trash(req: PathRequest): Promise<any> {
        let path = req.Path;
        return trash([path]);
    }

    rimraf(pattern: string, options?: rimraf.Options) {
        return new Promise((resolve, reject) => {
            rimraf(pattern, options, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });

    }



    ApplyRequest(files: IEnumerable<File>, req: ListFilesRequest): IEnumerable<File> {
        var calculatedFolderSize = false;
        if (!req.ShowHiddenFiles)
            files = files.where(t => !t.IsHidden);
        if (req.HideFolders)
            files = files.where(t => !t.IsFolder);
        if (req.HideFiles)
            files = files.where(t => t.IsFolder);
        if (req.Sort != null && req.Sort.Columns != null) {
            req.Sort.Columns.forEach(t => {
                if (t.Name == "Name")
                    files = this.OrderBy(files, x => x.Name, t.Descending);
                else if (t.Name == "Modified")
                    files = this.OrderBy(files, x => x.Modified, t.Descending);
                else if (t.Name == "Extension")
                    files = this.OrderBy(files, x => x.Extension, t.Descending);
                else if (t.Name == "Size") {
                    if (req.FolderSize && !req.HideFolders) {
                        files = this.CalculateFoldersSize(files);
                        calculatedFolderSize = true;
                    }
                    files = this.OrderBy(files, x => x.Size, t.Descending);
                }
                if (t.Descending)
                    files.reverse();
            });
        }
        if (!calculatedFolderSize && req.FolderSize && !req.HideFolders)
            files = this.CalculateFoldersSize(files);
        return files;

    }

    GetFileAndOrFolders(path: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean): IEnumerable<File> {
        var isFiltered = false;
        let files2: IEnumerable<File>;
        if (String.isNullOrEmpty(path) && !this.isWindows())
            path = "/";
        if (String.isNullOrEmpty(path)) {
            files2 = this.GetHomeFiles();
        }
        else if (!files && !folders)
            files2 = [];
        //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
        //if (searchPattern.IsNullOrEmpty())
        //    searchPattern = "*";
        else if (recursive) {
            var dir = new FileSystemInfo(path);
            files2 = dir.EnumerateFileSystemElementsRecursive().select(t => this.ToFile(t));
        }
        else {
            var dir = new FileSystemInfo(path);
            if (files && !folders)
                files2 = dir.EnumerateFiles().select(t => this.ToFile(t));
            else if (folders && !files)
                files2 = dir.EnumerateDirectories().select(t => this.ToFile(t));
            else if (folders && files)
                files2 = dir.EnumerateFileSystemInfos().select(t => this.ToFile(t));
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
    }

    isWindows() {
        return os.platform() == "win32";
    }
    GetHomeFiles(): File[] {
        var config = this.GetConfig();
        if (config != null && config.HomePage != null)
            return config.HomePage.Files;
        return DriveInfo.GetDrives().select(t => /*new File*/({ IsFolder: true, Name: t.Name, Path: t.Name, Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : null })).toArray();
    }

    CalculateFoldersSize(folders: File[]): IEnumerable<File> {
        //console.log("CalculateFoldersSize", folders.length);
        return folders.map(file => {
            try {
                //console.log("CalculateFoldersSize", file);
                if (file.IsFolder)
                    file.Size = this.CalculateFolderSize(file.Path);
            }
            catch (e) {
            }
            return file;
        });
    }
    CalculateFolderSize(path: string): number {
        return this.CacheMethod(`CalculateFolderSize(${path})`, 100, 100, () => this.CalculateFolderSizeNoCache(path));
    }

    OrderBy<TSource, TKey>(source: IEnumerable<TSource>, keySelector: JsFunc1<TSource, TKey>, desc: boolean): IOrderedEnumerable<TSource> {
        var source2 = <IOrderedEnumerable<TSource>><any>source;
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


    CalculateFolderSizeNoCache(path: string): number {
        var size = 0;
        try {
            var list = new FileSystemInfo(path).GetFileSystemInfos();
            for (var item of list) {
                if (item.isFile)
                    size += item.Length;
                else if (item.isDir)
                    size += this.CalculateFolderSize(item.FullName);
            }
        }
        catch (e) {
            console.log("CalculateFolderSizeNoCache catch", path, e);
        }
        //console.log("CalculateFolderSizeNoCache", path, size);
        return size;
    }

    GetConfig(): SiteConfiguration {
        return this.CacheMethod("GetConfig()", 10, 0, this.GetConfigNoCache);
    }

    GetConfigNoCache(): SiteConfiguration {
        return SiteConfiguration.Load();
    }

    ToFile(file: FileSystemInfo): File {
        var file2: File = {
            type: null,
            Name: file.Name,
            IsFolder: file.isDir,
            Modified: file.LastWriteTime != null ? file.LastWriteTime.ToDefaultString() : null,
            Size: file.isFile ? file.Length : null,
            IsHidden: file.Attributes.HasFlag(FileAttributes.Hidden),
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

    AddToHome(file: File): void {
        var config = SiteConfiguration.Load();
        if (config.HomePage == null)
            config.HomePage = new Page();
        var file2 = config.HomePage.Files.where(t => t.Name.equalsIgnoreCase(file.Name)).first();
        if (file2 != null)
            config.HomePage.Files.remove(file2);
        config.HomePage.Files.add(file);
        config.Save();
    }


    //TODO: [DllImport("user32.dll")]
   /* static extern */SetForegroundWindow(hWnd: any/*IntPtr*/): boolean {
        return false;
    }

    cache: any = {};
    /// <summary>
    /// Executes the specified Func[R] with cache
    /// </summary>
    /// <typeparam name="R"></typeparam>
    /// <param name="cacheKey"></param>
    /// <param name="method"></param>
    /// <returns></returns>
    CacheMethod<R>(cacheKey: string, expirationInSeconds: number, methodMinTimeInMs: number, method: JsFunc<R>): R {
        if (expirationInSeconds <= 0)
            return method();
        let cache = this.cache;
        var cacheValue = cache[cacheKey];
        if (cacheValue !== undefined) {
            return <R>cacheValue;
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



}

export class Stopwatch {
    Start() { }
    Stop() { }
    ElapsedMilliseconds: number;
}
