import type * as C from "contracts"
import type { Config } from "contracts"
import { promises as Fs } from "fs"
import fse from "fs-extra"
import * as Path from "path"
import { TmdbApiV3 as Tmdb } from "tmdb"
import { ByFilename, Db, FsEntry } from "./db"
import { DbService } from "./DbService"
import { FileService } from "./FileService"
import { KeyValueService } from "./KeyValueService"
import { MediaScanner } from "./MediaScanner"
import { sleep } from "shared"

export class App implements C.App {
    constructor(public db: Db) {
        this.byFilenameService = new DbService<ByFilename>(this.db, this.db.byFilename)
        this.keyValueService = new KeyValueService(this.db)
        this.fsEntryService = new FsEntryService(this.db, this.db.fsEntries)
        this.fileService = new FileService()
        this.mediaScanner = new MediaScanner()
        this.mediaScanner.app = this
    }

    fileService: FileService = undefined!
    keyValueService: KeyValueService = undefined!
    byFilenameService: DbService<ByFilename> = undefined!
    mediaScanner: MediaScanner = undefined!
    fsEntryService: FsEntryService = undefined!

    async getConfig(): Promise<Config> {
        let root = Path.join(__dirname, "../../")
        let file = "config.json"
        let path = Path.join(root, file)
        let exists = await fse.pathExists(path)
        if (!exists) return {}
        let text = await Fs.readFile(path, "utf8")
        if (text == null || text == "") return {}
        let config = JSON.parse(text) as Config
        return config
    }
    async saveConfig(config: Config): Promise<void> {
        let root = Path.join(__dirname, "../../")
        let file = "config.json"
        let path = Path.join(root, file)
        let json = JSON.stringify(config, null, "    ")
        await Fs.writeFile(path, json)
    }

    async scanForMedia(): Promise<C.MediaScannerStatus> {
        if (this.mediaScanner.isRunning()) return this.mediaScanner.status
        this.mediaScanner.scan()
        return this.mediaScanner.status
    }
    async scanStatus(): Promise<C.MediaScannerStatus> {
        return this.mediaScanner.status
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

        let q = this.db.fsEntries
            .createQueryBuilder("t")
            .leftJoinAndMapOne("t.md", ByFilename, "md", "t.basename=md.key")
        if (req!.notScannedOnly) {
            q = q.where("md.scanned is null")
        }
        q = q
            .orderBy("t.mtime", "DESC")
            .offset(req!.firstResult || 0)
            .limit(req!.maxResults || 100)
        let x = await q.getMany()
        let mfs = x.map(t => (({ fsEntry: t, md: (t as any).md, type: null, parsed: null } as unknown) as C.MediaFile))
        x.forEach(t => delete (t as any).md)

        let hasTmdbKeys = mfs.filter(t => t.md != null && t.md.tmdbKey != null)
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = Array.from(new Set(hasTmdbKeys.map(t => t.md.tmdbKey)))
            let cachePrefix = "tmdb|details|"
            let cacheKeys = tmdbKeys.map(t => cachePrefix + t)
            let cachedMediaDetails = (await this.keyValueService.dbService.repo.findByIds(
                cacheKeys
            )) as C.KeyValue<Tmdb.MediaDetails>[]
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length)
                hasTmdbKeys.filter(t => t.md.tmdbKey == tmdbKey).forEach(t => (t.tmdb = media.value))
            }
        }
        return mfs
    }
    async getMediaFiles2(req?: C.GetMediaFilesRequest): Promise<C.MediaFile[]> {
        let fsEntries = await this.db.fsEntries.find({ take: req!.maxResults, skip: req!.firstResult })
        let mds = await this.db.byFilename.find()
        let mdMap = new Map<string, ByFilename>()
        mds.forEach(md => mdMap.set(md.key, md))

        let mfs: C.MediaFile[] = fsEntries.map(
            fsEntry =>
                (({
                    fsEntry: fsEntry,
                    md: mdMap.get(fsEntry.basename),
                    type: null,
                    parsed: null,
                } as unknown) as C.MediaFile)
        )
        let hasTmdbKeys = mfs.filter(t => t.md != null && t.md.tmdbKey != null)
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = Array.from(new Set(hasTmdbKeys.map(t => t.md.tmdbKey)))
            let cachePrefix = "tmdb|details|"
            let cacheKeys = tmdbKeys.map(t => cachePrefix + t)
            let cachedMediaDetails = (await this.keyValueService.dbService.repo.findByIds(
                cacheKeys
            )) as C.KeyValue<Tmdb.MediaDetails>[]
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length)
                hasTmdbKeys.filter(t => t.md.tmdbKey == tmdbKey).forEach(t => (t.tmdb = media.value))
            }
        }
        return mfs
    }

    *testIterable() {
        for (let i = 0; i < 10; i++) yield i
    }
    async *testAsyncIterable() {
        for (let i = 0; i < 10; i++) {
            await sleep(1000)
            yield i
        }
    }
}

export class FsEntryService extends DbService<FsEntry> implements C.FsEntryService {}

//export let app = new App()
