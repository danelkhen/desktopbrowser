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
    tmdbApp = new TmdbApp(this)
    static current: App
    static async init() {
        if (App.current) return App.current
        const app = new App()
        App.current = app
        await app.init()
        return app
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

    async init() {
        await this.initConfig()
        await this.tmdbApp.init()
    }

    async initConfig(): Promise<void> {
        let config = await this.appService.getConfig()
        this.config = config || {}
        if (this.config.folders == null) this.config.folders = []
    }
    async saveConfig() {
        this.config && (await this.appService.saveConfig(this.config))
    }

    config: Config | undefined
    createScanner(): Scanner {
        let scanner = new Scanner()
        scanner.app = this
        scanner.folders = (this.config?.folders ?? []).map(t => t.path)
        return scanner
    }

    async scan(): Promise<void> {
        let x = await this.appService.scanForMedia()
        console.log(x)
        //let scanner = this.createScanner();
        //console.log("scan started", scanner);
        //await scanner.scan();
        //console.log("scan completed", scanner);
        //return scanner;
    }

    async getAllFilesMetadata(): Promise<ByFilename[]> {
        return this.byFilename.find({})
    }

    async getFileMetadata(file: File | string): Promise<ByFilename> {
        let name = file as string
        if (file instanceof File) name = (file as File).Name
        let x = await this.byFilename.findOneById({ id: name })
        if (x == null) x = { key: name }
        return x
    }

    async analyze(mfs: C.MediaFile[], opts?: { force?: boolean }): Promise<void> {
        for (let mf of mfs) {
            if (mf.tmdb != null && (opts == null || !opts.force)) continue
            await this.createScanner().analyze(mf, opts)
        }
    }

    async findFile(name: string): Promise<File | undefined> {
        for (let folder of this.config?.folders ?? []) {
            let res = await this.fileService.ws.ListFiles({ Path: folder.path, IsRecursive: true })
            let file = res.Files?.find(t => t.Name == name)
            if (file) return file
        }
    }

    async markAsWatched(mf: C.MediaFile): Promise<void> {
        mf.md.watched = true
        if (mf.md.tmdbKey != null) await this.tmdbApp.tmdb.markAsWatched(mf.md.tmdbKey)
        await this.byFilename.persist(mf.md)
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

    //TODO: @ReusePromiseIfStillRunning()
    async scanAllFsEntries(): Promise<void> {
        console.log("STARTED scanAllFsEntries")
        let req: C.GetMediaFilesRequest = { firstResult: 0, maxResults: 500, notScannedOnly: true }
        while (true) {
            let mfs = await this.getMediaFiles(req)
            if (mfs.length == 0) {
                console.log("Finished scanAllFsEntries")
                return
            }
            req.firstResult! += req.maxResults!
            await this.analyze(mfs)
        }
    }
}
