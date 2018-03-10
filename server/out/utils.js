"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fse = require("fs-extra");
const Path = require("path");
const stream_1 = require("stream");
const request = require("request");
//import * as moment from "moment"
//import mailgun = require("mailgun-js");
String.prototype.startsWith = function (prefix) { return this.indexOf(prefix) == 0; };
String.prototype.endsWith = function (suffix) { return this.indexOf(suffix, this.length - suffix.length) !== -1; };
String.prototype.contains = function (find) { return this.indexOf(find) >= 0; };
String.prototype.replaceAll = function (find, replace) {
    let find2 = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return this.replace(new RegExp(find2, 'g'), replace);
};
Array.prototype.clear = function () { this.splice(0, this.length); };
Array.prototype.contains = function (item) { return this.indexOf(item) >= 0; };
// maintain recent log in memory to support reflecting it to sandbox polls
let LOG_HISTORY = 1000;
exports.logstart = 0;
exports.logtrace = [];
// log to disk file and in-memory (see above)
//TODO: consider recycling the log as it may fill the disk at some point
function log(s) {
    let timed = new Date().toISOString() + "\t" + s;
    console.log(timed);
    fs.appendFile("./opencode.log", timed + "\n", function (err) {
        if (err) {
            return console.log("failed to write to log: " + err);
        }
    });
    exports.logtrace.push(timed);
    if (exports.logtrace.length > LOG_HISTORY) {
        exports.logstart += (exports.logtrace.length - LOG_HISTORY);
        exports.logtrace.splice(0, exports.logtrace.length - LOG_HISTORY);
    }
}
exports.log = log;
function copyFile(source, target, cb) {
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
    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}
async function copyFileAsync(source, target) {
    return new Promise((resolve, reject) => copyFile(source, target, err => {
        if (err)
            reject(err);
        else
            resolve();
    }));
}
exports.copyFileAsync = copyFileAsync;
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
function getContentType(resourcepath) {
    let ext = Path.extname(resourcepath).substr(1);
    if (ext.indexOf('#') >= 0)
        ext = ext.substr(0, ext.indexOf('#'));
    let contentType = mimeTypes[ext];
    return contentType;
}
exports.getContentType = getContentType;
// read local resource file and write to response
// stream video files through HTTP range requests so playback starts sooner
async function writeResourceFile(resp, resourcepath, opts) {
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
exports.writeResourceFile = writeResourceFile;
/** with range return just the request range */
async function writeResourceFileRange(resp, resourcepath, range, opts) {
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
exports.writeResourceFileRange = writeResourceFileRange;
/** Copies a stream from src to dest, resolves when copy finishes, rejects on any error */
async function copyStream(src, dest) {
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
exports.copyStream = copyStream;
async function readStreamToEnd(src) {
    return new Promise((resolve, reject) => {
        let sb = [];
        src.on('error', reject);
        src.on("data", data => sb.push(data));
        src.on("end", () => resolve(sb));
    });
}
exports.readStreamToEnd = readStreamToEnd;
function isReadableStream(x) {
    return x instanceof stream_1.Readable;
}
exports.isReadableStream = isReadableStream;
function sleep(ms) { return new Promise((resolve, reject) => global.setTimeout(resolve, ms || 0)); }
exports.sleep = sleep;
async function time(action) {
    let start = process.hrtime();
    await action();
    let end = process.hrtime(start);
    return (end[0] / 1000) + (end[1] / 1000000);
}
exports.time = time;
//export function now(): string {
//    return moment().format("YYYY-MM-DD HH:mm:ss");
//}
function watchForNextChange(file) {
    return new Promise((resolve, reject) => {
        let watcher = fse.watch(file, (event, filename) => {
            watcher.close();
            resolve({ event, filename });
        });
    });
}
exports.watchForNextChange = watchForNextChange;
function getBaseUrl(req) {
    let host = getHost(req);
    let protocol = getProtocol(req);
    return `${protocol}://${host}`;
}
exports.getBaseUrl = getBaseUrl;
function getHost(req) {
    return req.headers.host || "";
}
exports.getHost = getHost;
/**
 * load balancer headers when lb unwraps ssl
  'x-forwarded-for: 5.57.21.49',
  'x-forwarded-port: 443',
  'x-forwarded-proto: https' ]
 * @param req
 */
function getProtocol(req) {
    let proto = req.headers["x-forwarded-proto"];
    if (proto != null)
        return proto;
    let conn = req.connection;
    return conn.encrypted ? "https" : "http";
}
exports.getProtocol = getProtocol;
function getFullUrl(req) {
    return getBaseUrl(req) + req.url;
}
exports.getFullUrl = getFullUrl;
class Response {
    constructor(args) {
        if (args == null)
            return;
        Object.keys(args).forEach(key => this[key] = args[key]);
    }
}
exports.Response = Response;
function request2(opts) {
    return new Promise((resolve, reject) => {
        let res = {};
        res.request = request(opts, (error, response, body) => {
            res.body = body;
            res.error = error;
            res.response = response;
            resolve(res);
        });
    });
}
exports.request2 = request2;
function cached() {
    return function (target, propertyKey, descriptor) {
        let func = target[propertyKey];
        let first = false;
        let lastValue;
        descriptor.value = function () {
            if (!first) {
                lastValue = func.call(this);
                first = true;
            }
            return lastValue;
        };
    };
}
exports.cached = cached;
