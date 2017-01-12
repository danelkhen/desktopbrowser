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

    async getMediaFiles(req?: C.GetMediaFilesRequest): Promise<C.MediaFile[]> {
        //let files = await this.fsEntryService.find(req.find);
        //let mfs: C.MediaFile[] = files.map(t => <C.MediaFile>{ fsEntry: t });
        //let byKey = new Map<string, C.MediaFile>();
        //mfs.forEach(t => byKey.set(t.fsEntry.basename, t));
        //let keys = Array.from(files.keys());
        //let mds = await this.db.byFilename.findByIds(keys);
        //mds.forEach(md => {
        //    let mf = byKey.get(md.key);
        //    mf.md = md;
        //});
        //req.find.options.alias = "t";
        //let q = this.db.fsEntries.createFindQueryBuilder(req.find.conditions, req.find.options);

        let q = this.db.fsEntries.createQueryBuilder("t")
            .leftJoinAndMapOne("t.md", ByFilename, "md", "t.basename=md.key");
        if (req.notScannedOnly)
            q = q.where("md.scanned is null");
        q = q.orderBy("t.mtime", "DESC").setFirstResult(req.firstResult || 0).setMaxResults(req.maxResults || 100);
        //.where()
        ;

        let x = await q.getMany();
        let mfs = x.map(t => <C.MediaFile>{ fsEntry: t, md: (t as any).md });
        x.forEach(t => delete (t as any).md);
        return mfs;
    }

}

export class FsEntryService extends DbService<FsEntry> implements C.FsEntryService {
}

export let app = new App();


