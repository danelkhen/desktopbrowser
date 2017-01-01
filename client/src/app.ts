import "./utils/global";
import { TmdbClient } from "./tmdb-client"
import { TmdbClientV4 } from "./tmdb-client-v4"
import { SiteServiceClient, ByFilenameService, KeyValueService } from "./service"
import { Movie, Media, ListDetails } from "./tmdb/tmdb-api"
import { promiseEach } from "./utils/utils"
import { Scanner } from "./scanner"

export class App {
    server: SiteServiceClient;
    byFilename: ByFilenameService;
    keyValue: KeyValueService;
    tmdb: TmdbClient;
    tmdbV4: TmdbClientV4;

    constructor() {
        console.log("App ctor", this);
        this.server = new SiteServiceClient();
        this.byFilename = new ByFilenameService();
        this.keyValue = new KeyValueService();
        this.tmdb = new TmdbClient();
        this.tmdbV4 = new TmdbClientV4();
    }

    _initing: Promise<any>;
    init(): Promise<any> {
        if (this._initing != null)
            return this._initing;
        this._initing = promiseEach([
            () => this.initConfig(),
            () => this.tmdb.init(),
        ], t => t());
        return this._initing;
    }
    initConfig(): Promise<any> {
        return this.keyValue.findOneById<Config>({ id: "config" }).then(t => {
            this.config = t || { key: "config" };
            if (this.config.folders == null)
                this.config.folders = [];
        });

    }
    saveConfig() {
        return this.keyValue.persist(this.config);
    }

    config: Config;
    scan(): Promise<Scanner> {
        let scanner = new Scanner();
        scanner.service = this.server;
        scanner.tmdb = this.tmdb;

        scanner.folders = this.config.folders.map(t => t.path);
        console.log("scan started", scanner);
        return scanner.scan().then(() => console.log("scan completed", scanner)).then(t => scanner);

    }

}

export interface Config {
    key: string;
    folders?: ConfigFolder[];
}
export interface ConfigFolder {
    path: string;
}




