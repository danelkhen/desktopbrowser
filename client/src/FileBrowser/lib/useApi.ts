import { useCallback, useMemo } from "react"
import { useHistory } from "react-router"
import { FsFile, ListFilesRequest } from "../../../../shared/src/FileService"
import { App } from "../../App"
import { Column, Columns } from "../Columns"
import { Dispatcher, setReq, State } from "../Helper"
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
    dispatcher,
    state,
}: {
    req: ListFilesRequest
    sorting: SortConfig<FsFile, Columns>
    dispatcher: Dispatcher
    state: State
}): Api {
    const history = useHistory()
    const orderBy = useCallback(
        (column: Column) => {
            const sortBy = req.sortBy as Column
            if (sortBy == column) {
                setReq({ state, history, v: req => ({ ...req, sortByDesc: !req.sortByDesc }) })
                return
            }
            setReq({
                state,
                history,
                v: req => ({ ...req, sortBy: column, sortByDesc: sorting.descendingFirst[column] }),
            })
        },
        [req.sortBy, state, history, sorting.descendingFirst]
    )

    const x = useMemo(() => {
        function GotoFolder(file: FsFile): void {
            file.Path && GotoPath(file.Path)
        }

        function GotoPath(path: string): void {
            setReq({ state, history, v: req => ({ ...req, Path: path }) })
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
    }, [orderBy, state, history])
    return x
}
function isExecutable(extension: string) {
    return [".exe", ".bat", ".com", ".cmd"].includes(extension.toLowerCase())
}
