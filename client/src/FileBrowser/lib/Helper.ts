/* eslint-disable @typescript-eslint/no-explicit-any */
import { History } from "history"
import { useMemo, useState } from "react"
import { useHistory } from "react-router"
import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { App } from "../App"
import { Column, Columns } from "../Columns"
import { isExecutable } from "./isExecutable"
import { FileColumnsConfig } from "./FileColumnsConfig"
import { IsDescending, SortConfig } from "./useSorting"
import { GetGoogleSearchLink, GetSubtitleSearchLink } from "./utils"

export type FileSortConfig = SortConfig<FsFile, Columns>
export interface State {
    res: ListFilesResponse
    req: ListFilesRequest
    sortingDefaults: FileSortConfig
    reqSorting: Pick<FileSortConfig, "active" | "isDescending">
    sorting: FileSortConfig
    filesMd: { [key: string]: FileInfo }
    columns: FileColumnsConfig
}

export class Helper {
    _state: State
    history?: History
    app = App.current
    server = this.app.fileService

    constructor(state?: State) {
        if (!state) {
            state = {
                res: { Relatives: {} },
                req: {},
                sortingDefaults: {
                    getters: {
                        type: t => t.type,
                        Name: t => t.Name,
                        Size: t => t.Size,
                        Modified: t => t.Modified,
                        Extension: t => t.Extension,
                        hasInnerSelection: file => !!file.IsFolder && !!this.getSavedSelectedFile(file.Name),
                    },
                    descendingFirst: {
                        Size: true,
                        Modified: true,
                        hasInnerSelection: true,
                    },
                    sortGetters: {
                        type: x => (x.type && this.getFileTypeOrder(x.type)) ?? 0,
                    },
                    isDescending: {},
                    active: [Columns.type],
                },
                reqSorting: { active: [], isDescending: {} },
                sorting: {} as any,
                filesMd: {},
                columns: {
                    keys: Columns,
                    getters: {
                        type: t => t.type,
                        Name: t => t.Name,
                        Size: t => t.Size,
                        Modified: t => t.Modified,
                        Extension: t => t.Extension,
                        hasInnerSelection: t => !!t?.IsFolder && !!this.getSavedSelectedFile(t.Name),
                    },
                    visibleColumns: [Columns.type, Columns.Name, Columns.Modified, Columns.Size, Columns.Extension],
                },
            }
            state.sorting = { ...state.sortingDefaults, ...state.reqSorting }
        }
        this._state = state
        for (const p in this) {
            if (typeof this[p] == "function") {
                this[p] = (this[p] as any as Function).bind(this)
            }
        }
    }

    async fetchAllFilesMetadata() {
        const x = await this.server.getAllFilesMetadata()
        const obj: { [key: string]: FileInfo } = {}
        x.map(t => (obj[t.key] = t))
        this.set({ filesMd: obj })
    }

