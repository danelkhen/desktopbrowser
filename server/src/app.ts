import { Server } from "./server"
import { Config } from "contracts"
import { ByFilenameService } from "./by-filename-service"
import { KeyValueService } from "./key-value-service"
import { FileService } from "./file-service"
import { Db, ByFilename, KeyValue } from "./db"
import { MediaScanner } from "./media-scanner"

export class App {
    server: Server;
    fileService: FileService;
    db: Db;
    keyValueService: KeyValueService;
    byFilenameService: ByFilenameService;
    mediaScanner: MediaScanner;

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
        this.fileService = new FileService();

        await this.db.init();
        await this.byFilenameService.init();
        await this.keyValueService.init();
        await this.fileService.init()
    }


}

export let app = new App();