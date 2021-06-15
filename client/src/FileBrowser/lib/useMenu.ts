import { useCallback, useMemo } from "react"
import { FsFile } from "../../../../shared/src/FileService"
import { Helper, State } from "../Helper"
import { GetGoogleSearchLink, GetSubtitleSearchLink } from "../utils"

interface MenuItem {
    action(): void
}
export interface ToggleMenuItem extends MenuItem {
    isActive(): boolean
}
export interface MenuItems {
    google: MenuItem
    subs: MenuItem
    Explore: MenuItem
    Delete: MenuItem
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

    const prevPageMenuItem = useAction(prevPage)
    const nextPageMenuItem = useAction(nextPage)

    const allMenuItems = useMemo<MenuItems>(
        () => ({
            google,
            subs,
            Explore,
            Delete,
            gotoPath,
            prevPageMenuItem,
            nextPageMenuItem,
        }),
        [Delete, Explore, google, gotoPath, nextPageMenuItem, prevPageMenuItem, subs]
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
