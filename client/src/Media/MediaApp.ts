import { App } from "../App"
import { TmdbApp } from "../TmdbApp"
import { Scanner } from "../utils/Scanner"
import * as C from "../../../shared/src/contracts"

export class MediaApp {
    constructor(public app: App) {}
    tmdbApp = new TmdbApp(this)
    static current: MediaApp

    async init() {
        await this.tmdbApp.init()
    }
    createScanner(): Scanner {
        let scanner = new Scanner()
        scanner.app = this
        scanner.folders = (this.app.config?.folders ?? []).map(t => t.path)
        return scanner
    }

    async markAsWatched(mf: C.MediaFile): Promise<void> {
        mf.md.watched = true
        if (mf.md.tmdbKey != null) await this.tmdbApp.tmdb.markAsWatched(mf.md.tmdbKey)
        await this.app.byFilename.persist(mf.md)
    }

    async analyze(mfs: C.MediaFile[], opts?: { force?: boolean }): Promise<void> {
        for (let mf of mfs) {
            if (mf.tmdb != null && (opts == null || !opts.force)) continue
            await this.createScanner().analyze(mf, opts)
        }
    }

    //TODO: @ReusePromiseIfStillRunning()
    async scanAllFsEntries(): Promise<void> {
        console.log("STARTED scanAllFsEntries")
        let req: C.GetMediaFilesRequest = { firstResult: 0, maxResults: 500, notScannedOnly: true }
        while (true) {
            let mfs = await this.app.getMediaFiles(req)
            if (mfs.length == 0) {
                console.log("Finished scanAllFsEntries")
                return
            }
            req.firstResult! += req.maxResults!
            await this.analyze(mfs)
        }
    }
}
