import * as C from "contracts"
import { File } from "contracts"
import { useMemo } from "react"
import { Scanner } from "../../utils/Scanner"
import { Columns } from "../Columns"
import { ColumnsConfig } from "../Grid/Grid"
import { App } from "../../App"

export type FileColumnsConfig = ColumnsConfig<C.File, Columns>

export function useCommands(reloadFiles: () => Promise<void>): Commands {
    return useMemo(() => {
        const app = App.current
        const server = app.fileService

        async function DeleteAndRefresh(file: File): Promise<void> {
            if (!file.Path) return
            const fileOrFolder = file.IsFolder ? "folder" : "file"
            if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
            await server.http.Delete({ Path: file.Path })
            await reloadFiles()
        }

        async function TrashAndRefresh(file: File): Promise<void> {
            if (!file.Path) return
            await server.http.trash({ Path: file.Path })
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
            await server.http.Explore({ Path: file.Path })
        }

        async function tmdbLogin() {
            await app.tmdbApp.tmdb.loginToTmdb()
        }

        async function scan() {
            const scanner = new Scanner()
            scanner.folders = ["c:\\tv"]
            console.log("scan start")
            await scanner.scan()
            console.log("scan end", scanner)
        }

        const x: Commands = { explore, deleteOrTrash, tmdbLogin, scan }
        return x
    }, [reloadFiles])
}

export interface Commands {
    explore: (file: C.File) => Promise<void>
    deleteOrTrash: (file: C.File, isShiftDown: boolean) => Promise<void>
    tmdbLogin: () => Promise<void>
    scan: () => Promise<void>
}
