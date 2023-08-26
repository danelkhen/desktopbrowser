import { createRoot } from "react-dom/client"
import { AppComponent } from "./AppComponent"

const container = document.querySelector("#root") as HTMLElement
const root = createRoot(container)
root.render(<AppComponent />)
