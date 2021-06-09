import * as C from "../../shared/src/contracts"
import { LevelDb } from "./LevelDb"
import { ListFiles, GetFiles, GetFileRelatives, GetFile, Execute, Explore, Delete, trash } from "./FileService"

export function createFileService(db: LevelDb): C.FileService {
    return {
        async getFileMetadata({ key }) {
            return db.get({ collection: "files", key })
        },
        async getAllFilesMetadata() {
            return db.getAll("files")
        },
        async saveFileMetadata(req) {
            db.set({ ...req, collection: "files" })
        },
        async deleteFileMetadata({ key }) {
            db.del({ key, collection: "files" })
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
