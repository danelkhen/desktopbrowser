import { FileInfo, FsFile } from "../shared/FileService"
import { proxyForFileService } from "./lib/proxyForFileService"

export class App {
    fileService = proxyForFileService()

    async getFileMetadata(file: FsFile | string): Promise<FileInfo> {
        let name = file as string
        if (file instanceof File) name = (file as FsFile).Name
        let x = await this.fileService.getFileMetadata({ key: name })
        if (x == null) {
            x = { key: name, collection: "" }
        }
        return x
    }
}

export const app = new App()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any)["_app"] = this
