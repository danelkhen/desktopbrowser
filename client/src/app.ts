import { useEffect, useState } from "react"
import * as C from "../../shared/src/contracts"
import { ByFilename, File, FsEntry } from "../../shared/src/contracts"
import { proxyForFileService } from "./utils/DbService"

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

    async getAllFilesMetadata(): Promise<ByFilename[]> {
        return await this.fileService.http.getAllFilesMetadata()
    }

    async getFileMetadata(file: File | string): Promise<ByFilename> {
        let name = file as string
        if (file instanceof File) name = (file as File).Name
        let x = await this.fileService.http.getFileMetadata({ key: name })
        if (x == null) x = { key: name }
        return x
    }

    fsEntryToMediaFile(x: FsEntry): C.MediaFile {
        return { fsEntry: x } as C.MediaFile
    }
}
