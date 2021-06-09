import * as C from "../../shared/src/contracts"
import { createFileService2 } from "./FileService"
import { LevelDb } from "./LevelDb"

export function createFileService(db: LevelDb): C.FileService {
    const x = createFileService2()
    const obj = x as any
    Object.keys(x.constructor.prototype)
        .filter(t => typeof obj[t] == "function")
        .forEach(t => (obj[t] = obj[t].bind(x)))

    const { ListFiles, GetFiles, GetFileRelatives, GetFile, Execute, Explore, Delete, trash } = x
    return {
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
