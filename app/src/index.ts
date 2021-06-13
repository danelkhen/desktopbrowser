import { app, ipcRenderer } from "electron"

async function main() {
    console.log("load")
    document.body.querySelector("#inspect")?.addEventListener("click", () => ipcRenderer.invoke("main", "inspect"))
    document.body.querySelector("#open")?.addEventListener("click", () => ipcRenderer.invoke("main", "open"))
    document.body.querySelector("#exit")?.addEventListener("click", () => ipcRenderer.invoke("main", "exit"))
    document.body.querySelector("#checkForUpdates")?.addEventListener("click", async () => {
        const res = await ipcRenderer.invoke("main", "checkForUpdates")
        ;(document.body.querySelector("#status") as HTMLElement).innerText = res.isLatest
            ? "you have the latest version"
            : `there's a newer version ${res.latest}`
    })
    ;(document.body.querySelector("#version") as HTMLElement).innerText = await ipcRenderer.invoke("main", "getVersion")
}
document.addEventListener("DOMContentLoaded", main)
