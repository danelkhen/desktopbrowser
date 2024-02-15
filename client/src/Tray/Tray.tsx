import { css } from "@emotion/css"
import { useCallback, useEffect, useState } from "react"
import { api } from "../services/api"
import { injectGlobalStyle } from "./GlobalStyle"

const TrayDiv = css`
    display: flex;
    flex-direction: column;
    > * {
        margin: 4px 0;
        padding: 6px;
    }
`
injectGlobalStyle()
export function Tray() {
    const [version, setVersion] = useState<string | undefined>()
    const [status, setStatus] = useState<string | undefined>()
    useEffect(() => {
        document.body.addEventListener("keydown", e => {
            if (e.key === "F12") {
                api.appInspect()
            }
        })
        ;(async () => {
            setVersion(await api.appGetVersion())
        })()
    }, [])

    const checkForUpdates = useCallback(async () => {
        const res = await api.checkForUpdates()
        setStatus(res.isLatest ? "you have the latest version" : `there's a newer version ${res.latest}`)
    }, [])

    return (
        <>
            <div className={TrayDiv}>
                {false && <button onClick={() => api.appInspect()}>Inspect</button>}
                <button onClick={() => open()}>Open</button>
                <button onClick={() => api.appHide()}>Close</button>
                <button onClick={() => exit()}>Exit</button>
                <button onClick={() => checkForUpdates()}>Check for updates</button>
                <div>{version}</div>
                <div>{status}</div>
            </div>
        </>
    )
}

async function open() {
    await api.appOpen()
}
async function exit() {
    await api.appExit()
}
