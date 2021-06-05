import { Db } from "../db"

import level from "level"
const db2 = level("./db.level", { valueEncoding: "json" })

async function main() {
    const db = await Db.create()
    const list = await db.byFilename.find()
    for (const file of list) {
        const { key, ...rest } = file
        const key2 = `files/${key}`
        for (const prop of Object.keys(rest)) {
        }
    }
    // console.log(x)
    await db2.del("key")
}
main()
