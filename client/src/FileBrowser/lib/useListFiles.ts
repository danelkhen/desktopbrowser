import * as C from "contracts"
import { useCallback, useEffect, useMemo, useState } from "react"
import { App } from "../../App"

export function useListFiles(req: C.ListFilesRequest) {
    const [res, setRes] = useState<C.ListFilesResponse>({
        Relatives: {},
    })
    const fetchFiles = useCallback(async (req: C.ListFilesRequest) => {
        const res = await App.current.fileService.ws.ListFiles(req)
        setRes(res)
    }, [])
    const reloadFiles = useCallback(async () => {
        if (req.FolderSize) {
            const req2 = { ...req, FolderSize: false }
            await fetchFiles(req2)
        }
        await fetchFiles(req)
    }, [fetchFiles, req])

    useEffect(() => {
        reloadFiles()
    }, [reloadFiles])

    return useMemo(() => {
        return { res, reloadFiles }
    }, [res, reloadFiles])
}
