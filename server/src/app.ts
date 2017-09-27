import { Server } from "./server"
import { Config } from "contracts"
import * as C from "contracts"
import { ByFilenameService } from "./by-filename-service"
import { KeyValueService } from "./key-value-service"
import { FileService } from "./file-service"
import { DbService } from "./db-service"
import { Db, ByFilename, KeyValue, FsEntry } from "./db"
import { MediaScanner } from "./media-scanner"
import * as Fs from "./utils/fs"
import * as Path from "path"
import * as Tmdb from "tmdb-v3"

export class App implements C.App {
    server: Server;
    fileService: FileService;
    db: Db;
    keyValueService: KeyValueService;
    byFilenameService: ByFilenameService;
    mediaScanner: MediaScanner;
    fsEntryService: FsEntryService;

    async getConfig(): Promise<Config> {
        let root = Path.join(__dirname, "../../");
        let file = "config.json";
        let path = Path.join(root, file);
        let exists = await Fs.exists(path);
        if (!exists)
            return {};
        let text = await Fs.readFile(path, "utf8");
        if (text == null || text == "")
            return {};
        let config = JSON.parse(text) as Config;
        return config;
    }
    async saveConfig(config: Config): Promise<any> {
        let root = Path.join(__dirname, "../../");
        let file = "config.json";
        let path = Path.join(root, file);
        let json = JSON.stringify(config, null, "    ");
        await Fs.writeFile(path, json);
    }

    async getConfig2(): Promise<Config> {
        let config2 = await this.keyValueService.findOneById<Config>({ id: "config" });
        let config = (config2 && config2.value) || {};
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

    async scanForMedia(): Promise<C.MediaScannerStatus> {
        if (this.mediaScanner.isRunning())
            return this.mediaScanner.status;
        this.mediaScanner.scan();
        return this.mediaScanner.status;
    }
    scanStatus(): C.MediaScannerStatus {
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
        q = q.orderBy("t.mtime", "DESC").offset(req.firstResult || 0).limit(req.maxResults || 100);
        //.where()
        ;

        let x = await q.getMany();
        let mfs = x.map(t => <C.MediaFile>{ fsEntry: t, md: (t as any).md, type: null, parsed: null });
        x.forEach(t => delete (t as any).md);

        let hasTmdbKeys = mfs.where(t => t.md != null && t.md.tmdbKey != null);
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = hasTmdbKeys.select(t => t.md.tmdbKey).distinct();
            let cachePrefix = "tmdb|details|";
            let cacheKeys = tmdbKeys.select(t => cachePrefix + t);
            let cachedMediaDetails = await this.keyValueService.dbService.repo.findByIds(cacheKeys) as C.KeyValue<Tmdb.MediaDetails>[];
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length);
                hasTmdbKeys.where(t => t.md.tmdbKey == tmdbKey).forEach(t => t.tmdb = media.value);
            }
        }
        return mfs;
    }
    async getMediaFiles2(req?: C.GetMediaFilesRequest): Promise<C.MediaFile[]> {
        let fsEntries = await this.db.fsEntries.find({ take: req.maxResults, skip: req.firstResult });
        let mds = await this.db.byFilename.find();
        let mdMap = new Map<string, ByFilename>();
        mds.forEach(md => mdMap.set(md.key, md));

        let mfs: C.MediaFile[] = fsEntries.map(fsEntry => <C.MediaFile>{ fsEntry: fsEntry, md: mdMap.get(fsEntry.basename), type: null, parsed: null });
        let hasTmdbKeys = mfs.where(t => t.md != null && t.md.tmdbKey != null);
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = hasTmdbKeys.select(t => t.md.tmdbKey).distinct();
            let cachePrefix = "tmdb|details|";
            let cacheKeys = tmdbKeys.select(t => cachePrefix + t);
            let cachedMediaDetails = await this.keyValueService.dbService.repo.findByIds(cacheKeys) as C.KeyValue<Tmdb.MediaDetails>[];
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length);
                hasTmdbKeys.where(t => t.md.tmdbKey == tmdbKey).forEach(t => t.tmdb = media.value);
            }
        }
        return mfs;
    }

}

export class FsEntryService extends DbService<FsEntry> implements C.FsEntryService {
}

export let app = new App();


