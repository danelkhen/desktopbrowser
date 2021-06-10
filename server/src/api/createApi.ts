import { FileService } from "../../../shared/src/contracts"
import { ListFiles } from "./ListFiles"
import { AppDb } from "../AppDb"
import { Delete, Execute, Explore, trash } from "./api"

export function createApi(db: AppDb): FileService {
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
        Execute,
        Explore,
        Delete,
        trash,
    }
}
