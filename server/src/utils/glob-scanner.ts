import "../../lib/corex/corex"
import * as Path from "path"
import * as Fs from "./fs"
import * as Minimatch from "minimatch"
import { FileScanner, normalizePath } from "./file-scanner"

export class GlobScanner {
    patterns: string[] = [];
    dir: string;
    onFile: (name: string) => void;
    async scan(): Promise<any> {
        let scanner = new FileScanner();
        scanner.onDirChild = async e => {
            let rel = normalizePath(Path.relative(this.dir, e.path));
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

    async loadGitIgnore(filename?: string): Promise<any> {
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

async function readAllLines(filename: string): Promise<string[]> {
    let text = await Fs.readFile(filename, "utf8");
    return text.lines();
}
async function listFiles(dir: string, cfg?: ListFilesOptions): Promise<string[]> {
    let x = new GlobScanner();
    let files: string[] = [];
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

export interface ListFilesOptions {
    useGitIgnoreFile?: boolean;
    ignore?: string[];
}
