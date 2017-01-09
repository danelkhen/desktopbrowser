import { Server } from "./server"
import { Config, FsEntryService as FsEntryServiceContract } from "contracts"
import { ByFilenameService } from "./by-filename-service"
import { KeyValueService } from "./key-value-service"
import { FileService } from "./file-service"
import { DbService } from "./db-service"
import { Db, ByFilename, KeyValue, FsEntry } from "./db"
import { MediaScanner } from "./media-scanner"


export class App {
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

    async scanForMedia() {
        if (this.mediaScanner.isRunning())
            return;
        await this.mediaScanner.scan();
    }

    async foo(): Promise<FsEntry[]> {
        return await this.db.fsEntries.find(null, { alias: "t", orderBy: { "t.mtime": "DESC" }, maxResults: 1000 });
    }

}

export class FsEntryService extends DbService<FsEntry> implements FsEntryServiceContract {
}

export let app = new App();


