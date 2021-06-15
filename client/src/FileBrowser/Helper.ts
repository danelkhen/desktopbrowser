/* eslint-disable @typescript-eslint/no-explicit-any */
import { History } from "history"
import { useMemo, useState } from "react"
import { FsFile, ListFilesRequest, ListFilesResponse } from "../../../shared/src/FileService"
import { App } from "./App"

export interface State {
    path: string
    res: ListFilesResponse
    req: ListFilesRequest
}
export class Helper {
    constructor(private state: State) {
        for (const p in this) {
            if (typeof this[p] == "function") {
                this[p] = (this[p] as any as Function).bind(this)
            }
        }
    }

    app = App.current
    server = this.app.fileService

    setReq({ v, history }: { history: History; v: ListFilesRequest | ((prev: ListFilesRequest) => ListFilesRequest) }) {
        function navigateToReq(req: ListFilesRequest) {
            console.log("navigateToReq", req)
            const q = new URLSearchParams()
            q.set("p", JSON.stringify(req))
            history.push({ pathname: "/", search: q.toString() })
        }
        const prev = this.state.req
        const req2 = typeof v === "function" ? v(prev) : v
        if (req2 === prev) return
        const p1 = JSON.stringify(prev)
        const p2 = JSON.stringify(req2)
        if (p1 === p2) return
        console.log({ prev, req2 })
        navigateToReq(req2)
    }

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
        const from = this.state
        const to = { ...this.state, ...v }
        this.state = to
        this.onChanged?.(from, to)
    }
    onChanged?: (from: State, to: State) => void

    async reloadFiles() {
        if (this.state.req.FolderSize) {
            const req2 = { ...this.state.req, FolderSize: false }
            await this.fetchFiles(req2)
        }
        await this.fetchFiles(this.state.req)
    }
}

export function useHelper() {
    const [state, setState] = useState<State>({ path: "", res: { Relatives: {} }, req: {} })
    const helper = useMemo(() => {
        const helper = new Helper({ path: "", res: { Relatives: {} }, req: {} })
        helper.onChanged = (from, to) => setState(to)
        return helper
    }, [])
    return [state, helper] as const
}

// // {
// //     [P in FunctionKeys<Helper>]: (arg: Parameters<Helper[P]>[0]) => void
// // }

// type Actions = {
//     [P in FunctionKeys<Helper>]: {
//         type: P
//         payload: Parameters<Helper[P]>[0]
//     }
// }[FunctionKeys<Helper>]

// let _dispatch: Dispatcher = null!
// function reducer(state: State, action: Actions): State {
//     const helper = new Helper(state) as Helper
//     const res = (helper[action.type] as any)(action.payload)
//     const newState = (helper as any as { state: State }).state
//     if (newState !== state) {
//         console.log("state changed")
//     }
//     if (isPromise(res)) {
//         ;(async () => {
//             await res
//             const newState2 = (helper as any as { state: State }).state
//             if (newState !== newState2) {
//                 _dispatch.set(newState2)
//             }
//         })()
//     }
//     return newState
// }
