import "./utils/global";
import { TmdbClient } from "./tmdb-client"
import { SiteServiceClient, ByFilenameService, KeyValueService } from "./service"
import { Movie, Media } from "./tmdb/tmdb-api"
import { promiseEach } from "./utils/utils"

export class App {
    server: SiteServiceClient;
    byFilename: ByFilenameService;
    KeyValue: KeyValueService;
    tmdb: TmdbClient;
    constructor() {
        console.log("App ctor", this);
        this.server = new SiteServiceClient();
        this.byFilename = new ByFilenameService();
        this.KeyValue = new KeyValueService();
        this.tmdb = new TmdbClient();
    }
    init(): Promise<any> {
        return promiseEach([
            () => this.initConfig(),
            () => this.tmdb.init(),
        ], t => t());
    }
    initConfig(): Promise<any> {
        return this.KeyValue.findOneById<Config>({ id: "config" }).then(t => {
            this.config = t || { key: "config" };
            if (this.config.folders == null)
                this.config.folders = [];
        });

    }

    config: Config;

}

export interface Config {
    key: string;
    folders?: ConfigFolder[];
}
export interface ConfigFolder {
    path: string;
}

