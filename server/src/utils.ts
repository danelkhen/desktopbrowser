import * as http from "http"
import * as tls from "tls"
import { IncomingMessage, ServerResponse } from "http"
import * as fs from "fs"
import * as fse from "fs-extra"
import * as url from "url"
import { Url } from "url"
import * as Path from "path"
import { Readable } from "stream"
import ReadableStream = NodeJS.ReadableStream;
import * as request from "request"
//import * as moment from "moment"
//import mailgun = require("mailgun-js");

String.prototype.startsWith = function (prefix): boolean { return this.indexOf(prefix) == 0; };
String.prototype.endsWith = function (suffix: string): boolean { return this.indexOf(suffix, this.length - suffix.length) !== -1; };
String.prototype.contains = function (find): boolean { return this.indexOf(find) >= 0; };
String.prototype.replaceAll = function (find: string, replace: string): string {
    let find2 = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return this.replace(new RegExp(find2, 'g'), replace);
}
Array.prototype.clear = function <T>(this: Array<T>): void { this.splice(0, this.length); }
Array.prototype.contains = function <T>(this: Array<T>, item: T): boolean { return this.indexOf(item) >= 0; }
declare global {
    interface Array<T> {
        clear(): void;
        contains(item: T): boolean;
    }
}

// maintain recent log in memory to support reflecting it to sandbox polls
let LOG_HISTORY = 1000;
export let logstart = 0;
export let logtrace: string[] = [];

// log to disk file and in-memory (see above)
//TODO: consider recycling the log as it may fill the disk at some point
export function log(s: string) {
    let timed = new Date().toISOString() + "\t" + s;
    console.log(timed);
    fs.appendFile("./opencode.log", timed + "\n", function (err) {
        if (err) {
            return console.log("failed to write to log: " + err);
        }
    });
    logtrace.push(timed);
    if (logtrace.length > LOG_HISTORY) {
        logstart += (logtrace.length - LOG_HISTORY);
        logtrace.splice(0, logtrace.length - LOG_HISTORY);
    }
}

function copyFile(source: string | Buffer, target: string | Buffer, cb: (err?: string) => void) {
    let cbCalled = false;

    let rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    let wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err?) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

export async function copyFileAsync(source: string | Buffer, target: string | Buffer) {
    return new Promise((resolve, reject) => copyFile(source, target, err => {
        if (err)
            reject(err);
        else
            resolve();
    }));
}




let mimeTypes = {
    "html": "text/html",
    "txt": "text/plain",
    "js": "application/javascript",
    "png": "image/png",
    "jpg": "image/jpg",
    "gif": "image/gif",
    "css": "text/css",
    "json": "application/json",
    "eot": "application/vnd.ms-fontobject",
    "woff": "application/x-font-woff",
    "ttf": "application/x-font-ttf",
    "svg": "image/svg+xml",
    "mp4": "video/mp4",
    "pdf": "application/pdf",
    "ico": "image/x-icon",
};


export function getContentType(resourcepath: string): string {
    let ext = Path.extname(resourcepath).substr(1);
    if (ext.indexOf('#') >= 0)
        ext = ext.substr(0, ext.indexOf('#'));
    let contentType = mimeTypes[ext];
    return contentType;
}

// read local resource file and write to response
// stream video files through HTTP range requests so playback starts sooner
export async function writeResourceFile(resp: ServerResponse, resourcepath: string, opts?: { contentType?: string }): Promise<boolean> {
    if (opts == null)
        opts = {};
    let contentType = opts.contentType || getContentType(resourcepath); // contenttypes[ext];
    if (contentType == null)
        return false;
    let filepath = resourcepath; //("." + resourcepath);
    // without HTTP header range return the entire file
    //return res.sendStatus(416); // 416 Wrong range
    try {
        let data = await fse.readFile(filepath, 'binary');
        console.log("writing " + data.length + " bytes");
        resp.statusCode = 200;
        resp.setHeader("Content-Type", contentType);
        resp.end(data, 'binary');
    }
    catch (err) {
        resp.statusCode = 400;
        resp.statusMessage = err;
        resp.end();
    }
    return true;
}

