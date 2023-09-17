import { FsFile } from "../services/FileService"

export function getFileNameWithoutExtension(file: FsFile): string {
    if (file.IsFolder) return file.Name
    let s = file.Name
    const index = s.lastIndexOf(".")
    if (index < 0) return s
    s = s.substr(0, index)
    return s
}
