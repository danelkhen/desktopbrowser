import * as fs from "fs";
import * as path from "path";
import * as dirty from 'dirty';


export class KeyValueStorage<T> {
    constructor(filename: string) {
        this.filename = filename;
    }
    filename: string;
    db: dirty.Dirty<T>;
    init(): Promise<any> {
        let dir = path.dirname(this.filename);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);

        if (fs.existsSync(this.filename))
            cleanupDirtyDb(this.filename);

        this.db = dirty<T>(this.filename);
        this.db.on('drain', function () {
            console.log('All records are saved on disk now.');
        });
        return new Promise((resolve, reject) => this.db.on('load', resolve));
    }

    getBucket(key: string): Bucket<T> {
        return { key, value: this.get(key) };
    }
    getAll(): Bucket<T>[] {
        let list: Bucket<T>[] = [];
        this.db.forEach((key, value) => list.push({ key, value }));
        return list;
    }
    get(key: string): T {
        return this.db.get(key);
    }
    set(key: string, value: T): Promise<any> {
        return new Promise((resolve, reject) => this.db.set(key, value, resolve));
    }
    delete(key: string): Promise<any> {
        return new Promise((resolve, reject) => this.db.rm(key, resolve));
    }
}


function cleanupDirtyDb(filename: string) {
    let src = fs.readFileSync(filename, "utf-8");
    let lines = src.lines();
    let map: any = {};
    let list = lines.forEach(t => {
        let x = JSON.parse(t) as { key: string, value: any };
        if (x == null || x.key == null)
            return;
        map[x.key] = t;
    });
    let newKeys = Object.keys(map);
    if (newKeys.length >= lines.length)
        return;
    let newLines = newKeys.map(key => map[key] + "\n");
    fs.writeFileSync(filename + ".bak", src, { encoding: "utf-8" });
    fs.writeFileSync(filename, newLines.join(""), { encoding: "utf-8" });

}

export interface Bucket<T> {
    key: string;
    value: T;
}