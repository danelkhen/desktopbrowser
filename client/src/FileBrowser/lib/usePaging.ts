import { useMemo } from "react"

export function usePaging<T>(
    items: T[],
    {
        pageSize = 100,
        pageIndex,
        setPageIndex,
    }: {
        pageSize: number
        pageIndex: number
        setPageIndex: (v: number) => void
    }
) {
    return useMemo(() => {
        function nextPage() {
            setPageIndex(pageIndex + 1)
        }
        function prevPage() {
            setPageIndex(pageIndex - 1)
        }

        function applyPaging(target: T[]) {
            const totalPages = Math.ceil(target.length / pageSize)
            let pageIndex2 = pageIndex
            if (pageIndex2 >= totalPages) pageIndex2 = totalPages - 1
            if (pageIndex2 < 0) pageIndex2 = 0
            var from = pageIndex2 * pageSize
            var until = from + pageSize
            const paged = target.slice(from, until)
            return { paged, totalPages, pageIndex: pageIndex2 }
        }
        const page = applyPaging(items)
        const x: Pager<T> = {
            ...page,
            setPageIndex,
            prevPage,
            nextPage,
        }
        return x
    }, [pageIndex, pageSize, items, setPageIndex])
}

// interface PageInfo<T> {
//     pageIndex: number
//     totalPages: number
//     paged: T[]
// }
export interface Pager<T> {
    pageIndex: number
    totalPages: number
    paged: T[]
    // page: PageInfo<T>
    // applyPaging(list: T[]): PageInfo<T>
    setPageIndex: (v: number) => void
    prevPage: () => void
    nextPage: () => void
}
