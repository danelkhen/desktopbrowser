import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useApp } from "./App"
import { FileBrowser } from "./FileBrowser/index"

export function AppComponent() {
    const app = useApp()
    if (!app) return null

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/" exact>
                        <FileBrowser />
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
}
