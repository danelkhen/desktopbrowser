import { Outlet } from "react-router-dom"
import { GlobalStyle } from "./GlobalStyle"
import { Global } from "@emotion/react"

export function AppComponent() {
    return (
        <>
            <Global styles={GlobalStyle} />
            <Outlet />
        </>
    )
}
