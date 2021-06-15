import { Helper } from "../Helper"

export type Api = Helper
// export interface Api {
//     Execute(file: FsFile): Promise<void>
//     GotoFolder(file: FsFile): void
//     Open(file: FsFile): Promise<void>
//     GotoPath(path: string): void
//     orderBy(column: Column): void
// }

// export function useApi({
//     req,
//     sorting,
//     dispatcher,
//     state,
// }: {
//     req: ListFilesRequest
//     sorting: SortConfig<FsFile, Columns>
//     dispatcher: Helper
//     state: State
// }): Api {
//     const history = useHistory()
//     // const orderBy = useCallback(
//     //     (column: Column) => {
//     //         const sortBy = req.sortBy as Column
//     //         if (sortBy == column) {
//     //             dispatcher.setReq({ history, v: req => ({ ...req, sortByDesc: !req.sortByDesc }) })
//     //             return
//     //         }
//     //         dispatcher.setReq({
//     //             history,
//     //             v: req => ({ ...req, sortBy: column, sortByDesc: sorting.descendingFirst[column] }),
//     //         })
//     //     },
//     //     [req.sortBy, dispatcher, history, sorting.descendingFirst]
//     // )

//     // const x = useMemo(() => {
//     //     const api: Api = dispatcher
//     //     return api
//     // }, [orderBy, dispatcher, history])
//     return dispatcher
// }
