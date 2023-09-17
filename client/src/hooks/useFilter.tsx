import { useMemo } from "react"
import { dispatcher } from "../lib/Dispatcher"
import { FsFile, ListFilesRequest } from "../lib/FileService"

export function useSearch(search: string, list: FsFile[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}

export function useFilter(req: ListFilesRequest, list: FsFile[]) {
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = dispatcher.getFileMetadata(t.Name)
            return !md?.watched && !md?.selectedFiles?.length
        })
    }, [req.hideWatched, list])
}
