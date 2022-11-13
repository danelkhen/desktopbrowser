import { Level } from "level"

export interface LevelDbEntity {
    collection: string
    key: string
}
export class LevelDb {
    db: Level<string, unknown>
    constructor(public dbPath: string) {
        this.db = new Level<string, unknown>(dbPath, { valueEncoding: "json" })
    }
    async getAll<T extends LevelDbEntity>(collection: string): Promise<T[]> {
        const stream = this.db.iterator<string, T>({
            gt: `${collection}/`,
            lt: `${collection}0`,
        })
        const list: T[] = []
        for await (const [key, value] of stream) {
            const obj = { ...value, collection, key: key.replace(`${collection}/`, "") }
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

export class LevelDbCollection<T extends LevelDbEntity> {
    constructor(public db: LevelDb, public collection: string) {}
    async getAllByKeys(keys: string[]): Promise<T[]> {
        const collection = this.collection
        return await Promise.all(keys.map(key => this.db.get<T>({ collection, key })))
    }
    async getAll(): Promise<T[]> {
        return await this.db.getAll(this.collection)
    }
    async set(obj: T): Promise<void> {
        await this.db.set({ ...obj, collection: this.collection })
    }
    async del(key: string): Promise<void> {
        await this.db.del({ key, collection: this.collection })
    }
    async get(key: string): Promise<T> {
        return await this.db.get({ key, collection: this.collection })
    }
}
