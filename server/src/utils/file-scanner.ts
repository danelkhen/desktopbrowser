import "../../lib/corex/corex"
import * as Fs from "./fs"
import * as Process from "process"
import * as Path from "path"

//normalize('\\foo\\bar\\baz\\');
export class FileScanner {
    async onDir(obj: FileEvent): Promise<boolean | void> { }
    async onDirChildren(obj: DirChildrenEvent): Promise<any> { }
    async onError(e): Promise<any> { /*console.log(e);*/ }
    async onDirChild(obj: FileEvent): Promise<any> { }
    manual: Manual<any> = new Manual();
    pause() { return this.manual.pause(); }
    resume() { return this.manual.resume(); }
    waitForResume() { return this.manual.waitForResume(); }



    stack:FileEvent[];
    async scan(dirs: string[]): Promise<any> {
        let stack: FileEvent[] = [];
        this.stack = stack;
        for (let startDir of dirs) {
            let x = { path: normalizePath(startDir), stats: null };
            x.stats = await Fs.stat(x.path);
            stack.push(x);
            while (stack.length > 0) {
                await this.waitForResume();
                let dir = stack.pop();
                try {
                    let enter = await this.onDir(dir);
                    if (enter != null && !enter)
                        continue;
                    let children = await Fs.readdir(dir.path);
                    await this.onDirChildren({ dir, children });
                    await this.waitForResume();
                    for (let child of children) {
                        await this.waitForResume();
                        let dc = <FileEvent>{ stats: null, path: normalizePath(Path.join(dir.path, child)) };
                        try {
                            dc.stats = await Fs.stat(dc.path);
                        }
                        catch (e) {
                            await this.onError(e);
                            continue;
                        }
                        await this.onDirChild(dc);
                        if (dc.stats.isDirectory())
                            stack.push(dc);
                    }
                }
                catch (e) {
                    this.onError(e);
                    continue;
                }
            }
        }
    }


}

export class Manual<T> {
    constructor() {
        this.createPromise();
    }
    createPromise() {
        this._resolve = null;
        this._reject = null;
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    _paused: boolean;
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
    _promise: Promise<T>;
    _resolve: (value?: T | PromiseLike<T>) => void;
    _reject: (reason?: any) => void;
    waitForResume(): Promise<any> {
        if (!this._paused)
            return Promise.resolve();
        return this._promise;
    }

}

export interface DirChildrenEvent {
    dir: FileEvent;
    children: string[];
}
export interface FileEvent {
    path: string;
    stats: Fs.Stats;
}

export function normalizePath(s: string): string {
    let s2 = s.replace(/\\/g, "/");
    return s2;
}