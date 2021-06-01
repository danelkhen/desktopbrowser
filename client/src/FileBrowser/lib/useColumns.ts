import * as C from "../../../../shared/src/contracts"
import { useMemo } from "react"
import { Columns, Column } from "../Columns"
import { SortConfig, IsDescending } from "./useSorting"
import { FileColumnsConfig } from "./useCommands"
import { FileMetadata } from "./useFileMetadata"

export function useColumns({ fileMetadata }: { fileMetadata: FileMetadata }) {
    const columns = useMemo<FileColumnsConfig>(
        () => ({
            keys: Columns,
            getters: {
                type: t => t.type,
                Name: t => t.Name,
                Size: t => t.Size,
                Modified: t => t.Modified,
                Extension: t => t.Extension,
                hasInnerSelection: t => !!t?.IsFolder && !!fileMetadata.getSavedSelectedFile(t.Name),
            },
            visibleColumns: [Columns.type, Columns.Name, Columns.Modified, Columns.Size, Columns.Extension],
        }),
        [fileMetadata]
    )

    return columns
}

export function useColumnSorting({ fileMetadata }: { fileMetadata: FileMetadata }) {
    const sortingDefaults = useMemo(() => {
        function getFileTypeOrder(type: string): number {
            const order = ["folder", "link", "file"].reverse()
            return order.indexOf(type)
        }

        const x: SortConfig<C.File, Columns> = {
            getters: {
                type: t => t.type,
                Name: t => t.Name,
                Size: t => t.Size,
                Modified: t => t.Modified,
                Extension: t => t.Extension,
                hasInnerSelection: file => !!file?.IsFolder && !!fileMetadata.getSavedSelectedFile(file.Name),
            },
            descendingFirst: {
                Size: true,
                Modified: true,
                hasInnerSelection: true,
            },
            comparer: {
                type: (x, y) => getFileTypeOrder(y) - getFileTypeOrder(x),
            },
            isDescending: {},
            active: [Columns.type],
        }
        return x
    }, [fileMetadata])
    return sortingDefaults
}

export function useReqSorting(req: C.ListFilesRequest) {
    const sorting: Pick<SortConfig<C.File, Columns>, "active" | "isDescending"> = useMemo(() => {
        const key = req.sortBy as Column
        const active: Column[] = []
        const isDescending: IsDescending<Columns> = {}
        if (req.foldersFirst && key !== Columns.type) {
            active.push(Columns.type)
        }
        if (req.ByInnerSelection && key !== Columns.hasInnerSelection) {
            active.push(Columns.hasInnerSelection)
        }
        if (key != null) {
            isDescending[key] = req.sortByDesc
            active.push(key)
        }
        console.log("setSorting", active)
        return { active, isDescending }
    }, [req])
    return sorting
}
