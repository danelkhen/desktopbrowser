import { useCallback, useEffect, useState } from "react"
import { GlobalStyle } from "./GlobalStyle"
import { proxyForFileService } from "../FileBrowser/lib/proxyForFileService"
import styled from "styled-components"
const proxy = proxyForFileService()

const TrayDiv = styled.div`
    display: flex;
    flex-direction: column;
    > * {
        margin: 4px 0;
        padding: 6px;
    }
`
export function Tray() {
    const [version, setVersion] = useState<string | undefined>()
    const [status, setStatus] = useState<string | undefined>()
    useEffect(() => {
        document.body.addEventListener("keydown", e => {
            if (e.key === "F12") {
                proxy.appInspect()
            }
        })
        ;(async () => {
            setVersion(await proxy.appGetVersion())
        })()
    }, [])

    const checkForUpdates = useCallback(async () => {
        const res = await proxy.checkForUpdates()
        setStatus(res.isLatest ? "you have the latest version" : `there's a newer version ${res.latest}`)
    }, [])

    return (
        <>
            <GlobalStyle />
            <TrayDiv>
                {false && <button onClick={() => proxy.appInspect()}>Inspect</button>}
                <button onClick={() => open()}>Open</button>
                <button onClick={() => exit()}>Exit</button>
                <button onClick={() => checkForUpdates()}>Check for updates</button>
                <div>{version}</div>
                <div>{status}</div>
            </TrayDiv>
        </>
    )
}

async function open() {
    await proxy.appOpen()
}
async function exit() {
    await proxy.appExit()
}
