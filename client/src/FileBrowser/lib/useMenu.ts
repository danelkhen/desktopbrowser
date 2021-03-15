import * as C from "contracts"
import { useCallback, useMemo } from "react"
import { Column, Columns } from "../Columns"
import { GetGoogleSearchLink, GetSubtitleSearchLink } from "../utils"
import { Api } from "./useApi"
import { Commands, useCommands } from "./useCommands"
import { SetRequest } from "./useReq"

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
    Imdb: MenuItem
    Delete: MenuItem
    TmdbLogin: MenuItem
    Scan: MenuItem
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
    reloadFiles,
    req,
    res,
    selectedFile,
    path,
    orderBy,
    setReq,
    getTmdbInfo,
    api,
    prevPage,
    nextPage,
    gotoPath: gotoPath2,
}: {
    reloadFiles: () => Promise<void>
    req: C.ListFilesRequest
    res: C.ListFilesResponse
    selectedFile?: C.File
    path: string
    api: Api
    orderBy(x: Column): void
    setReq: SetRequest
    getTmdbInfo(x: C.File): void
    prevPage(): void
    nextPage(): void
    isSortedBy(key: keyof Columns, desc?: boolean | undefined): boolean
    gotoPath(): void
}): MenuItems {
    const commands = useCommands(reloadFiles)

    function useReqToggle(prop: keyof C.ListFilesRequest) {
        const setReq2 = setReq
        const value = req[prop]
        const action = useCallback(() => setReq2(req => ({ ...req, [prop]: !value })), [prop, setReq2, value])
        const isActive = useCallback(() => !!value, [value])
        return useToggle(action, isActive)
    }

    const { GotoFolder } = api
    const { ParentFolder, PreviousSibling, NextSibling } = res?.Relatives ?? {}
    function useGotoFolder(folder: C.File | undefined) {
        return useAction(useCallback(() => folder && GotoFolder(folder), [folder]))
    }
    const up = useGotoFolder(ParentFolder)
    const prev = useGotoFolder(PreviousSibling)
    const next = useGotoFolder(NextSibling)

    const gotoPath = useAction(gotoPath2)

    const currentFolder = res?.File
    const { deleteOrTrash, tmdbLogin, scan, explore } = commands

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
    const Imdb = useAction(useCallback(() => currentFolder && getTmdbInfo(currentFolder), [currentFolder, getTmdbInfo]))

    const Delete = useAction(
        useCallback(
            (e?: React.KeyboardEvent) => selectedFile && deleteOrTrash(selectedFile, e?.shiftKey ?? false),

            [deleteOrTrash, selectedFile]
        )
    )
    const TmdbLogin = useAction(useCallback(() => tmdbLogin(), [tmdbLogin]))
    const Scan = useAction(useCallback(() => () => scan(), [scan]))
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
                setReq(req => ({
                    ...req,
                    sortBy: undefined,
                    sortByDesc: false,
                    foldersFirst: false,
                    ByInnerSelection: false,
                })),
            [setReq]
        ),
        useCallback(() => !req.sortBy && !req.foldersFirst && req.ByInnerSelection == null, [
            req.ByInnerSelection,
            req.foldersFirst,
            req.sortBy,
        ])
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
            Imdb,
            Delete,
            TmdbLogin,
            Scan,
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
            Imdb,
            Keep,
            OrderByInnerSelection,
            Recursive,
            Scan,
            TmdbLogin,
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
