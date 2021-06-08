// import { Db } from "./db"
// import level, { LevelDB } from "level"
// import { dataDir } from "./rootDir"
// import path from "path"
// import fs from "fs/promises"

// console.log(dataDir)
// const database2 = path.join(dataDir, "db.level")
// const db2 = level(database2, { valueEncoding: "json" })

// export async function migrateToLevelDB() {
//     const database = path.join(dataDir, "db.sqlite")
//     if ((await pathExists(database)) && !(await pathExists(database2))) {
//         const db = await Db.create()
//         const list = await db.byFilename.find()
//         for (const file of list) {
//             const { key, ...rest } = file
//             const rest2 = rest as any
//             const key2 = `files/${key}`
//             for (const prop of Object.keys(rest2)) {
//                 if (rest2[prop] == null) {
//                     delete rest2[prop]
//                 }
//             }
//             // console.log(key2)
//             await db2.put(key2, rest2)
//         }
//     }
//     await db2.close()
// }
// async function main2() {
//     // console.log(await db2.get("files/Bless.the.Harts.S02E22.1080p.WEB.H264-CAKES[rarbg]"))
//     // const x = db2.iterator({ gte: "files/", lte: "files/" })
//     for await (const item of db2.createReadStream({ gt: "files/", lt: "files0" })) {
//         console.log(item)
//     }
// }
// migrateToLevelDB()
// // main2()

// export async function pathExists(path: string) {
//     try {
//         await fs.access(path)
//         return true
//     } catch {
//         return false
//     }
// }
