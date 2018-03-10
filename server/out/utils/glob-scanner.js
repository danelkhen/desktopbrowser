"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../lib/corex/corex");
const Path = require("path");
const Fs = require("./fs");
const Minimatch = require("minimatch");
const file_scanner_1 = require("./file-scanner");
class GlobScanner {
    constructor() {
        this.patterns = [];
    }
    async scan() {
        let scanner = new file_scanner_1.FileScanner();
        scanner.onDirChild = async (e) => {
            let rel = file_scanner_1.normalizePath(Path.relative(this.dir, e.path));
            let isDir = e.stats.isDirectory();
            if (isDir)
                rel += "/";
            if (rel == "")
                return;
            let ignore = false;
            for (let pattern of this.patterns) {
                let res = Minimatch(rel, pattern, { nonegate: true });
                if (res) {
                    if (pattern.startsWith("!"))
                        ignore = false;
                    else
                        ignore = true;
                }
            }
            if (ignore)
                return false;
            this.onFile(rel);
            //this.files.push(rel);
            //console.log(rel);
        };
        await scanner.scan([this.dir]);
    }
    async loadGitIgnore(filename) {
        if (filename == null)
            filename = Path.join(this.dir, ".gitignore");
        if (!await Fs.exists(filename))
            return;
        let patterns = await readAllLines(filename);
        patterns.insert(0, ".git");
        patterns = patterns.map(t => "**/" + t);
        this.patterns.push(...patterns);
    }
}
exports.GlobScanner = GlobScanner;
async function readAllLines(filename) {
    let text = await Fs.readFile(filename, "utf8");
    return text.lines();
}
async function listFiles(dir, cfg) {
    let x = new GlobScanner();
    let files = [];
    x.dir = dir;
    if (cfg && cfg.ignore)
        x.patterns = cfg.ignore;
    if (cfg && cfg.useGitIgnoreFile)
        await x.loadGitIgnore();
    x.onFile = t => files.push(t);
    await x.scan();
    files.sort();
    return files;
}
async function test() {
    let files = await listFiles(Path.join(__dirname, "../../../"), { useGitIgnoreFile: true });
    files.forEach(t => console.log(t));
}
