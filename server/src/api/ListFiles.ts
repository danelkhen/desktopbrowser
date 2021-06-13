import { equalsIgnoreCase } from "../../../shared/src"
import { File, FileRelativesInfo, FileService, ListFilesRequest, PathRequest } from "../../../shared/src/contracts"
import { desc } from "../../../shared/src"
import { IoFile } from "../io/IoFile"
import { IoPath } from "../io/IoPath"
import { orderBy } from "../utils/orderBy"
import { DirSizeCache, IoDir } from "../io/IoDir"
import { IoDrive } from "../io/IoDrive"
import { dateToDefaultString } from "../utils/dateToDefaultString"
import { isWindows } from "../utils/isWindows"

export const ListFiles: FileService["listFiles"] = async req => {
    //if (req.Path == null) {
    //    return {
    //        Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null },
    //        File: { Name: "", IsFolder: true },
    //        Files: GetHomeFiles(),
    //    };
    //}
    if (req.Path != null && req.Path.endsWith(":")) {
        req.Path += "\\"
    }
    const Relatives = await GetFileRelatives(req.Path!)
    const File = await GetFile({ Path: req.Path! })
    let Files: File[] | undefined

    if (File?.IsFolder) {
        Files = await GetFiles(req)
    }
    return { Relatives, File, Files }
}

async function GetFiles(req: ListFilesRequest): Promise<File[]> {
    if (req.HideFiles && req.HideFolders) {
        return []
    }
    let files = await _listFiles({
        path: req.Path!,
        recursive: req.IsRecursive,
        files: !req.HideFiles,
        folders: !req.HideFolders,
    })
    files = await ApplyRequest(files, req)
    files = ApplyPaging(files, req)
    return files
}

async function GetFileRelatives(path: string): Promise<FileRelativesInfo> {
    if (!path) return {}
    const pathInfo = new IoPath(path)
    const info: FileRelativesInfo = {}
    info.ParentFolder = await GetFile({ Path: pathInfo.ParentPath.Value })
    const files = await _listFiles({ path: info.ParentFolder.Path!, files: false, folders: true })
    const parentFiles = files.filter(t => t.IsFolder)[orderBy](t => t.Name)

    const index = parentFiles.findIndex(t => t.Name[equalsIgnoreCase](pathInfo.Name))
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}

async function GetFile(req: PathRequest): Promise<File> {
    const path = req.Path
    if (!path) {
        return /*new File*/ { IsFolder: true, Path: "", Name: "Home" }
    }
    const absPath = new IoPath(path).ToAbsolute()
    if (await absPath.IsFile) {
        return ToFile(await IoFile.get(absPath.Value))
    } else if ((await absPath.IsDirectory) || absPath.IsRoot) {
        return ToFile(await IoFile.get(absPath.Value))
    }
    return null!
}

export interface ListFilesOptions {
    path: string
    recursive?: boolean
    files?: boolean
    folders?: boolean
}

export async function _listFiles({ path, recursive, files, folders }: ListFilesOptions): Promise<File[]> {
    //: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean
    let isFiltered = false
    let files2: File[]
    if (!path && !isWindows()) path = "/"
    if (!path) {
        files2 = await GetHomeFiles()
    } else if (!files && !folders) {
        files2 = []
    }
    //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
    //if (searchPattern.IsNullOrEmpty())
    //    searchPattern = "*";
    else if (recursive) {
        const dir = await IoFile.get(path)
        files2 = (await IoFile.getDescendants(dir.path)).map(t => ToFile(t))
    } else {
        const dir = await IoFile.get(path)
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
        if (!files) {
            files2 = files2.filter(t => t.IsFolder)
        } else if (!folders) {
            files2 = files2.filter(t => !t.IsFolder)
        }
    }
    return files2
}

export async function ApplyRequest(files: File[], req: ListFilesRequest): Promise<File[]> {
    if (!req.ShowHiddenFiles) {
        files = files.filter(t => !t.IsHidden)
    }
    if (req.HideFolders) {
        files = files.filter(t => !t.IsFolder)
    }
    if (req.HideFiles) {
        files = files.filter(t => t.IsFolder)
    }
    if (req.Sort != null && req.Sort.Columns != null) {
        const sorters = req.Sort.Columns.map(col => desc<File, any>(x => x[col.Name], col.Descending))
        files = files[orderBy](...sorters)
    }
    if (req.FolderSize && !req.HideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
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

export function ApplyPaging(files: File[], req: ListFilesRequest): File[] {
    if (req.skip != null) files = files.slice(req.skip)
    if (req.take != null) files = files.slice(0, req.take + 1)
    return files
}

export function quote(s: string): string {
    return `\"${s}\"`
}

async function GetHomeFiles(): Promise<File[]> {
    const list = await IoDrive.getDrives()
    return list.map(t => /*new File*/ ({
        IsFolder: true,
        Name: t.Name,
        Path: t.Name,
        Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : undefined,
    }))
}

let dirSizeCacheTime: number | undefined
let dirSizeCache: DirSizeCache | undefined
function getDirSizeCache() {
    const tenMinutes = 10 * 60 * 1000
    if (dirSizeCache && dirSizeCacheTime && Date.now() - dirSizeCacheTime < tenMinutes) {
        return dirSizeCache
    }
    dirSizeCache = {}
    dirSizeCacheTime = Date.now()
    return dirSizeCache
}
async function calculateFoldersSize(folders: File[]): Promise<File[]> {
    const cache = getDirSizeCache()
    const list: File[] = []
    for (const file of folders) {
        try {
            //console.log("CalculateFoldersSize", file);
            if (file.IsFolder) {
                file.Size = await IoDir.getSize(file.Path!, cache)
            }
        } catch (e) {}
        list.push(file)
    }
    return list
}
