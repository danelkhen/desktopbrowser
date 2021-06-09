import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { FileBrowser } from "./FileBrowser/index"
import { useApp } from "./App"
import { MediaComponent } from "./Media/MediaComponent"

export function AppComponent() {
    const app = useApp()
    if (!app) return null

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/" exact>
                        <FileBrowser app={app} />
                    </Route>
                    <Route path="/media">
                        <MediaComponent />
                    </Route>
                    <Route path="/media2">
                        <div>MEDIA2</div>
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
}
