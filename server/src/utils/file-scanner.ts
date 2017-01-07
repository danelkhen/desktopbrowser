import "../../lib/corex/corex"
import * as Fs from "./fs"
import * as Process from "process"
import * as Path from "path"

export class FileScanner {
    async onDir(obj: DirEvent): Promise<any> { }
    async onDirChildren(obj: DirChildrenEvent): Promise<any> { }
    async onError(e): Promise<any> { console.log(e); }
    async onDirChild(obj: DirChildEvent): Promise<any> { }
    manual: Manual<any> = new Manual();
    pause() { return this.manual.pause(); }
    resume() { return this.manual.resume(); }
    waitForResume() { return this.manual.waitForResume(); }



    async scan(dirs: string[]): Promise<any> {
        for (let startDir of dirs) {
            let stack: string[] = [];
            stack.push(startDir);
            while (stack.length > 0) {
                await this.waitForResume();
                let dir = stack.pop();
                try {
                    await this.onDir({ dir, path: dir });
                    let children = await Fs.readdir(dir);
                    await this.onDirChildren({ dir, children });
                    await this.waitForResume();
                    for (let child of children) {
                        await this.waitForResume();
                        let childPath = Path.join(dir, child);
                        let stats: Fs.Stats = null;
                        try {
                            stats = await Fs.stat(childPath);
                        }
                        catch (e) {
                            this.onError(e);
                            continue;
                        }
                        let dc = <DirChildEvent>{ dir, child, stats, path: childPath, };
                        await this.onDirChild(dc);
                        if (stats.isDirectory)
                            stack.push(childPath);
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

export interface DirEvent {
    dir: string;
    path: string;
}
export interface DirChildrenEvent {
    dir: string;
    children: string[];
}
export interface DirChildEvent {
    dir: string;
    child: string;
    path: string;
    stats: Fs.Stats;
}

