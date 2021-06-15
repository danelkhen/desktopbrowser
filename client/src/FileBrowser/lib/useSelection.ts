import * as C from "../../../../shared/src/FileService"
import { useCallback, useEffect, useMemo, useState } from "react"
import { itemsAre, last, sleep } from "../../../../shared/src"
import { Selection } from "../../utils/Selection"
import { FileMetadata } from "./useFileMetadata"
import { FsFile } from "../../../../shared/src/FileService"
import { Helper } from "../Helper"
import { useHistory } from "react-router"

export function useSelection({
    res,
    fileMetadata,
    Open,
    up,
}: {
    res: C.ListFilesResponse
    fileMetadata: FileMetadata
    Open: Helper["Open"]
    up: () => void
}) {
    const [selectedFiles, _setSelectedFiles] = useState<FsFile[]>([])
    const { getSavedSelectedFile, saveSelectedFile } = fileMetadata
    const history = useHistory()

    // restore selection
    useEffect(() => {
        const selectedFileName = res.File?.Name ? getSavedSelectedFile(res.File.Name) : null
        const files = res?.Files?.filter(t => t.Name == selectedFileName) ?? []
        const selection = files
        _setSelectedFiles(selection)
    }, [res, fileMetadata, getSavedSelectedFile])

    const setSelectedFiles = useCallback(
        (v: FsFile[]) => {
            const file = v[v.length - 1]
            if (res?.File?.Name) {
                console.log("saveSelectionAndSetSelectedItems", res.File.Name, file?.Name)
                saveSelectedFile(res.File.Name, file?.Name)
            }
            console.log("selectedFiles", v)
            _setSelectedFiles(prev => {
                if (prev[itemsAre](v)) {
                    return prev
                }
                return v
            })
            verifySelectionInView()
        },
        [res, saveSelectedFile]
    )

    // Keyboard selection
    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            const selection = new Selection<FsFile>(res?.Files ?? [], selectedFiles)
            const selectedFile = selection.selectedItem
            const target = e.target as HTMLElement
            if (target.matches("input:not(#tbQuickFind),select")) return
            ;(document.querySelector("#tbQuickFind") as HTMLElement).focus()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSelectedFiles(selection.KeyDown(e as any))
            if (e.defaultPrevented) return
            if (e.key == "Enter") {
                const file = selectedFile
                if (!file) return
                e.preventDefault()
                Open(selectedFile)
            } else if (e.key == "Backspace") {
                up()
            }
        }
        window.addEventListener("keydown", Win_keydown)
        return () => window.removeEventListener("keydown", Win_keydown)
    }, [Open, history, res, selectedFiles, setSelectedFiles, up])

    const service = useMemo(() => {
        return {
            setSelectedFiles,
            selectedFiles,
            selectedFile: selectedFiles[last],
        }
    }, [selectedFiles, setSelectedFiles])

    return service
}

async function verifySelectionInView() {
    await sleep(10)
    const el = document.querySelector(".Selected") as HTMLElement
    if (el == null) return
    const container = document.body
    const containerHeight = container.clientHeight - 100

    const top = el.offsetTop
    const bottom = el.offsetTop + el.offsetHeight

    const top2 = container.scrollTop
    const bottom2 = container.scrollTop + containerHeight

    console.log({ top, bottom, top2, bottom2, containerHeight })

    let finalTop: number | null = null

    if (top < top2) {
        finalTop = top
    } else if (bottom > bottom2) {
        const finalBottom = bottom
        finalTop = finalBottom - containerHeight
    }

    if (finalTop == null) return
    console.log("scrolling", top2, finalTop)
    container.scrollTop = finalTop
}
