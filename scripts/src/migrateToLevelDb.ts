import fs from "fs/promises"
import { LevelDb } from "../../server/src/utils/LevelDb"
import { AppDb } from "../../server/src/AppDb"
import { Db } from "./db"
import path from "path"

export async function migrateToLevelDb(database: string, database2: string) {
    const db2 = new AppDb(new LevelDb(database2)).files
    const db = await Db.create(database)
    const list = await db.byFilename.find()
    for (const file of list) {
        if (await db2.get(file.key)) {
            console.log(`${file.key} already exists, skipping`)
            continue
        }
        const rest = { ...file, collection: "files" }
        const rest2 = rest as any
        for (const prop of Object.keys(rest2)) {
            if (rest2[prop] == null) {
                delete rest2[prop]
            }
        }
        await db2.set(rest)
    }
    await db2.db.db.close()
}

export async function pathExists(path: string) {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

async function main() {
    const dir = `${process.env.HOME}/Library/Application Support/desktopbrowser`
    const src = path.join(dir, "db.sqlite")
    const dst = path.join(dir, "db.level")

    if (!(await pathExists(src))) {
        console.log("source db not found", src)
        return
    }

    await migrateToLevelDb(src, dst)
}
main()
