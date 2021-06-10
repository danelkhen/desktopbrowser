import { FileInfo } from "../../shared/src/contracts"
import { LevelDbCollection, LevelDb } from "./utils/LevelDb"

export class AppDb {
    files: LevelDbCollection<FileInfo>
    constructor(public db: LevelDb) {
        this.files = new LevelDbCollection<FileInfo>(this.db, "files")
    }
}
