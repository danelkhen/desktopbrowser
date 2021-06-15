import React, { useCallback, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { FsFile } from "../../../shared/src/FileService"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files2 } from "./Files2"
import { GlobalStyle } from "./GlobalStyle"
import { useHelper } from "./Helper"
import { Nav } from "./index.styles"
import { useFileMetadata } from "./lib/useFileMetadata"
import { useFiltering } from "./lib/useFiltering"
import { usePaging } from "./lib/usePaging"
import { useQuery } from "./lib/useQuery"
import { useSelection } from "./lib/useSelection"
import { useSorting } from "./lib/useSorting"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"

export function FileBrowser() {
    console.log("FileBrowser render")

    const fileMetadata = useFileMetadata()
    const [state, dispatcher] = useHelper()
    const p = useQuery().get("p") ?? ""
    useEffect(() => {
        dispatcher.updateReq(p)
    }, [dispatcher, p])

    const { req } = state
    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [path, setPath] = useState("")
    const [theme, setTheme] = useState("dark")
    const { columns } = state
    const { res } = state
    const { reloadFiles } = dispatcher
    const { sorting } = state

    const allFiles = res.Files ?? []
    const pageSize = 200

    const sorted = useSorting(allFiles, sorting)
    const filtered = useFiltering(search, sorted)
    const { paged, nextPage, prevPage, totalPages } = usePaging(filtered, { pageSize, pageIndex, setPageIndex })
    const files = paged

    const api = dispatcher
    const { Open, orderBy } = api

    useEffect(() => {
        setPath(req.Path ?? "")
    }, [req.Path])

    const { GotoFolder } = api
    const history = useHistory()
    const { ParentFolder } = res?.Relatives ?? {}
    const up = useCallback(() => ParentFolder && GotoFolder(history, ParentFolder), [GotoFolder, ParentFolder, history])

    const { setSelectedFiles, selectedFiles, selectedFile } = useSelection({
        res,
        fileMetadata,
        Open,
        up,
    })

    const ready = !!fileMetadata.filesMd
    const { GotoPath } = api
    const gotoPath = useCallback(() => GotoPath(history, path), [GotoPath, path, history])

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
                        prevPage={prevPage}
                        nextPage={nextPage}
                        req={req}
                        res={res}
                        path={path}
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
                    hasInnerSelection={hasInnerSelection}
                    selectedFiles={selectedFiles}
                    allFiles={allFiles}
                    setSelectedFiles={setSelectedFiles}
                    Open={Open}
                    columns={columns}
                    files={files}
                    orderBy={orderBy}
                    body={false}
                    dispatcher={dispatcher}
                />
            </header>
            <Files2
                hasInnerSelection={hasInnerSelection}
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                Open={Open}
                columns={columns}
                files={files}
                orderBy={orderBy}
                head={false}
                dispatcher={dispatcher}
            />
        </>
    )
}
