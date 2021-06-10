import * as C from "../../shared/src/contracts"
import { LevelDb } from "./utils/LevelDb"
import { AppDb } from "./AppDb"
import { ListFiles, GetFiles, GetFileRelatives, GetFile, Execute, Explore, Delete, trash } from "./FileService"

export function createFileService(db: AppDb): C.FileService {
    return {
        async getFileMetadata({ key }) {
            return db.files.get(key)
        },
        async getAllFilesMetadata() {
            return db.files.getAll()
        },
        async saveFileMetadata(req) {
            db.files.set(req)
        },
        async deleteFileMetadata({ key }) {
            db.files.del(key)
        },
        ListFiles,
        GetFiles,
        GetFileRelatives,
        GetFile,
        Execute,
        Explore,
        Delete,
        trash,
    }
}
