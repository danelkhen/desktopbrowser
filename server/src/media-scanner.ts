import "../lib/corex/corex"
import { FileScanner, FileEvent } from "./utils/file-scanner"
import { Db, FsEntry } from "./db";
import * as Path from "path";
import { App } from "./app";

const FILE_TYPES = [
    "File",
    "Directory",
    "BlockDevice",
    "CharacterDevice",
    "SymbolicLink",
    "FIFO",
    "Socket",
];

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
        x.ctime = e.stats.ctime;
        x.mtime = e.stats.mtime;
        x.atime = e.stats.atime;
        x.dirname = Path.dirname(e.path);
        x.extname = Path.extname(e.path);
        x.basename = Path.basename(e.path);
        return x;
    }
    scanner: FileScanner;
    app:App;

    async scan() {
        let config = await this.app.getConfig();
        if (config == null || config.folders == null || config.folders.length == 0)
            return;
        let db = this.app.db;
        let scanner = new FileScanner();
        this.scanner = scanner;
        let dirs = config.folders.map(t => t.path);
        let since: Date = null;
        since = Date.today().addDays(-7);
        scanner.onDir = async e => {
            console.log(e.path);
            if (since != null && e.stats.mtime.valueOf() - since.valueOf() < 0) {
                console.log("SKIPPING", e.stats.mtime, e.path);
                return false;
            }
            else
                console.log("ENTERING", e.stats.mtime, e.path);

        };
        //x.onDirChildren = async e => {
        //    //if (!this.isVideoFile(e.child))
        //    //    return;
        //    console.log(e.dir);
        //};
        scanner.onDirChild = async e => {
            //console.log(e.path);
            this.st.stack = this.scanner.stack && this.scanner.stack.length;
            this.st.scanned++;
            this.st.lastScanned = e.path;

            if (!e.stats.isFile())
                return;
            if (!this.isVideoFile(e.path))
                return;
            let x = this.toFsEntry(e);
            if (x == null)
                return;
            db.fsEntries.persist(x); //non blocking, will be done in background
            this.st.saved++;
            this.st.lastSaved = e.path;
            //console.log(e.child);
        };
        scanner.scan(dirs).then(() => console.log("FINISHED"));
        //this.status();
        //setTimeout(() => x.pause(), 200);
        //setTimeout(() => x.resume(), 2000);
        //setTimeout(() => this.scanner.pause(), 10000);
        //setTimeout(() => x.resume(), 4000);
    }

    status() {
        console.log(this.st);
        if (this.scanner.stack.length == 0)
            return;
        setTimeout(() => this.status(), 1000);
    }
    st: MediaScannerStatus = { scanned: 0, saved: 0, stack: 0, lastScanned: null, lastSaved: null };
}
export interface MediaScannerStatus {
    stack: number;
    scanned: number;
    saved: number;
    lastScanned: string;
    lastSaved: string;
}
