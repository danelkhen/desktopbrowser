import React, { useCallback, useEffect, useState } from "react"
import { FsFile } from "../../../shared/src/FileService"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files2 } from "./Files2"
import { GlobalStyle } from "./GlobalStyle"
import { useHelper } from "./lib/Helper"
import { Nav } from "./index.styles"
import { useFiltering } from "./lib/useFiltering"
import { usePaging } from "./lib/usePaging"
import { useQuery } from "./lib/useQuery"
import { useSelection } from "./lib/useSelection"
import { useSorting } from "./lib/useSorting"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"

export function FileBrowser() {
    console.log("FileBrowser render")

    const [state, dispatcher] = useHelper()
    const p = useQuery().get("p") ?? ""
    useEffect(() => {
        dispatcher.parseRequest(p)
    }, [dispatcher, p])

    useEffect(() => {
        ;(async () => {
            await dispatcher.fetchAllFilesMetadata()
        })()
    }, [dispatcher])

    const { req, columns, res, sorting } = state
    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [path, setPath] = useState("")
    const [theme, setTheme] = useState("dark")

    const allFiles = res.Files ?? []
    const pageSize = 200

    const sorted = useSorting(allFiles, sorting)
    const filtered = useFiltering(search, sorted)
    const { paged, nextPage, prevPage, totalPages } = usePaging(filtered, { pageSize, pageIndex, setPageIndex })
    const files = paged

    const { Open, orderBy } = dispatcher

    useEffect(() => {
        setPath(req.Path ?? "")
    }, [req.Path])

    const { GotoFolder } = dispatcher
    const { ParentFolder } = res?.Relatives ?? {}
    const up = useCallback(() => ParentFolder && GotoFolder(ParentFolder), [GotoFolder, ParentFolder])

    const { setSelectedFiles, selectedFiles, selectedFile } = useSelection({
        res,
        dispatcher,
        Open,
        up,
    })

    const { GotoPath } = dispatcher
    const gotoPath = useCallback(() => GotoPath(path), [GotoPath, path])

    const hasInnerSelection = useCallback(
        (file: FsFile) => dispatcher.getSavedSelectedFile(file.Name) != null,
        [dispatcher]
    )

    return (
        <>
            <GlobalStyle />
            <header>
                <Nav>
                    <Menu selectedFile={selectedFile} state={state} dispatcher={dispatcher} />
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
