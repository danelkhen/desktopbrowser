import { useCallback, useMemo } from "react"
import { FsFile, ListFilesRequest } from "../../../../shared/src/FileService"
import { App } from "../../App"
import { Column, Columns } from "../Columns"
import { SetRequest } from "./useReq"
import { SortConfig } from "./useSorting"

export interface Api {
    Execute(file: FsFile): Promise<void>
    GotoFolder(file: FsFile): void
    Open(file: FsFile): Promise<void>
    GotoPath(path: string): void
    orderBy(column: Column): void
}

export function useApi({
    req,
    sorting,
    setReq,
}: {
    req: ListFilesRequest
    sorting: SortConfig<FsFile, Columns>
    setReq: SetRequest
}): Api {
    const orderBy = useCallback(
        (column: Column) => {
            const sortBy = req.sortBy as Column
            if (sortBy == column) {
                setReq(req => ({ ...req, sortByDesc: !req.sortByDesc }))
                return
            }
            setReq(req => ({ ...req, sortBy: column, sortByDesc: sorting.descendingFirst[column] }))
        },
        [req.sortBy, setReq, sorting.descendingFirst]
    )

    const x = useMemo(() => {
        function GotoFolder(file: FsFile): void {
            file.Path && GotoPath(file.Path)
        }

        function GotoPath(path: string): void {
            setReq(req => ({ ...req, Path: path }))
        }

        async function Open(file: FsFile): Promise<void> {
            if (file == null) return
            if (file.IsFolder || file.type == "link") {
                GotoFolder(file)
                return
            }
            const prompt = file.Extension ? isExecutable(file.Extension) : true
            if (prompt && !window.confirm("This is an executable file, are you sure you want to run it?")) {
                return
            }
            const res = await Execute(file)
            console.info(res)
        }

        async function Execute(file: FsFile): Promise<void> {
            if (!file.Path) return
            await App.current.fileService.execute({ Path: file.Path })
        }

        const api: Api = { Execute, GotoFolder, Open, GotoPath, orderBy }
        return api
    }, [setReq, orderBy])
    return x
}
function isExecutable(extension: string) {
    return [".exe", ".bat", ".com"].includes(extension.toLowerCase())
}
