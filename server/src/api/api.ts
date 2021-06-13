import * as child_process from "child_process"
import open from "open"
import * as os from "os"
import trash2 from "trash"
import { FileService } from "../../../shared/src/FileService"
import { quote } from "./ListFiles"
import { IoDir } from "../io/IoDir"
import { IoFile } from "../io/IoFile"

export const Execute: FileService["execute"] = async req => {
    const filename = req.Path
    const p = await open(filename)
}

export const Explore: FileService["explore"] = async req => {
    const cmd = os.platform() === "darwin" ? "open" : "explorer"
    child_process.exec(`${cmd} ${quote(req.Path)}`)
}

export const Delete: FileService["del"] = async req => {
    const path = req.Path
    if (await IoFile.Exists(path)) {
        await IoFile.Delete(path)
        return
    }
    if (await IoDir.Exists(path)) {
        if (path.split("\\").length <= 2)
            throw new Error(
                "Delete protection, cannot delete path so short, should be at least depth of 3 levels or more"
            )
        //IoDir.Delete(path, true);
        await IoDir.del(path)
    }
}

export const trash: FileService["trash"] = async req => {
    const path = req.Path
    await trash2([path])
}
