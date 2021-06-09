import { FindManyOptions, FindOneOptions } from "typeorm"
import { TmdbApiV3 as tmdb } from "../../tmdb/src"
import { ByFilename, FileService } from "./contracts"
export { FindManyOptions, FindOneOptions }
import { File } from "./contracts"

export interface App {
    getConfig(): Promise<Config>
    saveConfig(config: Config): Promise<void>
    scanForMedia(): Promise<MediaScannerStatus>
    scanStatus(): Promise<MediaScannerStatus>
    getMediaFiles(req?: GetMediaFilesRequest): Promise<MediaFile[]>
    fileService: FileService
    keyValueService: KeyValueService
}

export interface Config {
    folders?: ConfigFolder[]
}
export interface ConfigFolder {
    path: string
}
export interface KeyValueService {
    findOneById<T>(req: { id: any; options?: FindManyOptions<KeyValue<T>> }): Promise<KeyValue<T>>
    findAllWithKeyLike<T>(req: { like: string }): Promise<KeyValue<T>[]>
    persist<T>(obj: KeyValue<T>): Promise<KeyValue<T>>
}

export interface MediaScannerStatus {
    stack: number
    scanned: number
    saved: number
    lastScanned: string
    lastSaved: string
    started: Date
    finished: Date
    dir: { path: string; mtime: string }
}

export interface KeyValue<T> {
    key: string
    value: T
}

export interface GetMediaFilesRequest {
    firstResult?: number
    maxResults?: number
    notScannedOnly?: boolean
}

export interface MediaFile {
    md: ByFilename
    file?: File
    tmdb?: tmdb.MediaDetails | null
    tmdbBasic?: tmdb.TmdbMedia
    type: string
    parsed: FilenameParsedInfo | null
    fsEntry: FsEntry
}

export interface DbService<T> {
    findOneById(req: { id: any; options?: FindManyOptions<T> }): Promise<T | undefined>
    find(req: FindManyOptions<T>): Promise<T[]>
    persist(x: T): Promise<T>
    removeById(req: { id: any }): Promise<T>
}

export interface FilenameParsedInfo {
    name: string
    season: number
    episode: number
    year: number
    date: string
    tags: string[]
    filename: string
}

export interface FsEntry {
    key: string
    basename: string
    dirname: string
    extname: string
    type: string
    atime: string
    mtime: string
    ctime: string
}
