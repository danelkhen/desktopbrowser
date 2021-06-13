import { useMemo } from "react"
import { FsFile } from "../../../../shared/src/contracts"

export function useFiltering(search: string, list: FsFile[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}
