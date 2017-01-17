import "../lib/corex/corex"
import { FileScanner, FileEvent } from "./utils/file-scanner"
import { Db, FsEntry } from "./db";
import * as Path from "path";
import { App } from "./app";
import * as C from "contracts";

const FILE_TYPES = [
    "File",
    "Directory",
    "BlockDevice",
    "CharacterDevice",
    "SymbolicLink",
    "FIFO",
    "Socket",
];
const DefaultDateFormat = "yyyy-MM-dd HH:mm:ss";

export class MediaScanner {
    videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"];
    isVideoFile(name: string): boolean {
        return this.videoExts.first(t => name.endsWith(t)) != null;
    }


    toFsEntry(e: FileEvent): FsEntry {
        let x = new FsEntry();
        x.key = e.path;
        x.type = FILE_TYPES.first(t => e.stats["is" + t]());
        if (x.type != null)
            x.type = x.type.toLowerCase();
        x.ctime = e.stats.ctime.format(DefaultDateFormat);
        x.mtime = e.stats.mtime.format(DefaultDateFormat);
        x.atime = e.stats.atime.format(DefaultDateFormat);
        x.dirname = Path.dirname(e.path);
        x.extname = Path.extname(e.path);
        x.basename = Path.basename(e.path);
        x.exists = true;
        return x;
    }
    scanner: FileScanner;
    app: App;

    isRunning(): boolean {
        return this.status != null && this.status.started != null && this.status.finished == null;
    }
    async scan() {
        if (this.isRunning()) {
            console.log("scan is already running");
            return;
        }
        let config = await this.app.getConfig();
        if (config == null || config.folders == null || config.folders.length == 0)
            return;
        this.status.started = new Date();

        let db = this.app.db;
        let scanner = new FileScanner();
        scanner.prioritizeRecentlyModified = true;
        this.scanner = scanner;
        let dirs = config.folders.map(t => t.path);
        let since: Date = null;
        //since = Date.today().addDays(-7);
        if (since != null) {
            scanner.onDir = async e => {
                console.log(e.path);
                if (since != null && e.stats.mtime.valueOf() - since.valueOf() < 0) {
                    console.log("SKIPPING", e.stats.mtime, e.path);
                    return false;
                }
                else
                    console.log("ENTERING", e.stats.mtime, e.path);

            };
        }
        scanner.onDirChild = async e => {
            this.status.stack = this.scanner.stack && this.scanner.stack.length;
            this.status.scanned++;
            this.status.lastScanned = e.path;

            if (!e.stats.isFile())
                return;
            if (!this.isVideoFile(e.path))
                return;
            let x = this.toFsEntry(e);
            if (x == null)
                return;
            db.fsEntries.persist(x); //non blocking, will be done in background
            this.status.saved++;
            this.status.lastSaved = e.path;
        };
        scanner.scan(dirs).then(() => {
            console.log("FINISHED");
            this.status.finished = new Date();
        });
    }

    //status() {
    //    if (this.scanner.stack.length == 0)
    //        return;
    //    setTimeout(() => this.status(), 1000);
    //}
    status: C.MediaScannerStatus = { scanned: 0, saved: 0, stack: 0, lastScanned: null, lastSaved: null, started: null, finished: null };
}
