import { Outlet } from "react-router-dom"
import { GlobalStyle } from "./FileBrowser/GlobalStyle"

export function AppComponent() {
    return (
        <>
            <GlobalStyle />
            <Outlet />
        </>
    )
}
