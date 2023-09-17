import { useMemo } from "react"
import { FsFile } from "../services/FileService"

export function useSearch(search: string, list: FsFile[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}
