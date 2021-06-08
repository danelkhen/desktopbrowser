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
        console.log(key2)
        await db2.put(key2, rest2)
    }
}
async function main2() {
    await db2.del("giles/ggg")

    // console.log(await db2.get("files/Bless.the.Harts.S02E22.1080p.WEB.H264-CAKES[rarbg]"))
    // const x = db2.iterator({ gte: "files/", lte: "files/" })
    for await (const item of db2.createReadStream({ gt: "files/", lt: "files0" })) {
        console.log(item as any)
    }
}
// main()
main2()
