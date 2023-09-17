/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from "immer"
import { useSyncExternalStore } from "react"
import { NavigateFunction, useNavigate } from "react-router"
import { FileInfo, FsFile, ListFilesRequest, sortToUrl, urlToSort } from "../../../../shared/src/FileService"
import { app } from "../App"
import { Column, Columns } from "../Columns"
import { AppState } from "./AppState"
import { isExecutable } from "./isExecutable"
import { IsDescending, SortConfig } from "./useSorting"
import { GetGoogleSearchLink, GetSubtitleSearchLink } from "./utils"

export type FileSortConfig = SortConfig<FsFile, Columns>
export class Helper {
    _state: AppState
    navigate?: NavigateFunction

    constructor(state?: AppState) {
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
            state = { ...state, sorting: { ...state.sortingDefaults, ...state.reqSorting } }
        }
        this._state = state
    }

    fetchAllFilesMetadata = async () => {
        const x = await app.fileService.getAllFilesMetadata()
        const obj: { [key: string]: FileInfo } = {}
        x.map(t => (obj[t.key] = t))
        this.set({ filesMd: obj })
    }

    private async setFileMetadata(value: FileInfo) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [value.key]: removed, ...rest } = this._state.filesMd ?? {}
            this.set({ filesMd: rest })
            await app.fileService.deleteFileMetadata({ key: value.key })
            return
        }
        this.set({ filesMd: { ...this._state.filesMd, [value.key]: value } })
        await app.fileService.saveFileMetadata(value)
    }
    getFileMetadata = (key: string): FileInfo | null => {
        const x = this._state.filesMd?.[key]
        if (!x) return null
        return x
    }
    getSavedSelectedFile = (folder: string) => {
        const x = this.getFileMetadata(folder)
        if (x == null || x.selectedFiles == null) return null
        return x.selectedFiles[0]
    }
    saveSelectedFile = async (folderName: string, filename: string) => {
        await this.setFileMetadata({
            key: folderName,
            selectedFiles: filename ? [filename] : undefined,
            collection: "",
        })
    }

    private getFileTypeOrder(type: string): number {
        const order = ["folder", "link", "file"].reverse()
        return order.indexOf(type)
    }

    private updateReq(v: Partial<ListFilesRequest>) {
        return this.setReq({ ...this._state.req, ...v })
    }
    private setReq(v: ListFilesRequest) {
        const navigateToReq = (req: ListFilesRequest) => {
            console.log("navigateToReq", req)
            const { Path, ...rest } = req
            this.navigate?.({ pathname: `/${pathToUrl(Path)}`, search: reqToQuery(rest) })
        }
        const prev = this._state.req
        if (v === prev) return
        const p1 = JSON.stringify(prev)
        const p2 = JSON.stringify(v)
        if (p1 === p2) return
        console.log({ prev, v })
        navigateToReq(v)
    }

    private useReqSorting(req: ListFilesRequest) {
        const active: Column[] = []
        const isDescending: IsDescending<Columns> = {}
        const cols = req.sort ?? []
        if (req.foldersFirst && !cols.find(t => t.Name === Columns.type)) {
            active.push(Columns.type)
        }
        if (req.ByInnerSelection && !cols.find(t => t.Name === Columns.hasInnerSelection)) {
            active.push(Columns.hasInnerSelection)
        }
        for (const col of cols ?? []) {
            active.push(col.Name)
            if (col.Descending) {
                isDescending[col.Name] = true
            }
        }
        console.log("setSorting", active)
        const sorting: Pick<SortConfig<FsFile, Columns>, "active" | "isDescending"> = { active, isDescending }
        return sorting
    }

    parseRequest = async (path: string, s: string) => {
        const req2: ListFilesRequest = queryToReq(s)
        const req = { ...req2, Path: path }
        const reqSorting = this.useReqSorting(req)
        this.set({ req, reqSorting, sorting: { ...this._state.sortingDefaults, ...reqSorting } })
        await this.reloadFiles()
    }

    private async DeleteAndRefresh(file: FsFile) {
        if (!file.Path) return
        const fileOrFolder = file.IsFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
        await app.fileService.del({ Path: file.Path })
        await this.reloadFiles()
    }

    private async TrashAndRefresh(file: FsFile) {
        if (!file.Path) return
        await app.fileService.trash({ Path: file.Path })
        await this.reloadFiles()
    }

    deleteOrTrash = async ({ file, isShiftDown }: { file: FsFile; isShiftDown: boolean }) => {
        if (isShiftDown) {
            await this.DeleteAndRefresh(file)
            return
        }
        await this.TrashAndRefresh(file)
    }

    async explore(file: FsFile) {
        if (!file?.Path) return
        await app.fileService.explore({ Path: file.Path })
    }

    async fetchFiles(req: ListFilesRequest) {
        const res = await app.fileService.listFiles(req)
        this.set({ res })
    }
    private set(v: Partial<AppState>) {
        const from = this._state
        const to = { ...this._state, ...v }
        this._state = to
        this.onChanged?.(from, to)
    }
    onChanged(_from: AppState, _to: AppState) {
        this.listeners.forEach(t => t())
    }
    private listeners: (() => void)[] = []
    subscribe(listener: () => void) {
        this.listeners = [...this.listeners, listener]
        return () => {
            this.listeners = this.listeners.filter(t => t !== listener)
        }
    }
    getSnapshot() {
        return this._state
    }

    private async reloadFiles() {
        if (this._state.req.FolderSize) {
            const req2 = { ...this._state.req, FolderSize: false }
            await this.fetchFiles(req2)
        }
        await this.fetchFiles(this._state.req)
    }

    GotoFolder = (file?: FsFile) => {
        if (!file) return
        file.Path && this.GotoPath(file.Path)
    }

    GotoPath = (path: string) => {
        this.updateReq({ Path: path })
    }

    Open = async (file: FsFile) => {
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

    private async Execute(file: FsFile) {
        if (!file.Path) return
        await app.fileService.execute({ Path: file.Path })
    }

    orderBy = (column: Column) => {
        const sorting = this._state.sorting
        const sort = produce(this._state.req.sort ?? [], sort => {
            // let sort = _.cloneDeep(this._state.req.sort ?? [])
            const index = sort.findIndex(t => t.Name === column)
            if (index === 0) {
                if (!!sort[index].Descending === !!sorting.descendingFirst[column]) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    sort[index].Descending = !sort[index].Descending
                } else {
                    sort.shift()
                }
            } else if (index > 0) {
                sort = [{ Name: column, Descending: sorting.descendingFirst[column] }]
            } else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                sort.unshift({ Name: column, Descending: sorting.descendingFirst[column] })
            }
        })

        this.updateReq({ sort })
    }

    isSortedBy = (key: Column, desc?: boolean): boolean => {
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
            sort: undefined,
            foldersFirst: false,
            ByInnerSelection: false,
        })

    isSortingDisabled = () =>
        !this._state.req.sort && !this._state.req.foldersFirst && this._state.req.ByInnerSelection == null

    OrderByInnerSelection = () => this.orderBy(Columns.hasInnerSelection)
    isOrderedByInnerSelection = () => this.isSortedBy(Columns.hasInnerSelection)

    google = () => this._state.res?.File && openInNewWindow(GetGoogleSearchLink(this._state.res?.File))

    subs = () => this._state.res?.File && openInNewWindow(GetSubtitleSearchLink(this._state.res?.File))

    Explore = () => this._state.res?.File && this.explore(this._state.res?.File)
}
const helper = new Helper()

