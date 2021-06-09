import * as C from "../../../../shared/src/contracts"
import { useState, useMemo, useEffect } from "react"
import { App } from "../../App"

export function useFileMetadata(): FileMetadata {
    const [filesMd, setFilesMd] = useState<{ [key: string]: C.FileInfo } | undefined>()

    const fileMetadata = useMemo(() => {
        const app = App.current
        async function saveSelectedFile(folderName: string, filename: string) {
            await setFileMetadata({ key: folderName, selectedFiles: filename ? [filename] : undefined })
        }

        function getSavedSelectedFile(folder: string): string | null {
            const x = getFileMetadata(folder)
            if (x == null || x.selectedFiles == null) return null
            return x.selectedFiles[0]
        }

        function getFileMetadata(key: string): C.FileInfo | null {
            const x = filesMd?.[key]
            if (!x) return null
            return x
        }

        async function setFileMetadata(value: C.FileInfo) {
            if (value.selectedFiles == null || value.selectedFiles.length == 0) {
                const { [value.key]: removed, ...rest } = filesMd ?? {}
                setFilesMd(rest)
                app.fileService.http.deleteFileMetadata({ key: value.key })
                return
            }
            setFilesMd({ ...filesMd, [value.key]: value })
            await app.fileService.http.saveFileMetadata(value)
        }

        const x: FileMetadata = {
            setFileMetadata,
            getFileMetadata,
            getSavedSelectedFile,
            saveSelectedFile,
            filesMd,
        }
        return x
    }, [filesMd])

    useEffect(() => {
        ;(async () => {
            const x = await App.current.getAllFilesMetadata()
            const obj: { [key: string]: C.FileInfo } = {}
            x.map(t => (obj[t.key] = t))
            setFilesMd(obj)
        })()
    }, [])
    return fileMetadata
}

export interface FileMetadata {
    setFileMetadata: (value: C.FileInfo) => Promise<void>
    getFileMetadata: (key: string) => C.FileInfo | null
    getSavedSelectedFile: (folder: string) => string | null
    saveSelectedFile: (folderName: string, filename: string) => Promise<void>
    filesMd: { [key: string]: C.FileInfo } | undefined
}
