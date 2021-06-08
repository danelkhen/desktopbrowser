import { ipcRenderer } from "electron"

function main() {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("load")
        document.body.querySelector("#open")?.addEventListener("click", () => ipcRenderer.invoke("main", "open"))
        document.body.querySelector("#exit")?.addEventListener("click", () => ipcRenderer.invoke("main", "exit"))
    })
}
main()
