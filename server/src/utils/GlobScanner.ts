import * as Path from "path"
import { promises as Fs } from "fs"
import Minimatch from "minimatch"
import { FileScanner, normalizePath } from "./FileScanner"
import fse from "fs-extra"
import { rootDir } from "../rootDir"

export class GlobScanner {
    patterns: string[] = []
    dir: string = undefined!
    onFile: (name: string) => void = undefined!
    async scan(): Promise<void> {
        let scanner = new FileScanner()
        scanner.onDirChild = async e => {
            let rel = normalizePath(Path.relative(this.dir, e.path))
            let isDir = e.stats.isDirectory()
            if (isDir) rel += "/"
            if (rel == "") return
            let ignore = false
            for (let pattern of this.patterns) {
                let res = Minimatch(rel, pattern, { nonegate: true })
                if (res) {
                    if (pattern.startsWith("!")) ignore = false
                    else ignore = true
                }
            }
            if (ignore) return false
            this.onFile(rel)
            //this.files.push(rel);
            //console.log(rel);
        }
        await scanner.scan([this.dir])
    }

    async loadGitIgnore(filename?: string): Promise<void> {
        if (filename == null) filename = Path.join(this.dir, ".gitignore")
        if (!(await fse.pathExists(filename))) return
        let patterns = await readAllLines(filename)
        patterns.splice(0, 0, ".git")
        patterns = patterns.map(t => "**/" + t)
        this.patterns.push(...patterns)
    }
}

async function readAllLines(filename: string): Promise<string[]> {
    let text = await Fs.readFile(filename, "utf8")
    const res = /\r?\n/g.exec(text)
    return Array.from(res ?? [])
}
async function listFiles(dir: string, cfg?: ListFilesOptions): Promise<string[]> {
    let x = new GlobScanner()
    let files: string[] = []
    x.dir = dir
    if (cfg && cfg.ignore) x.patterns = cfg.ignore
    if (cfg && cfg.useGitIgnoreFile) await x.loadGitIgnore()
    x.onFile = t => files.push(t)
    await x.scan()
    files.sort()
    return files
}

async function test() {
    let files = await listFiles(Path.join(rootDir, "../"), { useGitIgnoreFile: true })
    files.forEach(t => console.log(t))
}

export interface ListFilesOptions {
    useGitIgnoreFile?: boolean
    ignore?: string[]
}
