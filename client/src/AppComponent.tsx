import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useApp } from "./FileBrowser/App"
import { FileBrowser } from "./FileBrowser/index"
import { Tray } from "./Tray/Tray"

export function AppComponent() {
    const app = useApp()
    if (!app) return null

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/tray" element={<Tray />} />
                    <Route path="/*" element={<FileBrowser />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
