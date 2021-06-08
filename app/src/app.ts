import { app, BrowserWindow, ipcMain, shell, Tray } from "electron"
import log from "electron-log"
import path from "path"
import { main } from "../../server/src/main"
import { dataDir, rootDir } from "../../server/src/rootDir"
import { migrateToLevelDB } from "../../server/src/migrateToLevelDb"

Object.assign(console, log.functions)

let myWindow: BrowserWindow = null!
let tray: Tray = null!

log.info(rootDir, dataDir)
log.info("appPath", app.getAppPath())

async function main2() {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
    } else {
        app.on("second-instance", (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (myWindow) {
                if (myWindow.isMinimized()) myWindow.restore()
                myWindow.focus()
            }
        })

        // Create myWindow, load the rest of the app, etc...
        await app.whenReady()

        app.dock.hide()

        await migrateToLevelDB()

        // Create a new tray
        tray = new Tray(path.join(rootDir, "app/assets/clapperboard-16x16.png"))
        tray.on("right-click", toggleWindow)
        tray.on("double-click", toggleWindow)
        tray.on("click", function (event) {
            toggleWindow()
        })

        // Create a new window
        myWindow = new BrowserWindow({
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

        const url2 = path.resolve(path.join(rootDir, "app/assets/index.html"))
        console.log(url2)
        myWindow.loadFile(url2)

        // window.webContents.openDevTools()

        myWindow.once("ready-to-show", () => {
            // window.webContents.addListener("new-window", function (e, url) {
            //     console.log(url, e)
            //     e.preventDefault()
            //     require("electron").shell.openExternal(url)
            // })
            const position = getWindowPosition()
            myWindow.setPosition(position.x, position.y, false)
            myWindow.show()
            myWindow.focus()
        })

        // Hide the window when it loses focus
        myWindow.on("blur", () => {
            myWindow.hide()
        })
        await main()
    }
}
// Wait until the app is ready

const getWindowPosition = () => {
    const windowBounds = myWindow.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}

// toggle window
const toggleWindow = () => {
    if (myWindow.isVisible()) {
        myWindow.hide()
    } else {
        showWindow()
    }
}

const showWindow = () => {
    const position = getWindowPosition()
    myWindow.setPosition(position.x, position.y, false)
    myWindow.show()
    myWindow.focus()
}

ipcMain.handle("main", async (e, name, ...args) => {
    log.log("main message", args)
    const x = {
        open() {
            shell.openExternal("http://localhost:7777")
        },
        exit() {
            app.quit()
        },
    }
    const res = await (x as any)?.[name](...args)
    return res
})

main2()
