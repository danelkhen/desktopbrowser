import { createRoot } from "react-dom/client"
import { AppComponent } from "./AppComponent"
import "./FileBrowser/GlobalStyle.ts"

const container = document.querySelector("#root") as HTMLElement
const root = createRoot(container)
root.render(<AppComponent />)
