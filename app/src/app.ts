import { app, BrowserWindow, Tray } from "electron"
import path from "path"
import { main } from "../../server/src/main"
import url from "url"

let window: BrowserWindow = null!
let tray: Tray = null!

app.dock.hide()

// Wait until the app is ready
app.once("ready", async () => {
    // Create a new tray
    tray = new Tray("app/assets/clapperboard-16x16.png")
    tray.on("right-click", toggleWindow)
    tray.on("double-click", toggleWindow)
    tray.on("click", function (event) {
        toggleWindow()
    })

    // Create a new window
    window = new BrowserWindow({
        width: 300,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        webPreferences: {
            backgroundThrottling: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    // require("electron").shell.openExternal("http://localhost:7777")

    const url2 = path.resolve("app/assets/index.html") // "https://electronjs.org"
    console.log(url2)
    window.loadFile(url2)

    // window.webContents.openDevTools()

    window.once("ready-to-show", () => {
        // window.webContents.addListener("new-window", function (e, url) {
        //     console.log(url, e)
        //     e.preventDefault()
        //     require("electron").shell.openExternal(url)
        // })
        const position = getWindowPosition()
        window.setPosition(position.x, position.y, false)
        window.show()
        window.focus()
    })

    // Hide the window when it loses focus
    window.on("blur", () => {
        window.hide()
    })
    await main()
})

const getWindowPosition = () => {
    const windowBounds = window.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}

// toggle window
const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide()
    } else {
        showWindow()
    }
}

const showWindow = () => {
    const position = getWindowPosition()
    window.setPosition(position.x, position.y, false)
    window.show()
    window.focus()
}
