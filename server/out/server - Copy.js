"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib/corex/corex");
require("./utils/global");
const path = require("path");
const express = require("express");
const io_1 = require("./utils/io");
const bodyParser = require("body-parser");
const os = require("os");
const proxy = require("express-http-proxy");
const app_1 = require("./app");
const http = require("http");
const ws = require("ws");
class Server {
    constructor() {
        this.handleServiceRequest = async (req, res, next) => {
            let serviceName = req.params["service"];
            let action = req.params["action"];
            let service = this.services[serviceName];
            if (service == null)
                console.error("No such service by that name:", serviceName);
            //console.log("service[action]", service, action, service[action]);
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
                res.json(result);
                //if (isPromise(result)) {
                //    let promise: Promise<any> = result;
                //    promise.then(t => res.json(t), e => res.status(500).json({ err: String(e) }));
                //}
                //else {
                //    res.json(result)
                //}
            }
            catch (e) {
                console.log("api action error", e);
                res.status(500).json({ err: e.toString() });
            }
        };
    }
    async init() {
        this.app = app_1.app;
        await this.app.init();
        console.log("os", JSON.stringify(os.platform()));
        process.on("uncaughtException", e => console.log("uncaughtException", e));
        this.root = path.join(__dirname, '../../client/');
        this.nodeModulesDir = path.join(this.root, "../");
        //await this._service.migrateToSqlite();
        await this.initServer();
        await io_1.DriveInfo.GetDrives3();
        return this;
    }
    initServer() {
        this.services = {
            fs: this.app.fileService,
            byFilename: this.app.byFilenameService,
            keyValue: this.app.keyValueService,
            fsEntry: this.app.fsEntryService,
            app: this.app,
        };
        this.expApp = express();
        this.expApp.use(bodyParser.json());
        console.log({ root: this.root, nodeModulesDir: this.nodeModulesDir, baseName: path.basename(this.nodeModulesDir) });
        //let x = express.static(root);
        this.expApp.use("/_res_", express.static(this.root));
        this.expApp.use(express.static(this.root));
        this.expApp.use("/node_modules/tmdb", express.static(path.join(this.root, "../tmdb")));
        this.expApp.use('/tmdb_proxy', proxy('api.themoviedb.org', {}));
        console.log(path.join(this.root, "../tmdb"));
        //if (path.basename(nodeModulesDir) == "node_modules") {
        //    console.log("setting up node_modules dir");
        //    app.use("/node_modules", express.static(nodeModulesDir));
        //}
        this.expApp.use('/api/:service/:action', this.handleServiceRequest.bind(this));
        this.expApp.get(['/', '/media', '/media2'], (req, res) => {
            res.sendFile('index.html', { root: this.root });
        });
        this.server = http.createServer(this.expApp);
        this.setupWebsockets(this.server);
    }
    start() {
        return new Promise((resolve, reject) => this.expApp.listen(7777, resolve));
    }
    setupWebsockets(server) {
        const wss = new ws.Server({ server });
        wss.on('connection', (ws, req) => {
            console.log("wss.onconnection", req.url);
            //const url2 = url.parse(req.url, true);
            //console.log("wss.onconnection", url2, url2.query);
            //let queueId = (url2.query as any).queue;
            //console.log("ws queueid", queueId);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            //ws.on('message', message => {
            //    console.log('ws.message received: %s', message);
            //    //ws.send(JSON.stringify('you sent '+message));
            //});
            ws.on('error', e => console.log('ws.error', e));
            //ws.send(JSON.stringify('something'));
        });
    }
}
exports.Server = Server;
function isPromise(obj) {
    if (obj == null)
        return false;
    return obj instanceof Promise || typeof (obj.then) == "function";
}
async function main() {
    exports.server = new Server();
    await exports.server.init();
    await exports.server.start();
    console.log('server started: http://localhost:7777');
}
main();
