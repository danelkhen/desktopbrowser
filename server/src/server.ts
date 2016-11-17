import "./global"
import "../lib/corex/corex"
import { SiteService } from "./service"
import * as fs from "fs";
import * as path from "path";
import * as express from "express"
import { DriveInfo } from "./utils/io"
import * as child_process from "child_process"
import * as https from "https"

let root = path.join(__dirname, '../../client/');
let nodeModulesDir = path.join(root, "../");
let service = new SiteService();
service.init();

process.on("uncaughtException", e => console.log("uncaughtException", e));

let app = express();
console.log({ root, nodeModulesDir, baseName: path.basename(nodeModulesDir) });
app.use(express.static(root));

//if (path.basename(nodeModulesDir) == "node_modules") {
//    console.log("setting up node_modules dir");
//    app.use("/node_modules", express.static(nodeModulesDir));
//}

function isPromise(obj) {
    if (obj == null)
        return false;
    return obj instanceof Promise || typeof (obj.then) == "function";
}
app.get('/api/:action', (req: express.Request, res: express.Response) => {
    let action = req.params["action"];
    console.log(action, req.params, req.query);
    try {
        let result = service[action](req.query);
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
});

app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile('index.html', { root });
});

//var key = fs.readFileSync(path.join(__dirname, "../ssl/key.pem"));
//var cert = fs.readFileSync(path.join(__dirname, "../ssl/cert.pem"));

DriveInfo.GetDrives3().then(drives => {
    console.log(drives.map(t => t.Name));
    //https.createServer({ key, cert }, app).listen(7777, () => {
    //    console.log('Example app listening on port 7777!');
    //});
    app.listen(7777, () => {
        console.log('Example app listening on port 7777!');
    });
});


