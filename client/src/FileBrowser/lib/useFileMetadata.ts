import { useEffect, useMemo, useState } from "react"
import { FileInfo } from "../../../../shared/src/FileService"
import { App } from "../../App"

export function useFileMetadata(): FileMetadata {
    const [filesMd, setFilesMd] = useState<{ [key: string]: FileInfo } | undefined>()

    const fileMetadata = useMemo(() => {
        const app = App.current
        async function saveSelectedFile(folderName: string, filename: string) {
            await setFileMetadata({ key: folderName, selectedFiles: filename ? [filename] : undefined, collection: "" })
        }

        function getSavedSelectedFile(folder: string): string | null {
            const x = getFileMetadata(folder)
            if (x == null || x.selectedFiles == null) return null
            return x.selectedFiles[0]
        }

        function getFileMetadata(key: string): FileInfo | null {
            const x = filesMd?.[key]
            if (!x) return null
            return x
        }

        async function setFileMetadata(value: FileInfo) {
            if (value.selectedFiles == null || value.selectedFiles.length == 0) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [value.key]: removed, ...rest } = filesMd ?? {}
                setFilesMd(rest)
                await app.fileService.deleteFileMetadata({ key: value.key })
                return
            }
            setFilesMd({ ...filesMd, [value.key]: value })
            await app.fileService.saveFileMetadata(value)
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
            const obj: { [key: string]: FileInfo } = {}
            x.map(t => (obj[t.key] = t))
            setFilesMd(obj)
        })()
    }, [])
    return fileMetadata
}

export interface FileMetadata {
    setFileMetadata: (value: FileInfo) => Promise<void>
    getFileMetadata: (key: string) => FileInfo | null
    getSavedSelectedFile: (folder: string) => string | null
    saveSelectedFile: (folderName: string, filename: string) => Promise<void>
    filesMd: { [key: string]: FileInfo } | undefined
}
