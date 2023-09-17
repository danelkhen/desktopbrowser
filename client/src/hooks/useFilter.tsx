import { useMemo } from "react"
import { dispatcher } from "../lib/Dispatcher"
import { FsFile, ListFilesRequest } from "../lib/FileService"

export function useFilter(req: ListFilesRequest, list: FsFile[]) {
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = dispatcher.getFileMetadata(t.Name)
            return !md?.watched && !md?.selectedFiles?.length
        })
    }, [req.hideWatched, list])
}
