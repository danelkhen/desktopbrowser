import { useMemo } from "react"
import * as C from "../../../../shared/src/contracts"
import { File } from "../../../../shared/src/contracts"
import { App } from "../../App"
import { Columns } from "../Columns"
import { ColumnsConfig } from "../Grid/Grid"

export type FileColumnsConfig = ColumnsConfig<C.File, Columns>

export function useCommands(reloadFiles: () => Promise<void>): Commands {
    return useMemo(() => {
        const app = App.current
        const server = app.fileService

        async function DeleteAndRefresh(file: File): Promise<void> {
            if (!file.Path) return
            const fileOrFolder = file.IsFolder ? "folder" : "file"
            if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
            await server.del({ Path: file.Path })
            await reloadFiles()
        }

        async function TrashAndRefresh(file: File): Promise<void> {
            if (!file.Path) return
            await server.trash({ Path: file.Path })
            await reloadFiles()
        }

        async function deleteOrTrash(file: File, isShiftDown: boolean): Promise<void> {
            if (isShiftDown) {
                await DeleteAndRefresh(file)
                return
            }
            await TrashAndRefresh(file)
        }

        async function explore(file: C.File): Promise<void> {
            if (!file?.Path) return
            await server.explore({ Path: file.Path })
        }

        const x: Commands = { explore, deleteOrTrash }
        return x
    }, [reloadFiles])
}

export interface Commands {
    explore: (file: C.File) => Promise<void>
    deleteOrTrash: (file: C.File, isShiftDown: boolean) => Promise<void>
}
