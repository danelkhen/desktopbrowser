import { app } from "electron"
import path from "path"

export const rootDir = app?.getAppPath() ?? path.join(__dirname, "../../../../")
export const dataDir = app?.getPath("userData") ?? rootDir
