import { useMemo } from "react"
import { dispatcher } from "../services/Dispatcher"
import { FsFile, ListFilesRequest } from "../services/FileService"

export function useFilter(req: ListFilesRequest, list: FsFile[]) {
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = dispatcher.getFileMetadata(t.Name)
            return !md?.watched && !md?.selectedFiles?.length
        })
    }, [req.hideWatched, list])
}
