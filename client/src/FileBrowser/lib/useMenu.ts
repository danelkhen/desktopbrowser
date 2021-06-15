import { useCallback, useMemo } from "react"
import { FsFile, ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
import { Columns } from "../Columns"
import { Helper, State } from "../Helper"
import { GetGoogleSearchLink, GetSubtitleSearchLink } from "../utils"

interface MenuItem {
    action(): void
}
export interface ToggleMenuItem extends MenuItem {
    isActive(): boolean
}
export interface MenuItems {
    up: MenuItem
    prev: MenuItem
    next: MenuItem
    google: MenuItem
    subs: MenuItem
    Explore: MenuItem
    Delete: MenuItem
    OrderByInnerSelection: ToggleMenuItem
    FolderSize: ToggleMenuItem
    foldersFirst: ToggleMenuItem
    disableSorting: ToggleMenuItem
    Folders: ToggleMenuItem
    Files: ToggleMenuItem
    Recursive: ToggleMenuItem
    Keep: ToggleMenuItem
    Hidden: ToggleMenuItem
    gotoPath: MenuItem
    prevPageMenuItem: MenuItem
    nextPageMenuItem: MenuItem
}
export function useMenu({
    req,
    res,
    selectedFile,
    prevPage,
    nextPage,
    gotoPath: gotoPath2,
    dispatcher,
}: {
    req: ListFilesRequest
    res: ListFilesResponse
    selectedFile?: FsFile
    path: string
    prevPage(): void
    nextPage(): void
    gotoPath(): void
    state: State
    dispatcher: Helper
}): MenuItems {
    const commands = dispatcher
    const { orderBy, isSortedBy } = dispatcher

    function useReqToggle(prop: keyof ListFilesRequest) {
        const value = req[prop]
        const action = useCallback(() => dispatcher.updateReq({ [prop]: !value }), [prop, value])
        const isActive = useCallback(() => !!value, [value])
        return useToggle(action, isActive)
    }

    const { GotoFolder } = dispatcher
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
    const OrderByInnerSelection = useMemo<ToggleMenuItem>(
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
                dispatcher.updateReq({
                    sortBy: undefined,
                    sortByDesc: false,
                    foldersFirst: false,
                    ByInnerSelection: false,
                }),
            [dispatcher]
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
function useToggle(action: () => void, isActive: () => boolean): ToggleMenuItem {
    return useMemo<ToggleMenuItem>(
        () => ({
            action,
            isActive,
        }),
        [action, isActive]
    )
}
