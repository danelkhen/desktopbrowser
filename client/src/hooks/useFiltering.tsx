import { useMemo } from "react"
import { FsFile, ListFilesRequest } from "../lib/FileService"
import { Dispatcher } from "../lib/Dispatcher"

export function useFiltering(search: string, list: FsFile[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}

export function useFiltering2(req: ListFilesRequest, dispatcher: Dispatcher, list: FsFile[]) {
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = dispatcher.getFileMetadata(t.Name)
            return !md?.watched && !md?.selectedFiles?.length
        })
    }, [req.hideWatched, list, dispatcher])
}
