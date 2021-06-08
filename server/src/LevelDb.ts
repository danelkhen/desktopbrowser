import { Db } from "./db"
import level, { LevelDB } from "level"
import { dataDir } from "./rootDir"
import path from "path"
import fs from "fs/promises"
import { ByFilename } from "../../shared/src/contracts"

console.log(dataDir)
const database2 = path.join(dataDir, "db.level")
const db2 = level(database2, { valueEncoding: "json" })

interface LevelDbEntity {
    collection: string
    key: string
}
export class LevelDb {
    db: LevelDB
    constructor(public dbPath: string) {
        this.db = level(database2, { valueEncoding: "json" })
    }
    async getAll<T extends LevelDbEntity>(collection: string): Promise<T[]> {
        const stream = db2.createReadStream({
            gt: `${collection}/`,
            lt: `${collection}0`,
        }) as AsyncIterable<{ key: string; value: ByFilename }>
        const list: T[] = []
        for await (const item of stream) {
            const obj = { ...item.value, collection, key: item.key.replace(`${collection}/`, "") }
            list.push(obj as T)
        }
        return list
    }
    async set<T extends LevelDbEntity>(obj: T): Promise<void> {
        const { collection, key, ...rest } = obj
        await db2.put(`${collection}/${key}`, rest)
    }
}
