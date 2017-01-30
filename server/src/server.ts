import "../lib/corex/corex"
import "./utils/global"
import { FileService } from "./file-service"
import * as fs from "fs";
import * as path from "path";
import * as express from "express"
import { DriveInfo } from "./utils/io"
import * as child_process from "child_process"
import * as https from "https"
import * as bodyParser from "body-parser";
import * as os from "os";
import { ByFilenameService } from "./by-filename-service"
import { KeyValueService } from "./key-value-service"
import { RequestHandler } from "express"
import * as proxy from 'express-http-proxy';
import { app, App, FsEntryService } from "./app";


export class Server {
    expApp: express.Application;
    root: string;
    nodeModulesDir: string;
    services: {
        fs: FileService,
        byFilename: ByFilenameService,
        keyValue: KeyValueService,
        fsEntry: FsEntryService,
        app:App,
    };


    app: App;
    async init(): Promise<this> {
        this.app = app;
        await this.app.init();

        console.log("os", JSON.stringify(os.platform()));
        process.on("uncaughtException", e => console.log("uncaughtException", e));

        this.root = path.join(__dirname, '../../client/');
        this.nodeModulesDir = path.join(this.root, "../");
        //await this._service.migrateToSqlite();
        await this.initServer();
        await DriveInfo.GetDrives3();
        return this;
    }
    initServer() {
        this.services = {
            fs: this.app.fileService,
            byFilename: this.app.byFilenameService,
            keyValue: this.app.keyValueService,
            fsEntry: this.app.fsEntryService,
            app:this.app,
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

        this.expApp.get(['/', '/media', '/media2'], (req: express.Request, res: express.Response) => {
            res.sendFile('index.html', { root: this.root });
        });
    }



    start(): Promise<any> {
        return new Promise<any>((resolve, reject) => this.expApp.listen(7777, resolve));
    }

    handleServiceRequest: RequestHandler = async (req, res, next) => {
        let serviceName = req.params["service"];
        let action = req.params["action"];
        let service = this.services[serviceName];
        if (service == null)
            console.error("No such service by that name:", serviceName);
        //console.log("service[action]", service, action, service[action]);

        let arg;
        if (req.method == "POST")
            arg = (req as any).body;
        else if (req.query.p != null)
            arg = JSON.parse(req.query.p);
        else
            arg = req.query;
        console.log(action, req.params, req.query);
        try {
            let result = await service[action](arg);
            res.json(result)
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
    }

}
function isPromise(obj) {
    if (obj == null)
        return false;
    return obj instanceof Promise || typeof (obj.then) == "function";
}
export let server: Server;

function main() {
    server = new Server();
    return server.init()
        .then(() => server.start())
        .then(() => console.log('server started: http://localhost:7777'));
}

main();
