﻿import * as child_process from "child_process"
import * as C from "../../shared/src/contracts"
import {
    File,
    FileRelativesInfo,
    IEnumerable,
    IOrderedEnumerable,
    ListFilesRequest,
    ListFilesResponse,
    PathRequest,
} from "../../shared/src/contracts"
import * as os from "os"
import rimraf from "rimraf"
import { equalsIgnoreCase } from "../../shared/src"
import trash from "trash"
import { dateToDefaultString } from "./utils"
import { FileAttributes, FileSystemInfo, IoDir, IoFile, DriveInfo } from "./utils/io"
import { orderBy } from "./utils/orderBy"
import { PathInfo } from "./utils/PathInfo"
import open from "open"
import { LevelDb } from "./LevelDb"
import { Db } from "./db"
import { GetFileAndFoldersRequest, Stopwatch } from "./GetFileAndFoldersRequest"
import { calculateFoldersSize } from "./calculateFoldersSize"

function isWindows() {
    return os.platform() == "win32"
}

export class FileService
    implements Omit<C.FileService, "getAllFilesMetadata" | "saveFileMetadata" | "deleteFileMetadata"> {
    constructor(public db: LevelDb) {}
    baseDbFilename: string = undefined!

    async ListFiles(req: ListFilesRequest): Promise<ListFilesResponse> {
        //if (req.Path == null) {
        //    return {
        //        Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null },
        //        File: { Name: "", IsFolder: true },
        //        Files: this.GetHomeFiles(),
        //    };
        //}
        if (req.Path != null && req.Path.endsWith(":")) req.Path += "\\"
        let res: ListFilesResponse = {
            Relatives: await this.GetFileRelatives(req.Path!),
            File: await this.GetFile({ Path: req.Path! }),
            // Files: null,
        }
        if (res.File!.IsFolder) {
            res.Files = await this.GetFiles(req) //.toArray();
        }
        return res
    }

    async GetFiles(req: ListFilesRequest): Promise<File[]> {
        if (req.HideFiles && req.HideFolders) return []
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
        let files = await this.GetFileAndOrFolders({
            path: req.Path!,
            searchPattern: req.SearchPattern,
            recursive: req.IsRecursive,
            files: !req.HideFiles,
            folders: !req.HideFolders,
        })
        files = await this.ApplyRequest(files, req)
        files = this.ApplyPaging(files, req)
        files = this.ApplyCaching(files)
        return files
        //}
    }

    private ApplyCaching(files: IEnumerable<File>): IEnumerable<File> {
        return files //TODO: new CachedEnumerable<File>(files);
    }

    private ApplyPaging(files: IEnumerable<File>, req: ListFilesRequest): IEnumerable<File> {
        if (req.skip != null) files = files.slice(req.skip)
        if (req.take != null) files = files.slice(0, req.take + 1)
        return files
    }

    async GetFileRelatives(path: string): Promise<FileRelativesInfo> {
        if (!path) return {}
        var pathInfo = new PathInfo(path)
        var info: FileRelativesInfo = {}
        info.ParentFolder = await this.GetFile({ Path: pathInfo.ParentPath.Value })
        let xxx = await this.GetFileAndOrFolders({ path: info.ParentFolder.Path!, files: false, folders: true })
        var parentFiles = xxx.filter(t => t.IsFolder)[orderBy](t => t.Name)

        var index = parentFiles.findIndex(t => t.Name[equalsIgnoreCase](pathInfo.Name))
        info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
        info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
        return info
    }

    async GetFile(req: PathRequest): Promise<File> {
        var path = req.Path
        if (!path) return /*new File*/ { IsFolder: true, Path: "", Name: "Home" }
        var absPath = new PathInfo(path).ToAbsolute()
        if (await absPath.IsFile) {
            return this.ToFile(await FileSystemInfo.create(absPath.Value))
        } else if ((await absPath.IsDirectory) || absPath.IsRoot) {
            return this.ToFile(await FileSystemInfo.create(absPath.Value))
        }
        return null!
    }

    public async Execute(req: PathRequest) {
        var filename = req.Path
        const p = await open(filename)
    }

    public Explore(req: PathRequest): void {
        const cmd = os.platform() === "darwin" ? "open" : "explorer"
        child_process.exec(`${cmd} ${this.quote(req.Path)}`)
    }

    quote(s: string): string {
        return `\"${s}\"`
    }

    async Delete(req: PathRequest): Promise<void> {
        const path = req.Path
        if (await IoFile.Exists(path)) {
            await IoFile.Delete(path)
            return
        }
        if (await IoDir.Exists(path)) {
            if (path.split("\\").length <= 2)
                throw new Error(
                    "Delete protection, cannot delete path so short, should be at least depth of 3 levels or more"
                )
            //IoDir.Delete(path, true);
            await this.rimraf(path, { glob: false })
        }
    }

    async trash(req: PathRequest): Promise<void> {
        console.log("Trash 1")

        let path = req.Path
        await trash([path])
    }

    rimraf(pattern: string, options: rimraf.Options = {}) {
        return new Promise<void>((resolve, reject) => {
            rimraf(pattern, options, err => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

    async ApplyRequest(files: IEnumerable<File>, req: ListFilesRequest): Promise<IEnumerable<File>> {
        var calculatedFolderSize = false
        if (!req.ShowHiddenFiles) files = files.filter(t => !t.IsHidden)
        if (req.HideFolders) files = files.filter(t => !t.IsFolder)
        if (req.HideFiles) files = files.filter(t => t.IsFolder)
        if (req.Sort != null && req.Sort.Columns != null) {
            for (let t of req.Sort.Columns) {
                //req.Sort.Columns.forEach(t => {
                if (t.Name == "Name") files = this.OrderBy(files, x => x.Name, t.Descending!)
                else if (t.Name == "Modified") files = this.OrderBy(files, x => x.Modified, t.Descending!)
                else if (t.Name == "Extension") files = this.OrderBy(files, x => x.Extension, t.Descending!)
                else if (t.Name == "Size") {
                    if (req.FolderSize && !req.HideFolders) {
                        files = await calculateFoldersSize(files)
                        calculatedFolderSize = true
                    }
                    files = this.OrderBy(files, x => x.Size, t.Descending!)
                }
                if (t.Descending) files.reverse()
            } //);
        }
        if (!calculatedFolderSize && req.FolderSize && !req.HideFolders) files = await calculateFoldersSize(files)
        return files
    }

    async GetFileAndOrFolders(req: GetFileAndFoldersRequest): Promise<IEnumerable<File>> {
        let { path, searchPattern, recursive, files, folders } = req
        //: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean
        var isFiltered = false
        let files2: IEnumerable<File>
        if (!path && !isWindows()) path = "/"
        if (!path) {
            files2 = await this.GetHomeFiles()
        } else if (!files && !folders) files2 = []
        //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
        //if (searchPattern.IsNullOrEmpty())
        //    searchPattern = "*";
        else if (recursive) {
            var dir = await FileSystemInfo.create(path)
            files2 = (await dir.EnumerateFileSystemElementsRecursive()).map(t => this.ToFile(t))
        } else {
            var dir = await FileSystemInfo.create(path)
            if (files && !folders) files2 = (await dir.EnumerateFiles()).map(t => this.ToFile(t))
            else if (folders && !files) files2 = (await dir.EnumerateDirectories()).map(t => this.ToFile(t))
            else if (folders && files) files2 = (await dir.GetFileSystemInfos()).map(t => this.ToFile(t))
            else throw new Error()
            isFiltered = true
        }
        if (!isFiltered) {
            if (!files) files2 = files2.filter(t => t.IsFolder)
            else if (!folders) files2 = files2.filter(t => !t.IsFolder)
        }
        return files2
    }

    async isWindows() {
        return os.platform() == "win32"
    }
    async GetHomeFiles(): Promise<File[]> {
        const list = await DriveInfo.GetDrives3()
        return list.map(t => /*new File*/ ({
            IsFolder: true,
            Name: t.Name,
            Path: t.Name,
            Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : undefined,
        }))
    }

    OrderBy<TSource, TKey>(
        source: IEnumerable<TSource>,
        keySelector: (source: TSource) => TKey,
        desc: boolean
    ): IOrderedEnumerable<TSource> {
        const source2 = source as IOrderedEnumerable<TSource>
        if (source2) {
            if (desc) return source2.ThenByDescending!(keySelector)
            return source2.ThenBy!(keySelector)
        } else {
            if (desc) return source.OrderByDescending!(keySelector)
            return source.OrderBy!(keySelector)
        }
    }

    // GetConfig(): SiteConfiguration {
    //     return this.GetConfigNoCache()
    //     //return this.CacheMethod("GetConfig()", 10, 0, this.GetConfigNoCache);
    // }

    // GetConfigNoCache(): SiteConfiguration {
    //     return SiteConfiguration.Load()
    // }

    ToFile(file: FileSystemInfo): File {
        var file2: File = {
            type: undefined,
            Name: file.Name,
            IsFolder: file.isDir,
            Modified: file.LastWriteTime != null ? dateToDefaultString(file.LastWriteTime) : undefined,
            Size: file.isFile ? file.Length : undefined,
            IsHidden: file?.Attributes?.HasFlag(FileAttributes.Hidden),
            Extension: file?.Extension,
        }
        if (file.isDir) file2.type = "folder"
        else if (file.isFile) file2.type = "file"
        else if (file.isLink) file2.type = "link"
        try {
            file2.Path = file.FullName
        } catch (e) {}
        return file2
    }

    // AddToHome(file: File): void {
    //     var config = SiteConfiguration.Load()
    //     if (config.HomePage == null) config.HomePage = new Page()
    //     var file2 = config.HomePage.Files.filter(t => t.Name[equalsIgnoreCase](file.Name))[0]
    //     if (file2 != null) {
    //         config.HomePage.Files[remove](file2)
    //     }
    //     config.HomePage.Files.push(file)
    //     config.Save()
    // }
}