export function useHelper() {
    const state = useSyncExternalStore(helper.subscribe, helper.getSnapshot)
    const navigate = useNavigate()
    helper.navigate = navigate
    return [state, helper] as const
}

function openInNewWindow(p: string): void {
    window.open(p, "_blank")
}

export function pathToUrl(p: string | undefined) {
    if (!p) return ""
    let s = p.replace(/\\/g, "/").replace(":", "")
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
    if (rest.sort) {
        rest2.sort = sortToUrl(rest.sort)
    }
    const obj = {} as any
    for (const key of Object.keys(rest2)) {
        if (!rest2[key]) {
            continue
        }
        if (typeof rest2[key] == "boolean") {
            obj[key] = ""
            continue
        }
        obj[key] = rest2[key] ?? ""
    }
    const q = new URLSearchParams(obj)
    return sanitizeQuery(q.toString())
}
export function queryToReq(s: string): ListFilesRequest {
    const x = Object.fromEntries(new URLSearchParams(s).entries()) as any
    for (const key of Object.keys(x)) {
        if (x[key] === "") {
            x[key] = true
        }
    }
    const z = { ...x, sort: urlToSort(x.sort) } as ListFilesRequest
    return z
}

function sanitizeQuery(s: string): string {
    return s.replace(/=&/g, "&").replace(/=$/g, "").replace(/%2C/g, ",")
}
