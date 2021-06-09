import * as C from "../../shared/src/contracts"
import { ByFilename, Config, File, FsEntry } from "../../shared/src/contracts"
import { TmdbApp } from "./TmdbApp"
import { getProxies, Proxies } from "./utils/DbService"
import { FilenameParser } from "./utils/FilenameParser"
import { Scanner } from "./utils/Scanner"
import { useEffect, useState } from "react"

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
    proxies: Proxies
    static current: App
    static async init() {
        if (App.current) return App.current
        App.current = new App()
        return App.current
    }

    get fileService() {
        return this.proxies.fileService
    }
    get byFilename() {
        return this.proxies.byFilename
    }
    get keyValue() {
        return this.proxies.keyValue
    }
    get fsEntryService() {
        return this.proxies.fsEntryService
    }
    get appService() {
        return this.proxies.appService
    }

    constructor() {
        console.log("App ctor", this)
        ;(window as any)["_app"] = this
        this.proxies = getProxies()
    }

    async getAllFilesMetadata(): Promise<ByFilename[]> {
        return await this.fileService.http.getAllFilesMetadata()
        // return this.byFilename.find({})
    }

    async getFileMetadata(file: File | string): Promise<ByFilename> {
        let name = file as string
        if (file instanceof File) name = (file as File).Name
        let x = await this.byFilename.findOneById({ id: name })
        if (x == null) x = { key: name }
        return x
    }

    fsEntryToMediaFile(x: FsEntry): C.MediaFile {
        return { fsEntry: x } as C.MediaFile
    }
    parseFilename(mf: C.MediaFile) {
        if (mf.parsed != null) return
        if (mf.fsEntry == null) return
        mf.parsed = new FilenameParser().parse(mf.fsEntry.basename)
    }
    filenameParser = new FilenameParser()
    async getMediaFiles(req?: C.GetMediaFilesRequest): Promise<C.MediaFile[]> {
        let x = await this.appService.getMediaFiles(req)
        x.forEach(t => {
            if (t.md == null) {
                t.md = { key: t.fsEntry.basename }
            }
            this.parseFilename(t)
        })
        return x
    }

    async getLatestFsEntries(): Promise<FsEntry[]> {
        return await this.fsEntryService.find({ order: { mtime: "DESC" } }) //maxResults: 1000
    }
}
