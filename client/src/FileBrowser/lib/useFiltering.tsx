import { useMemo } from "react"
import { FsFile, ListFilesRequest } from "../../../../shared/src/FileService"
import { Helper } from "./Helper"

export function useFiltering(search: string, list: FsFile[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}

export function useFiltering2(req: ListFilesRequest, dispatcher: Helper, list: FsFile[]) {
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = dispatcher.getFileMetadata(t.Name)
            return !md?.watched && !md?.selectedFiles?.length
        })
    }, [req.hideWatched, list, dispatcher])
}
