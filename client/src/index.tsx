import React from "react"
import ReactDOM from "react-dom"
import { AppComponent } from "./AppComponent"
import "./FileBrowser/GlobalStyle.ts"

export async function main() {
    ReactDOM.render(<AppComponent />, document.querySelector("#root"))
}

main()
