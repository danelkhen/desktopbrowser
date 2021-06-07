import { Db } from "../db"

import level from "level"
const db2 = level("./db.level", { valueEncoding: "json" })

async function main() {
    const db = await Db.create()
    const list = await db.byFilename.find()
    for (const file of list) {
        const { key, ...rest } = file
        const rest2 = rest as any
        const key2 = `files/${key}`
        for (const prop of Object.keys(rest2)) {
            if (rest2[prop] == null) {
                delete rest2[prop]
            }
        }
        db2.put(key2, rest2)
    }
}
main()
