import { promises as Fs } from "fs"
import fse from "fs-extra"
import * as Path from "path"
import type * as M from "../../../shared/src/media"
import { TmdbApiV3 as Tmdb } from "../../../tmdb/src"
import { ByFilename, Db, FsEntry } from "../db"
import { DbService } from "../DbService"
import { KeyValueService } from "../KeyValueService"
import { MediaScanner } from "../MediaScanner"
import { rootDir } from "../rootDir"

export class MediaApp implements M.MediaApp {
    constructor(public db: Db) {
        this.byFilenameService = new DbService<ByFilename>(this.db, this.db.byFilename)
        this.keyValueService = new KeyValueService(this.db)
        this.mediaScanner = new MediaScanner()
        this.mediaScanner.app = this
    }

    keyValueService: KeyValueService = undefined!
    byFilenameService: DbService<ByFilename> = undefined!
    mediaScanner: MediaScanner = undefined!

    async getConfig(): Promise<M.Config> {
        let root = rootDir
        let file = "config.json"
        let path = Path.join(root, file)
        let exists = await fse.pathExists(path)
        if (!exists) return {}
        let text = await Fs.readFile(path, "utf8")
        if (text == null || text == "") return {}
        let config = JSON.parse(text) as M.Config
        return config
    }
    async saveConfig(config: M.Config): Promise<void> {
        let root = rootDir
        let file = "config.json"
        let path = Path.join(root, file)
        let json = JSON.stringify(config, null, "    ")
        await Fs.writeFile(path, json)
    }

    async scanForMedia(): Promise<M.MediaScannerStatus> {
        if (this.mediaScanner.isRunning()) return this.mediaScanner.status
        this.mediaScanner.scan()
        return this.mediaScanner.status
    }
    async scanStatus(): Promise<M.MediaScannerStatus> {
        return this.mediaScanner.status
    }

    async getMediaFiles(req?: M.GetMediaFilesRequest): Promise<M.MediaFile[]> {
        // let q = this.db.fsEntries
        //     .createQueryBuilder("t")
        //     .leftJoinAndMapOne("t.md", ByFilename, "md", "t.basename=md.key")
        // if (req!.notScannedOnly) {
        //     q = q.where("md.scanned is null")
        // }
        // q = q
        //     .orderBy("t.mtime", "DESC")
        //     .offset(req!.firstResult || 0)
        //     .limit(req!.maxResults || 100)
        let x: FsEntry[] = [] // await q.getMany()
        let mfs = x.map(t => (({ fsEntry: t, md: (t as any).md, type: null, parsed: null } as unknown) as M.MediaFile))
        x.forEach(t => delete (t as any).md)

        let hasTmdbKeys = mfs.filter(t => t.md != null && t.md.tmdbKey != null)
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = Array.from(new Set(hasTmdbKeys.map(t => t.md.tmdbKey)))
            let cachePrefix = "tmdb|details|"
            let cacheKeys = tmdbKeys.map(t => cachePrefix + t)
            let cachedMediaDetails = (await this.keyValueService.dbService.repo.findByIds(
                cacheKeys
            )) as M.KeyValue<Tmdb.MediaDetails>[]
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length)
                hasTmdbKeys.filter(t => t.md.tmdbKey == tmdbKey).forEach(t => (t.tmdb = media.value))
            }
        }
        return mfs
    }
    async getMediaFiles2(req?: M.GetMediaFilesRequest): Promise<M.MediaFile[]> {
        let fsEntries = await this.db.fsEntries.find({ take: req!.maxResults, skip: req!.firstResult })
        let mds = await this.db.byFilename.find()
        let mdMap = new Map<string, ByFilename>()
        mds.forEach(md => mdMap.set(md.key, md))

        let mfs: M.MediaFile[] = fsEntries.map(
            fsEntry =>
                (({
                    fsEntry: fsEntry,
                    md: mdMap.get(fsEntry.basename),
                    type: null,
                    parsed: null,
                } as unknown) as M.MediaFile)
        )
        let hasTmdbKeys = mfs.filter(t => t.md != null && t.md.tmdbKey != null)
        if (hasTmdbKeys.length > 0) {
            let tmdbKeys = Array.from(new Set(hasTmdbKeys.map(t => t.md.tmdbKey)))
            let cachePrefix = "tmdb|details|"
            let cacheKeys = tmdbKeys.map(t => cachePrefix + t)
            let cachedMediaDetails = (await this.keyValueService.dbService.repo.findByIds(
                cacheKeys
            )) as M.KeyValue<Tmdb.MediaDetails>[]
            for (let media of cachedMediaDetails) {
                let tmdbKey = media.key.substr(cachePrefix.length)
                hasTmdbKeys.filter(t => t.md.tmdbKey == tmdbKey).forEach(t => (t.tmdb = media.value))
            }
        }
        return mfs
    }
}
