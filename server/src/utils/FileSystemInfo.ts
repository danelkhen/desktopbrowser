import { IEnumerable } from "../../../shared/src/contracts"
import * as fse from "fs-extra"
import * as path from "path"

export class FileSystemInfo {
    protected constructor(path: string) {
        this.path = path
    }

    static async create(path: string): Promise<FileSystemInfo> {
        let x = new FileSystemInfo(path)
        await x.init()
        return x
    }

    async init() {
        let path2 = this.path
        this.Attributes = {
            HasFlag: () => false, //TODO:
        }
        if (path2 == null) return
        this.FullName = path.resolve(path2)
        this.Name = path.basename(path2)
        this.Extension = path.extname(path2)
        try {
            this.stats = await fse.lstatSync(path2)
            this.Length = this.stats.size
            this.isFile = this.stats.isFile()
            this.isDir = this.stats.isDirectory()
            this.LastWriteTime = this.stats.mtime
            this.isLink = this.stats.isSymbolicLink()
        } catch (e) {}
        if (this.Name == null || this.Name == "") {
            this.Name = this.path //console.log(path2, this);
        }
    }
    stats: fse.Stats = undefined!
    path: string
    isLink: boolean = undefined!
    isFile: boolean = undefined!
    isDir: boolean = undefined!
    Name: string = undefined!
    LastWriteTime?: Date
    Attributes?: { HasFlag: Function }
    FullName?: string
    Length?: number
    Extension?: string

    async getFiles(): Promise<IEnumerable<FileSystemInfo>> {
        return (await this.getChildren()).filter(t => t.isFile)
    }
    async getDirs(): Promise<IEnumerable<FileSystemInfo>> {
        return (await this.getChildren()).filter(t => t.isDir)
    }
    async getDescendants(): Promise<IEnumerable<FileSystemInfo>> {
        let list = await this.getChildren()
        let i = 0
        while (i < list.length) {
            let file = list[i]
            if (file.isDir) {
                let list2 = await file.getChildren()
                list.push(...list2)
            }
            i++
        }
        return list
    }
    async getChildren(): Promise<FileSystemInfo[]> {
        let list = await fse.readdir(this.path)
        let list2: FileSystemInfo[] = []
        for (let t of list) {
            list2.push(await FileSystemInfo.create(path.join(this.path, t)))
        }
        return list2
    }
}
