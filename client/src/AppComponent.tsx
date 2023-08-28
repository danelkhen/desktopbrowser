import { Outlet } from "react-router-dom"
import { useApp } from "./FileBrowser/App"
import { GlobalStyle } from "./FileBrowser/GlobalStyle"

export function AppComponent() {
    const app = useApp()
    if (!app) return null

    return (
        <>
            <GlobalStyle />
            <Outlet />
        </>
    )
}
