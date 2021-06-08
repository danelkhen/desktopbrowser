import path from "path"
export let rootDir = path.join(__dirname, "../../../../")
export function setRootDir(v: string) {
    rootDir = v
}
export let dataDir = rootDir // process.cwd()

export function setDataDir(v: string) {
    dataDir = v
}
