import * as Path from "path"
import * as M from "../../../shared/src/media"
import { Db, FsEntry } from "./db"
import { dateToDefaultString } from "../utils"
import { FileEvent, FileScanner } from "../utils/FileScanner"
import moment = require("moment")

const FILE_TYPES = ["File", "Directory", "BlockDevice", "CharacterDevice", "SymbolicLink", "FIFO", "Socket"]
const DefaultDateFormat = "YYYY-MM-DD hh:mm:ss"

export class MediaScanner {
    videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"]
    isVideoFile(name: string): boolean {
        return this.videoExts.find(t => name.endsWith(t)) != null
    }

    toFsEntry(e: FileEvent): FsEntry {
        let x = new FsEntry()
        x.key = e.path
        x.type = FILE_TYPES.find(t => (e.stats as any)["is" + t]())!
        if (x.type != null) x.type = x.type.toLowerCase()
        x.ctime = moment(e.stats.ctime).format(DefaultDateFormat)
        x.mtime = moment(e.stats.mtime).format(DefaultDateFormat)
        x.atime = moment(e.stats.atime).format(DefaultDateFormat)
        x.dirname = Path.dirname(e.path)
        x.extname = Path.extname(e.path)
        x.basename = Path.basename(e.path)
        x.exists = true
        return x
    }
    scanner: FileScanner = undefined!
    app: M.MediaApp = undefined!

    isRunning(): boolean {
        return this.status != null && this.status.started != null && this.status.finished == null
    }
    async scan() {
        if (this.isRunning()) {
            console.log("scan is already running")
            return
        }
        let config = await this.app.getConfig()
        if (config == null || config.folders == null || config.folders.length == 0) return
        this.status.started = new Date()

        let db: Db = null!
        let scanner = new FileScanner()
        scanner.prioritizeRecentlyModified = true
        this.scanner = scanner
        let dirs = config.folders.map(t => t.path)
        let since: Date | null = null
        //since = Date.today().addDays(-7);
        scanner.onDir = async e => {
            this.status.dir = { path: e.path, mtime: dateToDefaultString(e.stats.mtime) }
            if (since != null) {
                console.log(e.path)
                if (since != null && e.stats.mtime.valueOf() - since.valueOf() < 0) {
                    console.log("SKIPPING", e.stats.mtime, e.path)
                    return false
                } else console.log("ENTERING", e.stats.mtime, e.path)
            }
        }
        scanner.onDirChild = async e => {
            this.status.stack = this.scanner.stack && this.scanner.stack.length
            this.status.scanned++
            this.status.lastScanned = e.path

            if (!e.stats.isFile()) return
            if (!this.isVideoFile(e.path)) return
            let x = this.toFsEntry(e)
            if (x == null) return
            db.fsEntries.save(x) //non blocking, will be done in background
            this.status.saved++
            this.status.lastSaved = e.path
        }
        scanner.scan(dirs).then(() => {
            console.log("FINISHED")
            this.status.finished = new Date()
        })
    }

    //status() {
    //    if (this.scanner.stack.length == 0)
    //        return;
    //    setTimeout(() => this.status(), 1000);
    //}
    status: M.MediaScannerStatus = {
        scanned: 0,
        saved: 0,
        stack: 0,
        dir: null!,
        lastScanned: null!,
        lastSaved: null!,
        started: null!,
        finished: null!,
    }
}
