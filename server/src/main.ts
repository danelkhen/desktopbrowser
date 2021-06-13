import express from "express"
import proxy from "express-http-proxy"
import http from "http"
import os from "os"
import path from "path"
import { createApi } from "./api/createApi"
import { AppDb } from "./AppDb"
import { dataDir, rootDir } from "./rootDir"
import { handleServiceRequest } from "./utils/handleServiceRequest"
import { LevelDb } from "./utils/LevelDb"
import { setupWebsockets } from "./utils/websocket"

export async function main() {
    console.log(dataDir)

    console.log("os", JSON.stringify(os.platform()))
    process.on("uncaughtException", e => console.log("uncaughtException", e))

    //    const database = path.join(dataDir, "db.sqlite")
    const database2 = path.join(dataDir, "db.level")

    const levelDb = new LevelDb(database2)
    const appDb = new AppDb(levelDb)
    const fileService = createApi(appDb)

    const services = {
        fs: fileService,
    }

    const exp = express()
    exp.use(express.json())
    exp.use("/", express.static(path.join(rootDir, "client/dist")))
    exp.use("/img", express.static(path.join(rootDir, "client/img")))
    exp.use("/tmdb", express.static(path.join(rootDir, "tmdb")))
    exp.use("/shared", express.static(path.join(rootDir, "shared")))
    exp.use("/tmdb_proxy", proxy("api.themoviedb.org", {}))

    exp.use("/api/:service/:action", handleServiceRequest(services))

    exp.get(["/", "/tray"], (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(rootDir, "client/dist/index.html"))
    })

    const server = http.createServer(exp)
    setupWebsockets(server, { fileService })

    await new Promise<void>(resolve => server.listen(7777, resolve))

    console.log("server started: http://localhost:7777")
}
