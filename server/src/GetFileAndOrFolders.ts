import rimraf from "rimraf"
import { File, IEnumerable, IOrderedEnumerable, ListFilesRequest } from "../../shared/src/contracts"
import { calculateFoldersSize } from "./utils/calculateFoldersSize"
import { isWindows } from "./FileService"
import { GetFileAndFoldersRequest } from "./GetFileAndFoldersRequest"
import { dateToDefaultString } from "./utils/dateToDefaultString"
import { IoFile } from "./utils/IoFile"
import { IoDrive } from "./utils/IoDrive"

export async function GetFileAndOrFolders(req: GetFileAndFoldersRequest): Promise<IEnumerable<File>> {
    let { path, searchPattern, recursive, files, folders } = req
    //: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean
    let isFiltered = false
    let files2: IEnumerable<File>
    if (!path && !isWindows()) path = "/"
    if (!path) {
        files2 = await GetHomeFiles()
    } else if (!files && !folders) files2 = []
    //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
    //if (searchPattern.IsNullOrEmpty())
    //    searchPattern = "*";
    else if (recursive) {
        const dir = await IoFile.create(path)
        files2 = (await IoFile.getDescendants(dir.path)).map(t => ToFile(t))
    } else {
        const dir = await IoFile.create(path)
        const children = await IoFile.getChildren(dir.path)
        if (files && !folders) {
            files2 = children.filter(t => t.isFile).map(t => ToFile(t))
        } else if (folders && !files) {
            files2 = children.filter(t => t.isDir).map(t => ToFile(t))
        } else if (folders && files) {
            files2 = children.map(t => ToFile(t))
        } else {
            throw new Error()
        }
        isFiltered = true
    }
    if (!isFiltered) {
        if (!files) files2 = files2.filter(t => t.IsFolder)
        else if (!folders) files2 = files2.filter(t => !t.IsFolder)
    }
    return files2
}

export async function ApplyRequest(files: IEnumerable<File>, req: ListFilesRequest): Promise<IEnumerable<File>> {
    let calculatedFolderSize = false
    if (!req.ShowHiddenFiles) files = files.filter(t => !t.IsHidden)
    if (req.HideFolders) files = files.filter(t => !t.IsFolder)
    if (req.HideFiles) files = files.filter(t => t.IsFolder)
    if (req.Sort != null && req.Sort.Columns != null) {
        for (const col of req.Sort.Columns) {
            if (col.Name == "Name") {
                files = OrderBy(files, x => x.Name, col.Descending)
            } else if (col.Name == "Modified") {
                files = OrderBy(files, x => x.Modified, col.Descending)
            } else if (col.Name == "Extension") {
                files = OrderBy(files, x => x.Extension, col.Descending)
            } else if (col.Name == "Size") {
                if (req.FolderSize && !req.HideFolders) {
                    files = await calculateFoldersSize(files)
                    calculatedFolderSize = true
                }
                files = OrderBy(files, x => x.Size, col.Descending)
            }
            if (col.Descending) files.reverse()
        }
    }
    if (!calculatedFolderSize && req.FolderSize && !req.HideFolders) files = await calculateFoldersSize(files)
    return files
}

export function OrderBy<TSource, TKey>(
    source: IEnumerable<TSource>,
    keySelector: (source: TSource) => TKey,
    desc: boolean | undefined
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

export function ToFile(file: IoFile): File {
    const file2: File = {
        type: undefined,
        Name: file.Name,
        IsFolder: !!file.isDir,
        Modified: file.LastWriteTime != null ? dateToDefaultString(file.LastWriteTime) : undefined,
        Size: file.isFile ? file.Length : undefined,
        IsHidden: false, // TODO:
        Extension: file?.Extension,
    }
    if (file.isDir) {
        file2.type = "folder"
    } else if (file.isFile) {
        file2.type = "file"
    } else if (file.isLink) {
        file2.type = "link"
    }
    try {
        file2.Path = file.FullName
    } catch (e) {}
    return file2
}

export function ApplyCaching(files: IEnumerable<File>): IEnumerable<File> {
    return files //TODO: new CachedEnumerable<File>(files);
}

export function ApplyPaging(files: IEnumerable<File>, req: ListFilesRequest): IEnumerable<File> {
    if (req.skip != null) files = files.slice(req.skip)
    if (req.take != null) files = files.slice(0, req.take + 1)
    return files
}

export function quote(s: string): string {
    return `\"${s}\"`
}

export function rimraf2(pattern: string, options: rimraf.Options = {}) {
    return new Promise<void>((resolve, reject) => {
        rimraf(pattern, options, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

export async function GetHomeFiles(): Promise<File[]> {
    const list = await IoDrive.getDrives()
    return list.map(t => /*new File*/ ({
        IsFolder: true,
        Name: t.Name,
        Path: t.Name,
        Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : undefined,
    }))
}
