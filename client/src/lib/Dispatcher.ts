/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from "immer"
import { NavigateFunction } from "react-router"
import { FileInfo, FsFile, ListFilesRequest } from "./FileService"
import { app } from "./App"
import { FileColumnKey, FileColumnKeys } from "./Columns"
import { AppState, initialAppState } from "./AppState"
import { isExecutable } from "./isExecutable"
import { openInNewWindow } from "./openInNewWindow"
import { pathToUrl } from "./pathToUrl"
import { queryToReq } from "./queryToReq"
import { reqToQuery } from "./reqToQuery"
import { IsDescending, SortConfig } from "../hooks/useSorting"
import { getGoogleSearchLink } from "./getGoogleSearchLink"
import { getSubtitleSearchLink } from "./getSubtitleSearchLink"
import { Produce } from "./Produce"

export class Dispatcher {
    private _state: AppState
    navigate?: NavigateFunction

    constructor(state?: AppState) {
        this._state = state ?? initialAppState
    }

    fetchAllFilesMetadata = async () => {
        const x = await app.fileService.getAllFilesMetadata()
        const obj: { [key: string]: FileInfo } = {}
        x.map(t => (obj[t.key] = t))
        this.update({ filesMd: obj })
    }

    private async setFileMetadata(value: FileInfo) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [value.key]: removed, ...rest } = this._state.filesMd ?? {}
            this.update({ filesMd: rest })
            await app.fileService.deleteFileMetadata({ key: value.key })
            return
        }
        this.update({ filesMd: { ...this._state.filesMd, [value.key]: value } })
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

    getFileTypeOrder(type: string): number {
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
        const active: FileColumnKey[] = []
        const isDescending: IsDescending<FileColumnKeys> = {}
        const cols = req.sort ?? []
        if (req.foldersFirst && !cols.find(t => t.Name === FileColumnKeys.type)) {
            active.push(FileColumnKeys.type)
        }
        if (req.ByInnerSelection && !cols.find(t => t.Name === FileColumnKeys.hasInnerSelection)) {
            active.push(FileColumnKeys.hasInnerSelection)
        }
        for (const col of cols ?? []) {
            active.push(col.Name)
            if (col.Descending) {
                isDescending[col.Name] = true
            }
        }
        console.log("setSorting", active)
        const sorting: Pick<SortConfig<FsFile, FileColumnKeys>, "active" | "isDescending"> = { active, isDescending }
        return sorting
    }

    parseRequest = async (path: string, s: string) => {
        const req2: ListFilesRequest = queryToReq(s)
        const req = { ...req2, Path: path }
        const reqSorting = this.useReqSorting(req)
        this.update({ req, reqSorting, sorting: { ...this._state.sortingDefaults, ...reqSorting } })
        await this.reloadFiles()
    }

    private DeleteAndRefresh = async (file: FsFile) => {
        if (!file.Path) return
        const fileOrFolder = file.IsFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
        await app.fileService.del({ Path: file.Path })
        await this.reloadFiles()
    }

    private TrashAndRefresh = async (file: FsFile) => {
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

    explore = async (file: FsFile) => {
        if (!file?.Path) return
        await app.fileService.explore({ Path: file.Path })
    }

    async fetchFiles(req: ListFilesRequest) {
        const res = await app.fileService.listFiles(req)
        this.update({ res })
    }
    private set(v: AppState | Produce<AppState>) {
        this._state = typeof v === "function" ? produce(this._state, v) : v
        this.onChanged()
    }
    private update(v: Partial<AppState>) {
        const to = { ...this._state, ...v }
        this.set(to)
    }
    onChanged = () => {
        this.listeners.forEach(t => t())
    }
    private listeners: (() => void)[] = []
    subscribe = (listener: () => void) => {
        this.listeners = [...this.listeners, listener]
        return () => {
            this.listeners = this.listeners.filter(t => t !== listener)
        }
    }
    getSnapshot = () => {
        return this._state
    }

    private reloadFiles = async () => {
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

    private Execute = async (file: FsFile) => {
        if (!file.Path) return
        await app.fileService.execute({ Path: file.Path })
    }

    orderBy = (column: FileColumnKey) => {
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

    isSortedBy = (key: FileColumnKey, desc?: boolean): boolean => {
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

    OrderByInnerSelection = () => this.orderBy(FileColumnKeys.hasInnerSelection)
    isOrderedByInnerSelection = () => this.isSortedBy(FileColumnKeys.hasInnerSelection)

    google = () => this._state.res?.File && openInNewWindow(getGoogleSearchLink(this._state.res?.File))

    subs = () => this._state.res?.File && openInNewWindow(getSubtitleSearchLink(this._state.res?.File))

    Explore = () => this._state.res?.File && this.explore(this._state.res?.File)
}

export const dispatcher = new Dispatcher()
