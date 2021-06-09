import express from "express"
import proxy from "express-http-proxy"
import http from "http"
import os from "os"
import path from "path"
import { App } from "./App"
import { Db } from "./db"
import { handleServiceRequest } from "./handleServiceRequest"
import { LevelDb } from "./LevelDb"
import { migrateToLevelDb } from "./migrateToLevelDb"
import { dataDir, rootDir } from "./rootDir"
import { setupWebsockets } from "./websocket"

export async function main() {
    console.log(dataDir)

    const db: Db = { byFilename: {} as any, fsEntries: {} as any, keyValue: {} as any, connection: {} as any }

    console.log("os", JSON.stringify(os.platform()))
    process.on("uncaughtException", e => console.log("uncaughtException", e))

    const database = path.join(dataDir, "db.sqlite")
    const database2 = path.join(dataDir, "db.level")

    await migrateToLevelDb(database, database2)
    const app = new App(db, new LevelDb(database2))
    const services = {
        fs: app.fileService,
        byFilename: app.byFilenameService,
        keyValue: app.keyValueService,
        fsEntry: app.fsEntryService,
        app: app,
    }

    const exp = express()
    exp.use(express.json())
    exp.use("/", express.static(path.join(rootDir, "client/dist")))
    exp.use("/img", express.static(path.join(rootDir, "client/img")))
    exp.use("/tmdb", express.static(path.join(rootDir, "tmdb")))
    exp.use("/shared", express.static(path.join(rootDir, "shared")))
    exp.use("/tmdb_proxy", proxy("api.themoviedb.org", {}))

    exp.use("/api/:service/:action", handleServiceRequest(services))

    exp.get(["/", "/test", "/media", "/media2"], (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(rootDir, "client/dist/index.html"))
    })

    const server = http.createServer(exp)
    setupWebsockets(server, app)

    await new Promise<void>((resolve, reject) => server.listen(7777, resolve))

    console.log("server started: http://localhost:7777")
}
