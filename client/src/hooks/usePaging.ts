import { useMemo, useState } from "react"

export function usePaging<T>(items: T[], { pageSize = 100 }: { pageSize: number }): Pager<T> {
    const [pageIndex, setPageIndex] = useState(0)

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
            if (pageIndex2 >= totalPages) {
                pageIndex2 = totalPages - 1
            }
            if (pageIndex2 < 0) {
                pageIndex2 = 0
            }
            const from = pageIndex2 * pageSize
            const until = from + pageSize
            const paged = target.slice(from, until)
            return { paged, totalPages, pageIndex: pageIndex2 }
        }
        const page = applyPaging(items)
        const x: Pager<T> = {
            paged: page.paged,
            pageIndex: page.pageIndex,
            totalPages: page.totalPages,
            setPageIndex,
            prevPage,
            nextPage,
        }
        return x
    }, [pageIndex, pageSize, items, setPageIndex])
}

export interface Pager<T> {
    pageIndex: number
    totalPages: number
    paged: T[]
    setPageIndex: (v: number) => void
    prevPage: () => void
    nextPage: () => void
}
