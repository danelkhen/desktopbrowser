"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const App_1 = require("./App");
const io_1 = require("./utils/io");
const websocket_1 = require("./websocket");
const db_1 = require("./db");
async function main() {
    const db = await db_1.Db.create();
    const app = new App_1.App(db);
    console.log("os", JSON.stringify(os_1.default.platform()));
    process.on("uncaughtException", e => console.log("uncaughtException", e));
    //await _service.migrateToSqlite();
    const services = {
        fs: app.fileService,
        byFilename: app.byFilenameService,
        keyValue: app.keyValueService,
        fsEntry: app.fsEntryService,
        app: app,
    };
    const exp = express_1.default();
    exp.use(body_parser_1.default.json());
    exp.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
    exp.use("/img", express_1.default.static(path_1.default.join(__dirname, "../../client/img")));
    exp.use("/tmdb", express_1.default.static(path_1.default.join(__dirname, "../../tmdb")));
    exp.use("/shared", express_1.default.static(path_1.default.join(__dirname, "../../shared")));
    exp.use("/tmdb_proxy", express_http_proxy_1.default("api.themoviedb.org", {}));
    exp.use("/api/:service/:action", handleServiceRequest(services));
    exp.get(["/", "/test", "/media", "/media2"], (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../../client/dist/index.html"));
    });
    const server = http_1.default.createServer(exp);
    websocket_1.setupWebsockets(server, app);
    await io_1.DriveInfo.GetDrives3();
    await new Promise((resolve, reject) => server.listen(7777, resolve));
    console.log("server started: http://localhost:7777");
}
function handleServiceRequest(services) {
    const x = async (req, res, next) => {
        let serviceName = req.params["service"];
        let action = req.params["action"];
        let service = services[serviceName];
        if (service == null) {
            console.error("No such service by that name:", serviceName);
        }
        let arg;
        if (req.method == "POST")
            arg = req.body;
        else if (req.query.p != null)
            arg = JSON.parse(req.query.p);
        else
            arg = req.query;
        console.log(action, req.params, req.query);
        try {
            let result = await service[action](arg);
            res.json(result !== null && result !== void 0 ? result : null);
        }
        catch (e) {
            console.log("api action error", e);
            res.status(500).json({ err: e.toString() }); ///
        }
    };
    return x;
}
main();
