import { FsFile } from "../services/FileService"
import { getFilenameForSearch } from "./getFilenameForSearch"

export function getGoogleSearchLink(file: FsFile): string {
    const s = getFilenameForSearch(file.Name)
    return "https://www.google.com/search?q=" + encodeURIComponent(s)
}
