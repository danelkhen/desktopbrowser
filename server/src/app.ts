import { Server } from "./server"
import { Config } from "contracts"
import * as C from "contracts"
import { ByFilenameService } from "./by-filename-service"
import { KeyValueService } from "./key-value-service"
import { FileService } from "./file-service"
import { DbService } from "./db-service"
import { Db, ByFilename, KeyValue, FsEntry } from "./db"
import { MediaScanner, MediaScannerStatus } from "./media-scanner"


export class App implements C.App {
    server: Server;
    fileService: FileService;
    db: Db;
    keyValueService: KeyValueService;
    byFilenameService: ByFilenameService;
    mediaScanner: MediaScanner;
    fsEntryService: FsEntryService;

    async getConfig(): Promise<Config> {
        let config = await this.keyValueService.findOneById<Config>({ id: "config" });
        config = config || { key: "config" };
        if (config.folders == null)
            config.folders = [];
        return config;
    }

    async init() {
        if (this.db != null)
            return;
        this.db = new Db();
        this.byFilenameService = new ByFilenameService(this.db);
        this.keyValueService = new KeyValueService(this.db);
        this.fsEntryService = new FsEntryService();
        this.fileService = new FileService();
        this.mediaScanner = new MediaScanner();
        this.mediaScanner.app = this;

        await this.db.init();

        this.fsEntryService.db = this.db;
        this.fsEntryService.repo = this.db.fsEntries;

        await this.byFilenameService.init();
        await this.keyValueService.init();
        await this.fileService.init()
    }

    async scanForMedia(): Promise<MediaScannerStatus> {
        if (this.mediaScanner.isRunning())
            return this.mediaScanner.status;
        this.mediaScanner.scan();
        return this.mediaScanner.status;
    }
    scanStatus(): MediaScannerStatus {
        return this.mediaScanner.status;
    }

    async getMediaFiles(): Promise<C.MediaFile[]> {
        let q = this.db.fsEntries.createQueryBuilder("t")
            .leftJoinAndMapOne("t.md", ByFilename, "md", "t.basename=md.key")
            .orderBy("t.mtime", "DESC").setMaxResults(500);

        let x = await q.getMany();
        let mfs = x.map(t => <C.MediaFile>{ fsEntry: t, md: (t as any).md });
        x.forEach(t => delete (t as any).md);
        return mfs;
    }

}

export class FsEntryService extends DbService<FsEntry> implements C.FsEntryService {
}

export let app = new App();


