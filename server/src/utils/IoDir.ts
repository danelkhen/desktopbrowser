import * as fse from "fs-extra"

export namespace IoDir {
    export async function Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        let stat = await fse.stat(s)
        return stat.isDirectory()
    }
}
