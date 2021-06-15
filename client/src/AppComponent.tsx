import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useApp } from "./FileBrowser/App"
import { FileBrowser } from "./FileBrowser/index"
import { Tray } from "./Tray/Tray"

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
                    <Route path="/tray" exact>
                        <Tray />
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
}
