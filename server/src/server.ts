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
import { ByFilenameService } from "./service"
import { KeyValueService } from "./key-value-service"
import { RequestHandler } from "express"
import * as proxy from 'express-http-proxy';


export class Server {
    _service: FileService;
    app: express.Application;
    root: string;
    nodeModulesDir: string;
    services: {
        fs: FileService,
        byFilename: ByFilenameService,
        keyValue: KeyValueService,
    };


    init(): Promise<any> {
        console.log("os", JSON.stringify(os.platform()));
        process.on("uncaughtException", e => console.log("uncaughtException", e));

        this.root = path.join(__dirname, '../../client/');
        this.nodeModulesDir = path.join(this.root, "../");
        this._service = new FileService();
        return this._service.init()
            //.then(() => this._service.migrateToSqlite())
            .then(() => this.initServer())
            .then(() => DriveInfo.GetDrives3());
    }
    initServer() {
        this.services = {
            fs: this._service,
            byFilename: this._service.byFilename,
            keyValue: this._service.keyValue,
        };
        this.app = express();
        this.app.use(bodyParser.json());
        console.log({ root: this.root, nodeModulesDir: this.nodeModulesDir, baseName: path.basename(this.nodeModulesDir) });
        //let x = express.static(root);
        this.app.use("/_res_", express.static(this.root));
        this.app.use(express.static(this.root));
        this.app.use("/node_modules/tmdb", express.static(path.join(this.root, "../tmdb")));
        this.app.use('/tmdb_proxy', proxy('api.themoviedb.org', {}));
        console.log(path.join(this.root, "../tmdb"));

        //if (path.basename(nodeModulesDir) == "node_modules") {
        //    console.log("setting up node_modules dir");
        //    app.use("/node_modules", express.static(nodeModulesDir));
        //}



        this.app.use('/api/:service/:action', this.handleServiceRequest.bind(this));

        this.app.get(['/', '/media'], (req: express.Request, res: express.Response) => {
            res.sendFile('index.html', { root: this.root });
        });
    }



    start(): Promise<any> {
        return new Promise<any>((resolve, reject) => this.app.listen(7777, resolve));
    }

    handleServiceRequest: RequestHandler = (req, res, next) => {
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
            let result = service[action](arg);
            if (isPromise(result)) {
                let promise: Promise<any> = result;
                promise.then(t => res.json(t), e => res.status(500).json({ err: String(e) }));
            }
            else {
                res.json(result)
            }
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

function main() {
    let server = new Server();
    return server.init()
        .then(() => server.start())
        .then(() => console.log('server started: http://localhost:7777'));
}

main();