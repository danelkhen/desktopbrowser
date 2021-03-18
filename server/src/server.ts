import "module-alias/register"
import bodyParser from "body-parser"
import express, { RequestHandler } from "express"
import proxy from "express-http-proxy"
import http from "http"
import os from "os"
import path from "path"
import { App } from "./App"
import { DriveInfo } from "./utils/io"
import { setupWebsockets } from "./websocket"
import { Db } from "./db"

async function main() {
    const db = await Db.create()
    const app = new App(db)

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
    exp.use("/", express.static(path.join(__dirname, "../../client/dist")))
    exp.use("/img", express.static(path.join(__dirname, "../../client/img")))
    exp.use("/tmdb", express.static(path.join(__dirname, "../../tmdb")))
    exp.use("/shared", express.static(path.join(__dirname, "../../shared")))
    exp.use("/tmdb_proxy", proxy("api.themoviedb.org", {}))

    exp.use("/api/:service/:action", handleServiceRequest(services))

    exp.get(["/", "/test", "/media", "/media2"], (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
    })

    const server = http.createServer(exp)
    setupWebsockets(server, app)

    await DriveInfo.GetDrives3()

    await new Promise<void>((resolve, reject) => server.listen(7777, resolve))

    console.log("server started: http://localhost:7777")
}

function handleServiceRequest(services: {}) {
    const x: RequestHandler = async (req, res, next) => {
        let serviceName = req.params["service"]
        let action = req.params["action"]
        let service = (services as any)[serviceName]
        if (service == null) {
            console.error("No such service by that name:", serviceName)
        }

        let arg: any
        if (req.method == "POST") arg = (req as any).body
        else if (req.query.p != null) arg = JSON.parse(req.query.p as any)
        else arg = req.query
        console.log(action, req.params, req.query)
        try {
            let result = await service[action](arg)
            res.json(result ?? null)
        } catch (e) {
            console.log("api action error", e)
            res.status(500).json({ err: e.toString() }) ///
        }
    }
    return x
}

main()
