import { useCallback, useEffect, useState } from "react"
import { useMatch, useNavigate } from "react-router"
import { FsFile } from "../shared/FileService"
import { urlToPath } from "../hooks/urlToPath"
import { useAppState } from "../hooks/useAppState"
import { useFiltering, useFiltering2 } from "../hooks/useFiltering"
import { usePaging } from "../hooks/usePaging"
import { useQuery } from "../hooks/useQuery"
import { useSelection } from "../hooks/useSelection"
import { useSorting } from "../hooks/useSorting"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files2 } from "./Files2"
import { GlobalStyle } from "./GlobalStyle"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"
import { Nav } from "./index.styles"
import { dispatcher } from "./lib/Dispatcher"

export function FileBrowser() {
    console.log("FileBrowser render")

    const state = useAppState()
    const navigate = useNavigate()
    dispatcher.navigate = navigate

    // const history = useHistory()
    const match = useMatch("/*")
    const reqPath = urlToPath(match?.params["*"] ?? "")
    console.log("match", match, match?.params["*"] ?? "", reqPath)
    const p = useQuery().toString() // get("p") ?? ""
    useEffect(() => {
        dispatcher.parseRequest(reqPath, p)
    }, [p, reqPath])

    useEffect(() => {
        ;(async () => {
            await dispatcher.fetchAllFilesMetadata()
        })()
    }, [])

    const { req, columns, res, sorting } = state
    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [path, setPath] = useState("")
    const [theme, setTheme] = useState("dark")

    const allFiles = res.Files ?? []
    const pageSize = 200

    const sorted = useSorting(allFiles, sorting)
    const filtered2 = useFiltering2(req, dispatcher, sorted)
    const filtered = useFiltering(search, filtered2)
    const {
        paged,
        nextPage,
        prevPage,
        totalPages,
        pageIndex: pageIndex2,
    } = usePaging(filtered, {
        pageSize,
        pageIndex,
        setPageIndex,
    })
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
        Open,
        up,
    })

    const { GotoPath } = dispatcher
    const gotoPath = useCallback(() => GotoPath(path), [GotoPath, path])

    const hasInnerSelection = useCallback((file: FsFile) => dispatcher.getSavedSelectedFile(file.Name) != null, [])

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
                    pageIndex={pageIndex2}
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
