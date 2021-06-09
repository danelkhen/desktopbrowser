import fs from "fs/promises"
import path from "path"
import { Db } from "./media/db"
import { LevelDb } from "./LevelDb"
import { dataDir } from "./rootDir"

export async function migrateToLevelDb(database: string, database2: string) {
    if ((await pathExists(database)) && !(await pathExists(database2))) {
        const db2 = new LevelDb(database2)
        const db = await Db.create(database)
        const list = await db.byFilename.find()
        for (const file of list) {
            const rest = { ...file, collection: "files" }
            const rest2 = rest as any
            for (const prop of Object.keys(rest2)) {
                if (rest2[prop] == null) {
                    delete rest2[prop]
                }
            }
            await db2.set(rest)
        }
        await db2.db.close()
    }
}

export async function pathExists(path: string) {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}
