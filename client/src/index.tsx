import "./FileBrowser/GlobalStyle.ts"
import "./utils/global"
import { App } from "./App"
import ReactDOM from "react-dom"
import React from "react"
import { AppComponent } from "./AppComponent"

export async function main() {
    await App.init()
    ReactDOM.render(<AppComponent />, document.querySelector("#root")) as any
}

main()