    async setFileMetadata(value: FileInfo) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [value.key]: removed, ...rest } = this._state.filesMd ?? {}
            this.set({ filesMd: rest })
            await this.app.fileService.deleteFileMetadata({ key: value.key })
            return
        }
        this.set({ filesMd: { ...this._state.filesMd, [value.key]: value } })
        await this.app.fileService.saveFileMetadata(value)
    }
    getFileMetadata(key: string): FileInfo | null {
        const x = this._state.filesMd?.[key]
        if (!x) return null
        return x
    }
    getSavedSelectedFile(folder: string) {
        const x = this.getFileMetadata(folder)
        if (x == null || x.selectedFiles == null) return null
        return x.selectedFiles[0]
    }
    async saveSelectedFile(folderName: string, filename: string) {
        await this.setFileMetadata({
            key: folderName,
            selectedFiles: filename ? [filename] : undefined,
            collection: "",
        })
    }

    getFileTypeOrder(type: string): number {
        const order = ["folder", "link", "file"].reverse()
        return order.indexOf(type)
    }

    updateReq(v: Partial<ListFilesRequest>) {
        return this.setReq({ ...this._state.req, ...v })
    }
    setReq(v: ListFilesRequest) {
        const navigateToReq = (req: ListFilesRequest) => {
            console.log("navigateToReq", req)
            const { Path, ...rest } = req
            this.history?.push({ pathname: `/${pathToUrl(Path)}`, search: reqToQuery(rest) })
        }
        const prev = this._state.req
        if (v === prev) return
        const p1 = JSON.stringify(prev)
        const p2 = JSON.stringify(v)
        if (p1 === p2) return
        console.log({ prev, v })
        navigateToReq(v)
    }

    useReqSorting(req: ListFilesRequest) {
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
        const sorting: Pick<SortConfig<FsFile, Columns>, "active" | "isDescending"> = { active, isDescending }
        return sorting
    }

    async parseRequest(path: string, s: string) {
        const req: ListFilesRequest = queryToReq(s)
        req.Path = path
        const reqSorting = this.useReqSorting(req)
        this.set({ req, reqSorting, sorting: { ...this._state.sortingDefaults, ...reqSorting } })
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

    async fetchFiles(req: ListFilesRequest) {
        const res = await App.current.fileService.listFiles(req)
        this.set({ res })
    }
    set(v: Partial<State>) {
        const from = this._state
        const to = { ...this._state, ...v }
        this._state = to
        this.onChanged?.(from, to)
    }
    onChanged?: (from: State, to: State) => void

    async reloadFiles() {
        if (this._state.req.FolderSize) {
            const req2 = { ...this._state.req, FolderSize: false }
            await this.fetchFiles(req2)
        }
        await this.fetchFiles(this._state.req)
    }

    GotoFolder(file?: FsFile): void {
        if (!file) return
        file.Path && this.GotoPath(file.Path)
    }

    GotoPath(path: string): void {
        this.updateReq({ Path: path })
    }

    async Open(file: FsFile): Promise<void> {
        if (file == null) return
        if (file.IsFolder || file.type == "link") {
            this.GotoFolder(file)
            return
        }
        const prompt = file.Extension ? isExecutable(file.Extension) : true
        if (prompt && !window.confirm("This is an executable file, are you sure you want to run it?")) {
            return
        }
        const res = await this.Execute(file)
        console.info(res)
    }

    async Execute(file: FsFile): Promise<void> {
        if (!file.Path) return
        await App.current.fileService.execute({ Path: file.Path })
    }

    orderBy(column: Column) {
        const sorting = this._state.sorting
        const sortBy = this._state.req.sortBy as Column
        if (sortBy == column) {
            this.updateReq({ sortByDesc: !this._state.req.sortByDesc })
            return
        }
        this.updateReq({ sortBy: column, sortByDesc: sorting.descendingFirst[column] })
    }

    isSortedBy(key: Column, desc?: boolean): boolean {
        if (!this._state.sorting.active.includes(key)) return false
        if (desc !== undefined) return !!this._state.sorting.isDescending[key] === desc
        return true
    }

    goto = {
        up: () => this.GotoFolder(this._state.res?.Relatives?.ParentFolder),
        prev: () => this.GotoFolder(this._state.res?.Relatives?.PreviousSibling),
        next: () => this.GotoFolder(this._state.res?.Relatives?.NextSibling),
    }
    canGoto = {
        up: () => !!this._state.res?.Relatives?.ParentFolder,
        prev: () => !!this._state.res?.Relatives?.PreviousSibling,
        next: () => !!this._state.res?.Relatives?.NextSibling,
    }
    toggle = {
        FolderSize: () => this.updateReq({ FolderSize: !this._state.req.FolderSize }),
        foldersFirst: () => this.updateReq({ foldersFirst: !this._state.req.foldersFirst }),
        Folders: () => this.updateReq({ HideFolders: !this._state.req.HideFolders }),
        Files: () => this.updateReq({ HideFiles: !this._state.req.HideFiles }),
        Recursive: () => this.updateReq({ IsRecursive: !this._state.req.IsRecursive }),
        Keep: () => this.updateReq({ KeepView: !this._state.req.KeepView }),
        Hidden: () => this.updateReq({ ShowHiddenFiles: !this._state.req.ShowHiddenFiles }),
        hideWatched: () => this.updateReq({ hideWatched: !this._state.req.hideWatched }),
    }
    isToggled = {
        FolderSize: () => !!this._state.req.FolderSize,
        foldersFirst: () => !!this._state.req.foldersFirst,
        Folders: () => !!this._state.req.HideFolders,
        Files: () => !!this._state.req.HideFiles,
        Recursive: () => !!this._state.req.IsRecursive,
        Keep: () => !!this._state.req.KeepView,
        Hidden: () => !!this._state.req.ShowHiddenFiles,
        hideWatched: () => !!this._state.req.hideWatched,
    }

    disableSorting = () =>
        this.updateReq({
            sortBy: undefined,
            sortByDesc: false,
            foldersFirst: false,
            ByInnerSelection: false,
        })

    isSortingDisabled = () =>
        !this._state.req.sortBy && !this._state.req.foldersFirst && this._state.req.ByInnerSelection == null

    OrderByInnerSelection = () => this.orderBy(Columns.hasInnerSelection)
    isOrderedByInnerSelection = () => this.isSortedBy(Columns.hasInnerSelection)

    google = () => this._state.res?.File && openInNewWindow(GetGoogleSearchLink(this._state.res?.File))

    subs = () => this._state.res?.File && openInNewWindow(GetSubtitleSearchLink(this._state.res?.File))

    Explore = () => this._state.res?.File && this.explore(this._state.res?.File)
}

export function useHelper() {
    const helper = useMemo(() => {
        const helper = new Helper()
        helper.onChanged = (from, to) => setState(to)
        return helper
    }, [])
    const [state, setState] = useState<State>(helper._state)
    const history = useHistory()
    helper.history = history
    return [state, helper] as const
}

function openInNewWindow(p: string): void {
    window.open(p, "_blank")
}

export function pathToUrl(p: string | undefined) {
    if (!p) return ""
    let s = p.replaceAll("\\", "/").replace(":", "")
    if (s[0] === "/") {
        s = s.substr(1)
    }
    return s
}

export function urlToPath(p: string | undefined) {
    return `/${p ?? ""}`
}

export function reqToQuery(rest: ListFilesRequest) {
    const rest2 = rest as any
    for (const key of Object.keys(rest2)) {
        if (!rest2[key]) {
            delete rest2[key]
            continue
        }
        if (typeof rest2[key] == "boolean") {
            rest2[key] = "1"
        }
    }
    const q = new URLSearchParams(rest2)
    return q.toString()
}
export function queryToReq(s: string): ListFilesRequest {
    const x = Object.fromEntries(new URLSearchParams(s).entries()) as any
    for (const key of Object.keys(x)) {
        if (!x[key] || x[key] === "0") {
            delete x[key]
        }
        if (x[key] === "1") {
            x[key] = true
        }
    }
    return x
}