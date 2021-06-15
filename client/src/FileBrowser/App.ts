import { useEffect, useState } from "react"
import { FileInfo, FsFile } from "../../../shared/src/FileService"
import { proxyForFileService } from "./lib/proxyForFileService"

export function useApp() {
    const [app, setApp] = useState<App | null>(null)
    useEffect(() => {
        function main() {
            const app = App.init()
            setApp(app)
        }
        main()
    }, [])
    return app
}
export class App {
    static current: App
    static init() {
        if (App.current) return App.current
        App.current = new App()
        return App.current
    }

    constructor() {
        console.log("App ctor", this)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any)["_app"] = this
    }

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
