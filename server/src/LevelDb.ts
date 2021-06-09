import level, { LevelDB } from "level"
import { FileInfo } from "../../shared/src/contracts"

export interface LevelDbEntity {
    collection: string
    key: string
}
export class LevelDb {
    db: LevelDB
    constructor(public dbPath: string) {
        this.db = level(dbPath, { valueEncoding: "json" })
    }
    async getAll<T extends LevelDbEntity>(collection: string): Promise<T[]> {
        const stream = this.db.createReadStream({
            gt: `${collection}/`,
            lt: `${collection}0`,
        }) as AsyncIterable<{ key: string; value: FileInfo }>
        const list: T[] = []
        for await (const item of stream) {
            const obj = { ...item.value, collection, key: item.key.replace(`${collection}/`, "") }
            list.push(obj as T)
        }
        return list
    }
    async set<T extends LevelDbEntity>(obj: T): Promise<void> {
        const { collection, key, ...rest } = obj
        await this.db.put(`${collection}/${key}`, rest)
    }
    async del(obj: LevelDbEntity): Promise<void> {
        const { collection, key } = obj
        await this.db.del(`${collection}/${key}`)
    }
    async get<T extends LevelDbEntity>(obj: LevelDbEntity): Promise<T> {
        const { collection, key } = obj
        const res = (await this.db.get(`${collection}/${key}`)) as T
        res.key = key
        res.collection = collection
        return res
    }
}
