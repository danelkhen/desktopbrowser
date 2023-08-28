import { createBrowserRouter } from "react-router-dom"
import { FileBrowser } from "./FileBrowser/index"
import { Tray } from "./Tray/Tray"
import { AppComponent } from "./AppComponent"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppComponent />,
        children: [
            {
                index: true,
                element: <FileBrowser />,
            },
            {
                path: "tray",
                element: <Tray />,
            },
            {
                index: true,
                path: "/*",
                element: <FileBrowser />,
            },
        ],
    },
])
