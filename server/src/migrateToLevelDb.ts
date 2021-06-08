import fs from "fs/promises"
import path from "path"
import { Db } from "./db"
import { LevelDb } from "./levelDb_"
import { dataDir } from "./rootDir"
console.log(dataDir)
const database2 = path.join(dataDir, "db.level")

export async function migrateToLevelDB() {
    const database = path.join(dataDir, "db.sqlite")
    if ((await pathExists(database)) && !(await pathExists(database2))) {
        const db2 = new LevelDb(database2)
        const db = await Db.create()
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
