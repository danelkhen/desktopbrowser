import bodyParser from "body-parser"
import express from "express"
import proxy from "express-http-proxy"
import http from "http"
import os from "os"
import path from "path"
import { App } from "./App"
import { DriveInfo } from "./utils/io"
import { setupWebsockets } from "./websocket"
import { Db } from "./db"
import { dataDir, rootDir } from "./rootDir"
import { handleServiceRequest } from "./handleServiceRequest"
import { LevelDb } from "./LevelDb"

export async function main() {
    const db: Db = { byFilename: {} as any, fsEntries: {} as any, keyValue: {} as any, connection: {} as any }
    // await Db.create()
    const app = new App(db, new LevelDb(path.join(dataDir, "db.level")))

    console.log("os", JSON.stringify(os.platform()))
    process.on("uncaughtException", e => console.log("uncaughtException", e))

    //await _service.migrateToSqlite();
    const services = {
        fs: app.fileService,
        byFilename: app.byFilenameService,
        keyValue: app.keyValueService,
        fsEntry: app.fsEntryService,
        app: app,
    }

    const exp = express()
    exp.use(bodyParser.json())
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

    await DriveInfo.GetDrives3()

    await new Promise<void>((resolve, reject) => server.listen(7777, resolve))

    console.log("server started: http://localhost:7777")
}
