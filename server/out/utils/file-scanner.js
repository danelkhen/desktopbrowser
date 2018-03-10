"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../lib/corex/corex");
const Fs = require("./fs");
const Path = require("path");
class FileScanner {
    constructor() {
        this.manual = new Manual();
    }
    async onDir(obj) { }
    async onDirChildren(obj) { }
    async onError(e) { }
    async onDirChild(obj) { }
    pause() { return this.manual.pause(); }
    resume() { return this.manual.resume(); }
    waitForResume() { return this.manual.waitForResume(); }
    stackPush(fe) {
        this.stack.push(fe);
        if (this.prioritizeRecentlyModified)
            this.stack.orderByDescending(t => t.stats.mtime.valueOf());
    }
    stackPop() {
        return this.stack.pop();
    }
    stackHasMore() {
        return this.stack.length > 0;
    }
    async scan(dirs) {
        this.stack = [];
        for (let startDir of dirs) {
            await this.waitForResume();
            let x = { path: normalizePath(startDir), stats: null };
            x.stats = await Fs.stat(x.path);
            this.stackPush(x);
        }
        await this._scan();
    }
    async _scan() {
        while (this.stackHasMore()) {
            await this.waitForResume();
            let dir = this.stackPop();
            try {
                let enter = await this.onDir(dir);
                if (enter != null && !enter)
                    continue;
                let children = await Fs.readdir(dir.path);
                await this.onDirChildren({ dir, children });
                await this.waitForResume();
                for (let child of children) {
                    await this.waitForResume();
                    let dc = { stats: null, path: normalizePath(Path.join(dir.path, child)) };
                    try {
                        dc.stats = await Fs.stat(dc.path);
                    }
                    catch (e) {
                        await this.onError(e);
                        continue;
                    }
                    let enter2 = await this.onDirChild(dc);
                    if (enter2 != null && !enter2)
                        continue;
                    if (dc.stats.isDirectory())
                        this.stackPush(dc);
                }
            }
            catch (e) {
                this.onError(e);
                continue;
            }
        }
    }
}
exports.FileScanner = FileScanner;
class Manual {
    constructor() {
        this.createPromise();
    }
    createPromise() {
        this._resolve = null;
        this._reject = null;
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    pause() {
        this._paused = true;
    }
    resume() {
        this._paused = false;
        if (this._resolve == null)
            return;
        let resolve = this._resolve;
        this._resolve = null;
        this._reject == null;
        this.createPromise();
        resolve();
    }
    waitForResume() {
        if (!this._paused)
            return Promise.resolve();
        return this._promise;
    }
}
exports.Manual = Manual;
function normalizePath(s) {
    let s2 = s.replace(/\\/g, "/");
    return s2;
}
exports.normalizePath = normalizePath;
