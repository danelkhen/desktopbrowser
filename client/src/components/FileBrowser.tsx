import { useCallback, useEffect, useState } from "react"
import { useMatch, useNavigate } from "react-router"
import styled from "styled-components"
import { urlToPath } from "../hooks/urlToPath"
import { useAppState } from "../hooks/useAppState"
import { useFilter } from "../hooks/useFilter"
import { useSearch } from "../hooks/useSearch"
import { usePaging } from "../hooks/usePaging"
import { useQuery } from "../hooks/useQuery"
import { useSelection } from "../hooks/useSelection"
import { useSorting } from "../hooks/useSorting"
import { dispatcher } from "../lib/Dispatcher"
import { GlobalStyle, colors } from "../lib/GlobalStyle"
import { gridColumns } from "../lib/gridColumns"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files } from "./Files"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"

export function FileBrowser() {
    console.log("FileBrowser render")

    const state = useAppState()
    const navigate = useNavigate()
    dispatcher.navigate = navigate

    const match = useMatch("/*")
    const reqPath = urlToPath(match?.params["*"] ?? "")
    console.log("match", match, match?.params["*"] ?? "", reqPath)
    const p = useQuery().toString() // get("p") ?? ""
    useEffect(() => {
        dispatcher.parseRequest(reqPath, p)
    }, [p, reqPath])

    useEffect(() => {
        void dispatcher.fetchAllFilesMetadata()
    }, [])

    const { req, res, sorting } = state
    const [search, setSearch] = useState("")
    const [path, setPath] = useState("")
    const [theme, setTheme] = useState("dark")

    const allFiles = res.Files ?? []
    const pageSize = 200

    const sorted = useSorting(allFiles, sorting)
    const filtered2 = useFilter(req, sorted)
    const filtered = useSearch(search, filtered2)
    const { paged, nextPage, prevPage, totalPages, pageIndex } = usePaging(filtered, {
        pageSize,
    })
    const files = paged

    useEffect(() => {
        setPath(req.Path ?? "")
    }, [req.Path])

    const { GotoFolder } = dispatcher
    const { ParentFolder } = res?.Relatives ?? {}
    const up = useCallback(() => ParentFolder && GotoFolder(ParentFolder), [GotoFolder, ParentFolder])

    const { setSelectedFiles, selectedFiles, selectedFile } = useSelection({
        res,
        up,
    })

    const gotoPath = useCallback(() => dispatcher.GotoPath(path), [path])

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
            </header>
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                columns={gridColumns}
                files={files}
            />
        </>
    )
}

const Nav = styled.nav`
    font-size: 10px;
    background-color: ${colors.__bg1};
    background-color: #181818;
    margin: 0;
    padding: 0;
    display: flex;
    color: ${colors.__fg2};
    .find {
        display: flex;
    }
    > li {
        display: flex;
        list-style: none;
    }
    > li > a {
        text-decoration: none;
        padding: 10px;
        display: flex;
    }
    &.hidden {
        visibility: hidden;
    }

    &.fixed {
        position: fixed;
        top: 0;
        width: 100%;
    }
    .clock {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        color: #999;
    }
`