/** with range return just the request range */
export async function writeResourceFileRange(resp: ServerResponse, resourcepath: string, range: string, opts?: { contentType?: string }): Promise<boolean> {
    let filepath = resourcepath; //("." + resourcepath);

    try {
        let stats = await fse.stat(filepath);
        let positions = range.replace(/bytes=/, "").split("-");
        let start = parseInt(positions[0], 10);
        let total = stats.size;
        let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        let chunksize = (end - start) + 1;

        resp.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        let stream = fs.createReadStream(filepath, { start: start, end: end, autoClose: true });
        await copyStream(stream, resp);
        resp.end();
        //.on("open", function () {
        //    stream.pipe(resp);
        //}).on("error", function (err) {
        //    resp.end(err);
        //});
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            resp.statusCode = 404;
            return false;
        }
        resp.end(err);
    }
    return true;
}






/** Copies a stream from src to dest, resolves when copy finishes, rejects on any error */
export async function copyStream(src: NodeJS.ReadableStream, dest: NodeJS.WritableStream): Promise<any> {
    return new Promise((resolve, reject) => {
        src.on('error', reason => {
            log("copyStream src stream error " + reason);
            reject(reason);
        });
        dest.on('error', reason => {
            log("copyStream dest stream error " + reason);
            reject(reason);
        });
        src.on("end", () => {
            //log("copyStream src stream end");
            resolve();
        });
        src.pipe(dest);
    });
}

export async function readStreamToEnd(src: NodeJS.ReadableStream): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        let sb: string[] = [];
        src.on('error', reject);
        src.on("data", data => sb.push(data));
        src.on("end", () => resolve(sb));
    });
}

export function isReadableStream(x): x is NodeJS.ReadableStream {
    return x instanceof Readable;
}

export function sleep(ms?: number): Promise<any> { return new Promise((resolve, reject) => global.setTimeout(resolve, ms || 0)); }


export async function time(action: () => any): Promise<number> {
    let start = process.hrtime();
    await action();
    let end = process.hrtime(start);
    return (end[0] / 1000) + (end[1] / 1000000);
}


//export function now(): string {
//    return moment().format("YYYY-MM-DD HH:mm:ss");
//}


export function watchForNextChange(file: string): Promise<{ event: string, filename: string }> {
    return new Promise((resolve, reject) => {
        let watcher = fse.watch(file, (event, filename) => {
            watcher.close();
            resolve({ event, filename });
        });
    });
}



export function getBaseUrl(req: IncomingMessage): string {
    let host = getHost(req);
    let protocol = getProtocol(req);
    return `${protocol}://${host}`;
}
export function getHost(req: IncomingMessage): string {
    return (req.headers.host as string) || "";
}
/**
 * load balancer headers when lb unwraps ssl
  'x-forwarded-for: 5.57.21.49',
  'x-forwarded-port: 443',
  'x-forwarded-proto: https' ]
 * @param req
 */
export function getProtocol(req: IncomingMessage): "http" | "https" {
    let proto = req.headers["x-forwarded-proto"] as string;
    if (proto != null)
        return proto as any;
    let conn = req.connection as tls.TLSSocket;
    return conn.encrypted ? "https" : "http";
}

export function getFullUrl(req: IncomingMessage): string {
    return getBaseUrl(req) + req.url;
}


export class Response implements ResponseArgs {
    constructor(args?: ResponseArgs) {
        if (args == null)
            return;
        Object.keys(args).forEach(key => this[key] = args[key]);
    }
    statusCode: number;
    statusMessage: string;
    contentType: string;
    content: ReadableStream | Buffer | string | number | boolean | object;
    handle: (req: IncomingMessage, resp: ServerResponse) => Promise<any>;
    headers: any;
    redirectTo: string;
    leaveUnfinished: boolean;
}
export interface ResponseArgs {
    statusCode?: number;
    statusMessage?: string;
    contentType?: string;
    content?: ReadableStream | string | number | boolean | object;
    handle?: (req: IncomingMessage, resp: ServerResponse) => Promise<any>;
    redirectTo?: string;
    leaveUnfinished?: boolean;
    headers?: any;
}


export interface Request2Response {
    error?: any,
    response?: request.RequestResponse,
    body?: any,
    request?: request.Request,
}

export interface Request2Options extends request.CoreOptions {
    uri?: string | Url;
    url?: string | Url;
}
export function request2(opts: Request2Options): Promise<Request2Response> {
    return new Promise((resolve, reject) => {
        let res: Request2Response = {};
        res.request = request(opts as any, (error: any, response: request.RequestResponse, body: any) => {
            res.body = body;
            res.error = error;
            res.response = response;
            resolve(res);
        });
    });
}



export function cached() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let func = target[propertyKey];
        let first = false;
        let lastValue: any;
        descriptor.value = function () {
            if (!first) {
                lastValue = func.call(this);
                first = true;
            }
            return lastValue;
        }
    };
}