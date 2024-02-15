import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { injectGlobalStyle } from "./GlobalStyle"

injectGlobalStyle()
const container = document.querySelector("#root") as HTMLElement
const root = createRoot(container)
root.render(<RouterProvider router={router} />)
