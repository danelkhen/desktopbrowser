import { promises as Fs, Stats } from "fs"
import * as Path from "path"
import { orderBy, desc } from "./orderBy"

export class FileScanner {
    async onDir(obj: FileEvent): Promise<boolean | void> {}
    async onDirChildren(obj: DirChildrenEvent): Promise<void> {}
    async onError(e: any): Promise<void> {
        /*console.log(e);*/
    }
    async onDirChild(obj: FileEvent): Promise<boolean | void> {}
    manual: Manual<any> = new Manual(null)
    pause() {
        return this.manual.pause()
    }
    resume() {
        return this.manual.resume()
    }
    waitForResume() {
        return this.manual.waitForResume()
    }

    prioritizeRecentlyModified: boolean | undefined

    protected stackPush(fe: FileEvent) {
        this.stack.push(fe)
        if (this.prioritizeRecentlyModified) {
            this.stack = this.stack[orderBy](desc(t => t.stats.mtime.valueOf()))
        }
    }
    protected stackPop(): FileEvent | undefined {
        return this.stack.pop()
    }
    protected stackHasMore(): boolean {
        return this.stack.length > 0
    }

    stack: FileEvent[] = undefined!
    async scan(dirs: string[]): Promise<void> {
        this.stack = []
        for (let startDir of dirs) {
            await this.waitForResume()
            let x = { path: normalizePath(startDir), stats: null! as Stats }
            x.stats = await Fs.stat(x.path)
            this.stackPush(x)
        }
        await this._scan()
    }

    protected async _scan(): Promise<void> {
        while (this.stackHasMore()) {
            await this.waitForResume()
            let dir = this.stackPop()
            try {
                let enter = await this.onDir(dir!)
                if (enter != null && !enter) continue
                let children = await Fs.readdir(dir!.path)
                await this.onDirChildren({ dir: dir!, children })
                await this.waitForResume()
                for (let child of children) {
                    await this.waitForResume()
                    let dc = <FileEvent>{ stats: null!, path: normalizePath(Path.join(dir!.path, child)) }
                    try {
                        dc.stats = await Fs.stat(dc.path)
                    } catch (e) {
                        await this.onError(e)
                        continue
                    }
                    let enter2 = await this.onDirChild(dc)
                    if (enter2 != null && !enter2) continue
                    if (dc.stats.isDirectory()) this.stackPush(dc)
                }
            } catch (e) {
                this.onError(e)
                continue
            }
        }
    }
}

export class Manual<T> {
    private _resolve: ((value: T | PromiseLike<T>) => void) | null = null
    constructor(public defaultValue: T) {
        this.createPromise()
    }
    createPromise() {
        this._resolve = null
        this._reject = null
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }
    _paused: boolean | undefined = undefined
    pause() {
        this._paused = true
    }
    resume() {
        this._paused = false
        if (this._resolve == null) return
        let resolve = this._resolve
        this._resolve = null
        this._reject == null
        this.createPromise()
        ;(resolve as any)()
    }
    _promise: Promise<T> = undefined!
    _reject: ((reason?: any) => void) | null = null
    waitForResume(): Promise<T> {
        if (!this._paused) return Promise.resolve(this.defaultValue)
        return this._promise
    }
}

export interface DirChildrenEvent {
    dir: FileEvent
    children: string[]
}
export interface FileEvent {
    path: string
    stats: Stats
}

export function normalizePath(s: string): string {
    let s2 = s.replace(/\\/g, "/")
    return s2
}
