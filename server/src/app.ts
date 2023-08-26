import { app, BrowserWindow, Tray } from "electron"
import log from "electron-log"
import path from "path"
import { main } from "./main"
import { dataDir, rootDir } from "./rootDir"

Object.assign(console, log.functions)

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
let myWindow: BrowserWindow = null!
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
let tray: Tray = null!

log.info(rootDir, dataDir)
log.info("appPath", app.getAppPath())

async function main2() {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        app.on("second-instance", (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (myWindow) {
                if (myWindow.isMinimized()) {
                    myWindow.restore()
                }
                myWindow.focus()
            }
        })

        await app.whenReady()
        let quitting = false
        app.on("before-quit", () => {
            console.log("before-quit")
            quitting = true
        })

        app.dock?.hide()

        tray = new Tray(path.join(rootDir, "client/dist/img/clapperboard-16x16.png"))
        // tray.on("right-click", toggleWindow)
        // tray.on("double-click", toggleWindow)
        tray.on("click", showWindow)

        myWindow = new BrowserWindow({
            width: 300,
            height: 300,
            show: false,
            frame: true,
            fullscreenable: false,
        })

        myWindow.loadURL("http://localhost:7777/tray")

        myWindow.once("ready-to-show", () => {
            const position = getWindowPosition()
            console.log(position, myWindow.getPosition())
            // myWindow.setPosition(position.x, position.y, false)
        })
        myWindow.on("close", e => {
            if (quitting) {
                return
            }
            e.preventDefault()
            myWindow.hide()
            // const position = getWindowPosition()
            // console.log(position, myWindow.getPosition())
            // myWindow.setPosition(position.x, position.y, false)
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
// const toggleWindow = () => {
//     if (myWindow.isVisible()) {
//         myWindow.hide()
//     } else {
//         showWindow()
//     }
// }

const showWindow = () => {
    const position = getWindowPosition()
    console.log(position, myWindow.getPosition())
    // myWindow.setPosition(position.x, position.y, false)
    myWindow.show()
    myWindow.focus()
}

main2()
