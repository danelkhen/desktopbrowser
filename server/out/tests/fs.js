"use strict";
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
    get children() {
        return this.getChildren();
    }
    async *getChildren() {
        let names = await fse.readdir(this.dir);
        for (let name of names) {
            let file = new File(this.dir, name);
            yield file;
            let stat = await fse.stat(name);
            if (await file.isDirectory()) {
                yield* scan(path.join(this.dir, name));
            }
        }
    }
}
exports.File = File;
main();
async function* scan(dir) {
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
