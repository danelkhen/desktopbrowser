import { useEffect, useState } from "react"
import * as M from "../../shared/src/media"
import { FileInfo, File } from "../../shared/src/contracts"
import { FsEntry } from "../../shared/src/media"
import { proxyForFileService } from "./FileBrowser/lib/proxyForFileService"

export function useApp() {
    const [app, setApp] = useState<App | null>(null)
    useEffect(() => {
        async function main() {
            const app = await App.init()
            setApp(app)
        }
        main()
    }, [])
    return app
}
export class App {
    static current: App
    static async init() {
        if (App.current) return App.current
        App.current = new App()
        return App.current
    }

    constructor() {
        console.log("App ctor", this)
        ;(window as any)["_app"] = this
    }

    fileService = proxyForFileService()

    async getAllFilesMetadata(): Promise<FileInfo[]> {
        return await this.fileService.getAllFilesMetadata()
    }

    async getFileMetadata(file: File | string): Promise<FileInfo> {
        let name = file as string
        if (file instanceof File) name = (file as File).Name
        let x = await this.fileService.getFileMetadata({ key: name })
        if (x == null) {
            x = { key: name, collection: "" }
        }
        return x
    }

    fsEntryToMediaFile(x: FsEntry): M.MediaFile {
        return { fsEntry: x } as M.MediaFile
    }
}
