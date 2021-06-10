import * as child_process from "child_process"
import open from "open"
import * as os from "os"
import trash2 from "trash"
import { equalsIgnoreCase } from "../../shared/src"
import * as C from "../../shared/src/contracts"
import { FileRelativesInfo, ListFilesResponse } from "../../shared/src/contracts"
import {
    ApplyCaching,
    ApplyPaging,
    ApplyRequest,
    GetFileAndOrFolders,
    quote,
    rimraf2,
    ToFile,
} from "./GetFileAndOrFolders"
import { IoFile } from "./utils/IoFile"
import { IoDir } from "./utils/IoDir"
import { orderBy } from "./utils/orderBy"
import { PathInfo } from "./utils/PathInfo"

export function isWindows() {
    return os.platform() == "win32"
}

export const ListFiles: C.FileService["ListFiles"] = async req => {
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
    let res: ListFilesResponse = {
        Relatives: await GetFileRelatives(req.Path!),
        File: await GetFile({ Path: req.Path! }),
        // Files: null,
    }
    if (res.File!.IsFolder) {
        res.Files = await GetFiles(req) //.toArray();
    }
    return res
}

export const GetFiles: C.FileService["GetFiles"] = async req => {
    if (req.HideFiles && req.HideFolders) return []
    //else if (!req.MixFilesAndFolders && !req.HideFiles && !req.HideFolders && !req.IsRecursive) {
    //   const folders = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, false, true);
    //   const files = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, true, false);
    //    folders = ApplyRequest(folders, req);
    //    files = ApplyRequest(files, req);
    //   const all = folders.concat(files);
    //    all = ApplyPaging(all, req);
    //    all = ApplyCaching(all);
    //    return all;
    //}
    //else {
    let files = await GetFileAndOrFolders({
        path: req.Path!,
        searchPattern: req.SearchPattern,
        recursive: req.IsRecursive,
        files: !req.HideFiles,
        folders: !req.HideFolders,
    })
    files = await ApplyRequest(files, req)
    files = ApplyPaging(files, req)
    files = ApplyCaching(files)
    return files
    //}
}

export const GetFileRelatives: C.FileService["GetFileRelatives"] = async path => {
    if (!path) return {}
    const pathInfo = new PathInfo(path)
    const info: FileRelativesInfo = {}
    info.ParentFolder = await GetFile({ Path: pathInfo.ParentPath.Value })
    let xxx = await GetFileAndOrFolders({ path: info.ParentFolder.Path!, files: false, folders: true })
    const parentFiles = xxx.filter(t => t.IsFolder)[orderBy](t => t.Name)

    const index = parentFiles.findIndex(t => t.Name[equalsIgnoreCase](pathInfo.Name))
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}

export const GetFile: C.FileService["GetFile"] = async req => {
    const path = req.Path
    if (!path) return /*new File*/ { IsFolder: true, Path: "", Name: "Home" }
    const absPath = new PathInfo(path).ToAbsolute()
    if (await absPath.IsFile) {
        return ToFile(await IoFile.create(absPath.Value))
    } else if ((await absPath.IsDirectory) || absPath.IsRoot) {
        return ToFile(await IoFile.create(absPath.Value))
    }
    return null!
}

export const Execute: C.FileService["Execute"] = async req => {
    const filename = req.Path
    const p = await open(filename)
}

export const Explore: C.FileService["Explore"] = async req => {
    const cmd = os.platform() === "darwin" ? "open" : "explorer"
    child_process.exec(`${cmd} ${quote(req.Path)}`)
}

export const Delete: C.FileService["Delete"] = async req => {
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
        await rimraf2(path, { glob: false })
    }
}

export const trash: C.FileService["trash"] = async req => {
    console.log("Trash 1")

    let path = req.Path
    await trash2([path])
}
