import { useCallback, useMemo } from "react"
import { useHistory } from "react-router"
import { FsFile, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { Column, Columns } from "../Columns"
import { Helper, State } from "../Helper"
import { GetGoogleSearchLink, GetSubtitleSearchLink } from "../utils"
import { Api } from "./useApi"

interface MenuItem {
    action?(): void
    isActive?(): boolean
}
export interface MenuItems {
    up: MenuItem
    prev: MenuItem
    next: MenuItem
    google: MenuItem
    subs: MenuItem
    Explore: MenuItem
    Delete: MenuItem
    OrderByInnerSelection: MenuItem
    FolderSize: MenuItem
    foldersFirst: MenuItem
    disableSorting: MenuItem
    Folders: MenuItem
    Files: MenuItem
    Recursive: MenuItem
    Keep: MenuItem
    Hidden: MenuItem
    gotoPath: MenuItem
    prevPageMenuItem: MenuItem
    nextPageMenuItem: MenuItem
}
export function useMenu({
    isSortedBy,
    req,
    res,
    selectedFile,
    orderBy,
    api,
    prevPage,
    nextPage,
    gotoPath: gotoPath2,
    state,
    dispatcher,
}: {
    reloadFiles: () => unknown
    req: ListFilesRequest
    res: ListFilesResponse
    selectedFile?: FsFile
    path: string
    api: Api
    orderBy(x: Column): void
    prevPage(): void
    nextPage(): void
    isSortedBy(key: keyof Columns, desc?: boolean | undefined): boolean
    gotoPath(): void
    state: State
    dispatcher: Helper
}): MenuItems {
    const commands = dispatcher
    const history = useHistory()

    function useReqToggle(prop: keyof ListFilesRequest) {
        const history2 = history
        const value = req[prop]
        const action = useCallback(
            () => dispatcher.setReq({ history: history2, v: req => ({ ...req, [prop]: !value }) }),
            [history2, prop, value]
        )
        const isActive = useCallback(() => !!value, [value])
        return useToggle(action, isActive)
    }

    const { GotoFolder } = api
    const { ParentFolder, PreviousSibling, NextSibling } = res?.Relatives ?? {}
    function useGotoFolder(folder: FsFile | undefined) {
        return useAction(useCallback(() => folder && GotoFolder(folder), [folder]))
    }
    const up = useGotoFolder(ParentFolder)
    const prev = useGotoFolder(PreviousSibling)
    const next = useGotoFolder(NextSibling)

    const gotoPath = useAction(gotoPath2)

    const currentFolder = res?.File
    const { deleteOrTrash, explore } = commands

    const google = useAction(
        useCallback(() => currentFolder && openInNewWindow(GetGoogleSearchLink(currentFolder)), [currentFolder])
    )
    const subs = useAction(
        useCallback(
            () => currentFolder && openInNewWindow(GetSubtitleSearchLink(currentFolder)),

            [currentFolder]
        )
    )
    const Explore = useAction(useCallback(() => currentFolder && explore(currentFolder), [explore, currentFolder]))

    const Delete = useAction(
        useCallback(
            (e?: React.KeyboardEvent) =>
                selectedFile && deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

            [deleteOrTrash, selectedFile]
        )
    )
    const OrderByInnerSelection = useMemo<MenuItem>(
        () => ({
            action: () => orderBy(Columns.hasInnerSelection),
            isActive: () => isSortedBy(Columns.hasInnerSelection),
        }),
        [isSortedBy, orderBy]
    )

    const FolderSize = useReqToggle("FolderSize")
    const foldersFirst = useReqToggle("foldersFirst")
    const disableSorting = useToggle(
        useCallback(
            () =>
                dispatcher.setReq({
                    history,
                    v: req => ({
                        ...req,
                        sortBy: undefined,
                        sortByDesc: false,
                        foldersFirst: false,
                        ByInnerSelection: false,
                    }),
                }),
            [dispatcher, history]
        ),
        useCallback(
            () => !req.sortBy && !req.foldersFirst && req.ByInnerSelection == null,
            [req.ByInnerSelection, req.foldersFirst, req.sortBy]
        )
    )

    const Folders = useReqToggle("HideFolders")
    const Files = useReqToggle("HideFiles")
    const Recursive = useReqToggle("IsRecursive")
    const Keep = useReqToggle("KeepView")
    const Hidden = useReqToggle("ShowHiddenFiles")
    const prevPageMenuItem = useAction(prevPage)
    const nextPageMenuItem = useAction(nextPage)

    const allMenuItems = useMemo<MenuItems>(
        () => ({
            up,
            prev,
            next,
            google,
            subs,
            Explore,
            Delete,
            OrderByInnerSelection,
            FolderSize,
            foldersFirst,
            disableSorting,
            Folders,
            Files,
            Recursive,
            Keep,
            Hidden,
            gotoPath,
            prevPageMenuItem,
            nextPageMenuItem,
        }),
        [
            Delete,
            Explore,
            Files,
            FolderSize,
            Folders,
            Hidden,
            Keep,
            OrderByInnerSelection,
            Recursive,
            disableSorting,
            foldersFirst,
            google,
            gotoPath,
            next,
            nextPageMenuItem,
            prev,
            prevPageMenuItem,
            subs,
            up,
        ]
    )
    return allMenuItems
}

function openInNewWindow(p: string): void {
    window.open(p, "_blank")
}

function useAction(action: () => void): MenuItem {
    return useMemo<MenuItem>(
        () => ({
            action,
        }),
        [action]
    )
}
function useToggle(action: () => void, isActive: () => boolean): MenuItem {
    return useMemo<MenuItem>(
        () => ({
            action,
            isActive,
        }),
        [action, isActive]
    )
}
