import * as child_process from "child_process"
import open from "open"
import * as os from "os"
import trash from "trash"
import { equalsIgnoreCase } from "../../shared/src"
import * as C from "../../shared/src/contracts"
import { File, FileRelativesInfo, ListFilesRequest, ListFilesResponse, PathRequest } from "../../shared/src/contracts"
import {
    ApplyCaching,
    ApplyPaging,
    ApplyRequest,
    GetFileAndOrFolders,
    quote,
    rimraf2,
    ToFile,
} from "./GetFileAndOrFolders"
import { FileInfo } from "./utils/FileInfo"
import { IoDir, IoFile } from "./utils/io"
import { orderBy } from "./utils/orderBy"
import { PathInfo } from "./utils/PathInfo"

export function isWindows() {
    return os.platform() == "win32"
}

// const ListFiles:C.FileService["ListFiles"] = async res => {

// }
export function createFileService2(): Omit<
    C.FileService,
    "getAllFilesMetadata" | "saveFileMetadata" | "deleteFileMetadata"
> {
    const _this: Omit<C.FileService, "getAllFilesMetadata" | "saveFileMetadata" | "deleteFileMetadata"> = {
        async ListFiles(req: ListFilesRequest): Promise<ListFilesResponse> {
            //if (req.Path == null) {
            //    return {
            //        Relatives: { ParentFolder: null, NextSibling: null, PreviousSibling: null },
            //        File: { Name: "", IsFolder: true },
            //        Files: this.GetHomeFiles(),
            //    };
            //}
            if (req.Path != null && req.Path.endsWith(":")) {
                req.Path += "\\"
            }
            let res: ListFilesResponse = {
                Relatives: await this.GetFileRelatives(req.Path!),
                File: await this.GetFile({ Path: req.Path! }),
                // Files: null,
            }
            if (res.File!.IsFolder) {
                res.Files = await this.GetFiles(req) //.toArray();
            }
            return res
        },

        async GetFiles(req: ListFilesRequest): Promise<File[]> {
            if (req.HideFiles && req.HideFolders) return []
            //else if (!req.MixFilesAndFolders && !req.HideFiles && !req.HideFolders && !req.IsRecursive) {
            //   const folders = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, false, true);
            //   const files = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, true, false);
            //    folders = this.ApplyRequest(folders, req);
            //    files = this.ApplyRequest(files, req);
            //   const all = folders.concat(files);
            //    all = this.ApplyPaging(all, req);
            //    all = this.ApplyCaching(all);
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
        },

        async GetFileRelatives(path: string): Promise<FileRelativesInfo> {
            if (!path) return {}
            const pathInfo = new PathInfo(path)
            const info: FileRelativesInfo = {}
            info.ParentFolder = await this.GetFile({ Path: pathInfo.ParentPath.Value })
            let xxx = await GetFileAndOrFolders({ path: info.ParentFolder.Path!, files: false, folders: true })
            const parentFiles = xxx.filter(t => t.IsFolder)[orderBy](t => t.Name)

            const index = parentFiles.findIndex(t => t.Name[equalsIgnoreCase](pathInfo.Name))
            info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
            info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
            return info
        },

        async GetFile(req: PathRequest): Promise<File> {
            const path = req.Path
            if (!path) return /*new File*/ { IsFolder: true, Path: "", Name: "Home" }
            const absPath = new PathInfo(path).ToAbsolute()
            if (await absPath.IsFile) {
                return ToFile(await FileInfo.create(absPath.Value))
            } else if ((await absPath.IsDirectory) || absPath.IsRoot) {
                return ToFile(await FileInfo.create(absPath.Value))
            }
            return null!
        },

        async Execute(req: PathRequest) {
            const filename = req.Path
            const p = await open(filename)
        },

        Explore(req: PathRequest): void {
            const cmd = os.platform() === "darwin" ? "open" : "explorer"
            child_process.exec(`${cmd} ${quote(req.Path)}`)
        },

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
                await rimraf2(path, { glob: false })
            }
        },

        async trash(req: PathRequest): Promise<void> {
            console.log("Trash 1")

            let path = req.Path
            await trash([path])
        },
    }
    return _this
}
