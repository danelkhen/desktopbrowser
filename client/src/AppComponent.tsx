import { Outlet } from "react-router-dom"
import { GlobalStyle } from "./lib/GlobalStyle"

export function AppComponent() {
    return (
        <>
            <GlobalStyle />
            <Outlet />
        </>
    )
}
