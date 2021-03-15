import * as C from "contracts"
import { useMemo } from "react"

export function useFiltering(search: string, list: C.File[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}
