import { useCallback, useMemo } from "react"
import { FsFile, ListFilesRequest } from "../../../../shared/src/FileService"
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
    selectedFile,
    prevPage,
    nextPage,
    gotoPath: gotoPath2,
    dispatcher,
    state,
}: {
    selectedFile?: FsFile
    path: string
    prevPage(): void
    nextPage(): void
    gotoPath(): void
    state: State
    dispatcher: Helper
}): MenuItems {
    const { orderBy, isSortedBy } = dispatcher

    const toggles = useMemo(() => {
        function getReqToggle(prop: keyof ListFilesRequest) {
            const value = state.req[prop]
            const mi: ToggleMenuItem = {
                action: () => dispatcher.updateReq({ [prop]: !value }),
                isActive: () => !!value,
            }
            return mi
        }

        const FolderSize = getReqToggle("FolderSize")
        const foldersFirst = getReqToggle("foldersFirst")
        const Folders = getReqToggle("HideFolders")
        const Files = getReqToggle("HideFiles")
        const Recursive = getReqToggle("IsRecursive")
        const Keep = getReqToggle("KeepView")
        const Hidden = getReqToggle("ShowHiddenFiles")

        const disableSorting: ToggleMenuItem = {
            action: () =>
                dispatcher.updateReq({
                    sortBy: undefined,
                    sortByDesc: false,
                    foldersFirst: false,
                    ByInnerSelection: false,
                }),

            isActive: () => !state.req.sortBy && !state.req.foldersFirst && state.req.ByInnerSelection == null,
        }

        return { FolderSize, foldersFirst, Folders, Files, Recursive, Keep, Hidden, disableSorting }
    }, [dispatcher, state.req])

    const { GotoFolder } = dispatcher
    const { ParentFolder, PreviousSibling, NextSibling } = state.res?.Relatives ?? {}
    function useGotoFolder(folder: FsFile | undefined) {
        return useAction(useCallback(() => folder && GotoFolder(folder), [folder]))
    }
    const up = useGotoFolder(ParentFolder)
    const prev = useGotoFolder(PreviousSibling)
    const next = useGotoFolder(NextSibling)

    const gotoPath = useAction(gotoPath2)

    const currentFolder = state.res?.File

    const google = useAction(
        useCallback(() => currentFolder && openInNewWindow(GetGoogleSearchLink(currentFolder)), [currentFolder])
    )
    const subs = useAction(
        useCallback(
            () => currentFolder && openInNewWindow(GetSubtitleSearchLink(currentFolder)),

            [currentFolder]
        )
    )
    const Explore = useAction(
        useCallback(() => currentFolder && dispatcher.explore(currentFolder), [dispatcher, currentFolder])
    )

    const Delete = useAction(
        useCallback(
            (e?: React.KeyboardEvent) =>
                selectedFile && dispatcher.deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

            [dispatcher, selectedFile]
        )
    )
    const OrderByInnerSelection = useMemo<ToggleMenuItem>(
        () => ({
            action: () => orderBy(Columns.hasInnerSelection),
            isActive: () => isSortedBy(Columns.hasInnerSelection),
        }),
        [isSortedBy, orderBy]
    )

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
            gotoPath,
            prevPageMenuItem,
            nextPageMenuItem,
            ...toggles,
        }),
        [
            Delete,
            Explore,
            OrderByInnerSelection,
            google,
            gotoPath,
            next,
            nextPageMenuItem,
            prev,
            prevPageMenuItem,
            subs,
            toggles,
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
