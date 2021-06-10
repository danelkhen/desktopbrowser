import * as child_process from "child_process"
import open from "open"
import * as os from "os"
import trash2 from "trash"
import { equalsIgnoreCase } from "../../shared/src"
import { File, FileRelativesInfo, FileService, ListFilesRequest } from "../../shared/src/contracts"
import { IoDir } from "./io/IoDir"
import { IoFile } from "./io/IoFile"
import { IoPath } from "./io/IoPath"
import { ApplyPaging, ApplyRequest, listFiles, quote, ToFile } from "./listFiles"
import { orderBy } from "./utils/orderBy"

export function isWindows() {
    return os.platform() == "win32"
}

export const ListFiles: FileService["ListFiles"] = async req => {
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
    let files = await listFiles({
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
    let files = await listFiles({ path: info.ParentFolder.Path!, files: false, folders: true })
    const parentFiles = files.filter(t => t.IsFolder)[orderBy](t => t.Name)

    const index = parentFiles.findIndex(t => t.Name[equalsIgnoreCase](pathInfo.Name))
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}

export const GetFile: FileService["GetFile"] = async req => {
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

export const Execute: FileService["Execute"] = async req => {
    const filename = req.Path
    const p = await open(filename)
}

export const Explore: FileService["Explore"] = async req => {
    const cmd = os.platform() === "darwin" ? "open" : "explorer"
    child_process.exec(`${cmd} ${quote(req.Path)}`)
}

export const Delete: FileService["Delete"] = async req => {
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
        await IoDir.del(path)
    }
}

export const trash: FileService["trash"] = async req => {
    let path = req.Path
    await trash2([path])
}
