import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FsFile } from "../../../shared/src/FileService"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files2 } from "./Files2"
import { GlobalStyle } from "./GlobalStyle"
import { useHelper } from "./Helper"
import { Nav } from "./index.styles"
import { useApi } from "./lib/useApi"
import { useColumns, useColumnSorting, useReqSorting } from "./lib/useColumns"
import { useFileMetadata } from "./lib/useFileMetadata"
import { useFiltering } from "./lib/useFiltering"
import { usePaging } from "./lib/usePaging"
import { useReq } from "./lib/useReq"
import { useSelection } from "./lib/useSelection"
import { useSorting } from "./lib/useSorting"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"

export function FileBrowser() {
    console.log("FileBrowser render")

    const fileMetadata = useFileMetadata()
    const [state, dispatcher] = useHelper()
    useReq(state, dispatcher)
    const { req } = state
    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [path, setPath] = useState("")
    const [theme, setTheme] = useState("dark")
    const columns = useColumns({ fileMetadata })
    const { res } = state
    const { reloadFiles } = dispatcher
    // const { res, reloadFiles } = useListFiles(req)
    const sortingDefaults = useColumnSorting({ fileMetadata })
    const reqSorting = useReqSorting(req)
    const sorting = useMemo(() => ({ ...sortingDefaults, ...reqSorting }), [reqSorting, sortingDefaults])

    const allFiles = res.Files ?? []
    const pageSize = 200

    const { sorted, isSortedBy } = useSorting(allFiles, sorting)
    const filtered = useFiltering(search, sorted)
    const { paged, nextPage, prevPage, totalPages } = usePaging(filtered, { pageSize, pageIndex, setPageIndex })
    const files = paged

    const api = useApi({ req, sorting, dispatcher, state })
    const { Open, orderBy } = api

    useEffect(() => {
        setPath(req.Path ?? "")
    }, [req.Path])

    const { GotoFolder } = api
    const { ParentFolder } = res?.Relatives ?? {}
    const up = useCallback(() => ParentFolder && GotoFolder(ParentFolder), [GotoFolder, ParentFolder])

    const { setSelectedFiles, selectedFiles, selectedFile } = useSelection({
        res,
        fileMetadata,
        Open,
        up,
    })

    const ready = !!fileMetadata.filesMd
    const { GotoPath } = api
    const gotoPath = useCallback(() => GotoPath(path), [GotoPath, path])

    const hasInnerSelection = useCallback(
        (file: FsFile) => fileMetadata.getSavedSelectedFile(file.Name) != null,
        [fileMetadata]
    )

    useEffect(() => {
        reloadFiles()
    }, [reloadFiles])

    if (!ready) return null

    return (
        <>
            <GlobalStyle />
            <header>
                <Nav>
                    <Menu
                        selectedFile={selectedFile}
                        isSortedBy={isSortedBy}
                        prevPage={prevPage}
                        nextPage={nextPage}
                        req={req}
                        res={res}
                        path={path}
                        orderBy={orderBy}
                        api={api}
                        reloadFiles={reloadFiles}
                        gotoPath={gotoPath}
                        state={state}
                        dispatcher={dispatcher}
                    />
                    <Clock />
                </Nav>
                <AddressBar
                    prevPage={prevPage}
                    nextPage={nextPage}
                    gotoPath={gotoPath}
                    path={path}
                    setPath={setPath}
                    theme={theme}
                    setTheme={setTheme}
                    search={search}
                    setSearch={setSearch}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                />
                <QuickFind allFiles={allFiles} onFindFiles={setSelectedFiles} />
                <Files2
                    isSortedBy={isSortedBy}
                    hasInnerSelection={hasInnerSelection}
                    selectedFiles={selectedFiles}
                    allFiles={allFiles}
                    setSelectedFiles={setSelectedFiles}
                    Open={Open}
                    columns={columns}
                    files={files}
                    orderBy={orderBy}
                    body={false}
                />
            </header>
            <Files2
                isSortedBy={isSortedBy}
                hasInnerSelection={hasInnerSelection}
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                Open={Open}
                columns={columns}
                files={files}
                orderBy={orderBy}
                head={false}
            />
        </>
    )
}
