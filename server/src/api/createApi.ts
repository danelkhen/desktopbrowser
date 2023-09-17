import { FileService } from "../shared/FileService"
import { ListFiles } from "./ListFiles"
import { AppDb } from "../AppDb"
import { Delete, Execute, Explore, trash } from "./api"
import { app, BrowserWindow, shell } from "electron"
import { checkForUpdates } from "./checkForUpdates"

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
        listFiles: ListFiles,
        execute: Execute,
        explore: Explore,
        del: Delete,
        trash,

        async appInspect() {
            const win = BrowserWindow.getFocusedWindow()
            win?.webContents.openDevTools({ mode: "detach" })
        },
        appOpen() {
            return shell.openExternal("http://localhost:7777")
        },
        async appExit() {
            return app.quit()
        },
        checkForUpdates() {
            return checkForUpdates()
        },
        async appGetVersion() {
            return app.getVersion()
        },
        async appHide() {
            BrowserWindow.getAllWindows().forEach(t => t.hide())
        },
    }
}
