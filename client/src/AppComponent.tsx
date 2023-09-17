import { Outlet } from "react-router-dom"
import { GlobalStyle } from "./GlobalStyle"

export function AppComponent() {
    return (
        <>
            <GlobalStyle />
            <Outlet />
        </>
    )
}
