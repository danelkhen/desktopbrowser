"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const path = require("path");
async function main() {
    let dir = "C:\\Users\\dkhen\\Downloads";
    //for (let iterator = scan(null), res = await iterator.next("yyy"); !res.done; res = await iterator.next("ggg")) {
    //    console.log("value=", res.value);
    //}
    let iterator = scan(dir);
    while (true) {
        let item = await iterator.next("yyy1");
        console.log(item.value, item.done);
        if (item.done)
            break;
    }
    //item.done;
    //for await (let x of scan(null)) {
    //}
}
class File {
    constructor(dir, name) {
        if (name == null) {
            this._path = dir;
            return;
        }
        this._dir = dir;
        this._name = name;
    }
    async isDirectory() {
        return (await this.stat).isDirectory;
    }
    get stat() {
        if (this._stat)
            return this._stat;
        this._stat = fse.stat(this.path);
        return this._stat;
    }
    get name() {
        if (this._name != null)
            return this._name;
        this._name = path.basename(this.path);
        return this._name;
    }
    get dir() {
        if (this._dir != null)
            return this._dir;
        this._dir = path.dirname(this.path);
        return this._dir;
    }
    get path() {
        if (this._path)
            return this._path;
        this._path = path.join(this.dir, this.name);
        return this._path;
    }
    async get () { }
    *children() {
        let names = await fse.readdir(dir);
        for (let name of names) {
            let file = new File(dir, name);
            yield file;
            let stat = await fse.stat(name);
            if (await file.isDirectory()) {
                yield* scan(path.join(dir, name));
            }
        }
    }
}
exports.File = File;
main();
function scan(dir) {
    return __asyncGenerator(this, arguments, function* scan_1() {
        let names = yield __await(fse.readdir(dir));
        for (let name of names) {
            let file = new File(dir, name);
            yield file;
            let stat = yield __await(fse.stat(name));
            if (yield __await(file.isDirectory())) {
                yield __await(yield* __asyncDelegator(__asyncValues(scan(path.join(dir, name)))));
            }
        }
    });
}
