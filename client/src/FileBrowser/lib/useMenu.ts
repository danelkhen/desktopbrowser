import { useCallback, useMemo } from "react"
import { FsFile } from "../../../../shared/src/FileService"
import { Helper } from "../Helper"

interface MenuItem {
    action(): void
}
export interface ToggleMenuItem extends MenuItem {
    isActive(): boolean
}
export interface MenuItems {
    Delete: MenuItem
    gotoPath: MenuItem
}
export function useMenu({
    selectedFile,
    gotoPath: gotoPath2,
    dispatcher,
}: {
    selectedFile?: FsFile
    path: string
    gotoPath(): void
    dispatcher: Helper
}): MenuItems {
    const gotoPath = useAction(gotoPath2)

    const Delete = useAction(
        useCallback(
            (e?: React.KeyboardEvent) =>
                selectedFile && dispatcher.deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

            [dispatcher, selectedFile]
        )
    )

    const allMenuItems = useMemo<MenuItems>(
        () => ({
            Delete,
            gotoPath,
        }),
        [Delete, gotoPath]
    )
    return allMenuItems
}

function useAction(action: () => void): MenuItem {
    return useMemo<MenuItem>(
        () => ({
            action,
        }),
        [action]
    )
}
