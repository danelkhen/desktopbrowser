/* eslint-disable @typescript-eslint/no-explicit-any */
import isPromise from "is-promise"
import { useMemo, useReducer } from "react"
import { FunctionKeys } from "utility-types"
import { FsFile, ListFilesRequest, ListFilesResponse } from "../../../shared/src/FileService"
import { App } from "../App"
import { History } from "history"

export function setReq({
    state,
    v,
    history,
}: {
    state: State
    history: History
    v: ListFilesRequest | ((prev: ListFilesRequest) => ListFilesRequest)
}) {
    function navigateToReq(req: ListFilesRequest) {
        console.log("navigateToReq", req)
        const q = new URLSearchParams()
        q.set("p", JSON.stringify(req))
        history.push({ pathname: "/", search: q.toString() })
    }
    const prev = state.req
    const req2 = typeof v === "function" ? v(prev) : v
    if (req2 === prev) return
    const p1 = JSON.stringify(prev)
    const p2 = JSON.stringify(req2)
    if (p1 === p2) return
    navigateToReq(req2)
}

export interface State {
    path: string
    res: ListFilesResponse
    req: ListFilesRequest
}
export class Helper {
    constructor(private state: State) {}

    app = App.current
    server = this.app.fileService

    async updateReq(s: string) {
        const req: ListFilesRequest = s ? JSON.parse(s) : {}
        this.set({ req })
        await this.reloadFiles()
    }

    async DeleteAndRefresh(file: FsFile): Promise<void> {
        if (!file.Path) return
        const fileOrFolder = file.IsFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
        await this.server.del({ Path: file.Path })
        await this.reloadFiles()
    }

    async TrashAndRefresh(file: FsFile): Promise<void> {
        if (!file.Path) return
        await this.server.trash({ Path: file.Path })
        await this.reloadFiles()
    }

    async deleteOrTrash({ file, isShiftDown }: { file: FsFile; isShiftDown: boolean }): Promise<void> {
        if (isShiftDown) {
            await this.DeleteAndRefresh(file)
            return
        }
        await this.TrashAndRefresh(file)
    }

    async explore(file: FsFile): Promise<void> {
        if (!file?.Path) return
        await this.server.explore({ Path: file.Path })
    }

    // const [res, setRes] = useState<ListFilesResponse>({
    //     Relatives: {},
    // })
    async fetchFiles(req: ListFilesRequest) {
        const res = await App.current.fileService.listFiles(req)
        this.set({ res })
    }
    set(v: Partial<State>) {
        this.state = { ...this.state, ...v }
    }
    async reloadFiles() {
        if (this.state.req.FolderSize) {
            const req2 = { ...this.state.req, FolderSize: false }
            await this.fetchFiles(req2)
        }
        await this.fetchFiles(this.state.req)
    }

    // useEffect(() => {
    //     reloadFiles()
    // }, [reloadFiles])
}

export type Dispatcher = Helper
// {
//     [P in FunctionKeys<Helper>]: (arg: Parameters<Helper[P]>[0]) => void
// }

type Actions = {
    [P in FunctionKeys<Helper>]: {
        type: P
        payload: Parameters<Helper[P]>[0]
    }
}[FunctionKeys<Helper>]

let _dispatch: Dispatcher = null!
function reducer(state: State, action: Actions): State {
    const helper = new Helper(state) as Helper
    const res = (helper[action.type] as any)(action.payload)
    const newState = (helper as any as { state: State }).state
    if (newState !== state) {
        console.log("state changed")
    }
    if (isPromise(res)) {
        ;(async () => {
            await res
            const newState2 = (helper as any as { state: State }).state
            if (newState !== newState2) {
                _dispatch.set(newState2)
            }
        })()
    }
    return newState
}
export function useHelper() {
    const initialState: State = { path: "", res: { Relatives: {} }, req: {} }
    const [state, dispatch] = useReducer(reducer, initialState)
    const dispatcher = useMemo(() => {
        const dispatcher = {} as any
        const helper = new Helper({} as State) as any
        for (const type in helper) {
            if (typeof helper[type] === "function") {
                dispatcher[type] = (payload: any) => dispatch({ type, payload } as any)
            }
        }
        return dispatcher
    }, [])
    _dispatch = dispatcher

    return [state, dispatcher] as const
}
