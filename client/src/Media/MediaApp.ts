import { App } from "../App"
import { TmdbApp } from "./TmdbApp"
import { Scanner } from "./Scanner"
import * as C from "../../../shared/src/contracts"
import * as M from "../../../shared/src/media"
import { FilenameParser } from "../utils/FilenameParser"
import { proxyForAppService, proxyForKeyValueService } from "./proxies"

export class MediaApp {
    constructor(public app: App) {}
    tmdbApp = new TmdbApp(this)
    static current: MediaApp

    async init() {
        await this.initConfig()
        await this.tmdbApp.init()
    }
    createScanner(): Scanner {
        let scanner = new Scanner()
        scanner.app = this
        scanner.folders = (this.config?.folders ?? []).map(t => t.path)
        return scanner
    }

    async markAsWatched(mf: M.MediaFile): Promise<void> {
        mf.md.watched = true
        if (mf.md.tmdbKey != null) {
            await this.tmdbApp.tmdb.markAsWatched(mf.md.tmdbKey)
        }
        await this.app.fileService.saveFileMetadata(mf.md)
    }

    async analyze(mfs: M.MediaFile[], opts?: { force?: boolean }): Promise<void> {
        for (let mf of mfs) {
            if (mf.tmdb != null && (opts == null || !opts.force)) continue
            await this.createScanner().analyze(mf, opts)
        }
    }

    //TODO: @ReusePromiseIfStillRunning()
    async scanAllFsEntries(): Promise<void> {
        console.log("STARTED scanAllFsEntries")
        let req: M.GetMediaFilesRequest = { firstResult: 0, maxResults: 500, notScannedOnly: true }
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

    async initConfig(): Promise<void> {
        let config = await this.appService.getConfig()
        this.config = config || {}
        if (this.config.folders == null) this.config.folders = []
    }
    async saveConfig() {
        this.config && (await this.appService.saveConfig(this.config))
    }

    config: M.Config | undefined

    async findFile(name: string): Promise<C.File | undefined> {
        for (let folder of this.config?.folders ?? []) {
            let res = await this.app.fileService.ListFiles({ Path: folder.path, IsRecursive: true })
            let file = res.Files?.find(t => t.Name == name)
            if (file) return file
        }
    }

    parseFilename(mf: M.MediaFile) {
        if (mf.parsed != null) return
        if (mf.fsEntry == null) return
        mf.parsed = new FilenameParser().parse(mf.fsEntry.basename)
    }

    async getMediaFiles(req?: M.GetMediaFilesRequest): Promise<M.MediaFile[]> {
        let x = await this.appService.getMediaFiles(req)
        x.forEach(t => {
            if (t.md == null) {
                t.md = { key: t.fsEntry.basename }
            }
            this.parseFilename(t)
        })
        return x
    }

    keyValue = proxyForKeyValueService()
    appService = proxyForAppService()
}
