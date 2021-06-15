// import { useCallback, useEffect, useMemo, useState } from "react"
// import { ListFilesRequest, ListFilesResponse } from "../../../../shared/src/FileService"
// import { App } from "../../App"

// export function useListFiles(req: ListFilesRequest) {
//     const [res, setRes] = useState<ListFilesResponse>({
//         Relatives: {},
//     })
//     const fetchFiles = useCallback(async (req: ListFilesRequest) => {
//         const res = await App.current.fileService.listFiles(req)
//         setRes(res)
//     }, [])
//     const reloadFiles = useCallback(async () => {
//         if (req.FolderSize) {
//             const req2 = { ...req, FolderSize: false }
//             await fetchFiles(req2)
//         }
//         await fetchFiles(req)
//     }, [fetchFiles, req])

//     useEffect(() => {
//         reloadFiles()
//     }, [reloadFiles])

//     return useMemo(() => {
//         return { res, reloadFiles }
//     }, [res, reloadFiles])
// }
