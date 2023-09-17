import { FileInfo } from "./shared/FileService"
import { LevelDbCollection, LevelDb } from "./utils/LevelDb"

export class AppDb {
    readonly files: LevelDbCollection<FileInfo>
    constructor(public db: LevelDb) {
        this.files = new LevelDbCollection<FileInfo>(this.db, "files")
    }
}
