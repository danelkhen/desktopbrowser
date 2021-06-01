import * as C from "../../../../shared/src/contracts"
import { useState, useMemo, useEffect } from "react"
import { App } from "../../App"

export function useFileMetadata(): FileMetadata {
    const [filesMd, setFilesMd] = useState<C.ByFilename[]>()

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

        function getFileMetadata(key: string): C.ByFilename | null {
            const x = filesMd?.find(t => t.key == key)
            if (!x) return null
            return x
        }

        async function setFileMetadata(value: C.ByFilename) {
            if (value.selectedFiles == null || value.selectedFiles.length == 0) {
                setFilesMd(filesMd?.filter(t => t.key != value.key) ?? [])
                app.byFilename.removeById({ id: value.key })
                return
            }
            const x = filesMd?.filter(t => t.key != value.key) ?? []
            x.push(value)
            setFilesMd(x)
            await app.byFilename.persist(value)
        }

        const x: FileMetadata = {
            setFileMetadata,
            getFileMetadata,
            getSavedSelectedFile,
            saveSelectedFile,
            filesMd,
            setFilesMd,
        }
        return x
    }, [filesMd])

    useEffect(() => {
        ;(async () => {
            const x = await App.current.getAllFilesMetadata()
            setFilesMd(x)
        })()
    }, [])
    return fileMetadata
}

export interface FileMetadata {
    setFileMetadata: (value: C.ByFilename) => Promise<void>
    getFileMetadata: (key: string) => C.ByFilename | null
    getSavedSelectedFile: (folder: string) => string | null
    saveSelectedFile: (folderName: string, filename: string) => Promise<void>
    filesMd: C.ByFilename[] | undefined
    setFilesMd(filesMd: C.ByFilename[]): void
}
