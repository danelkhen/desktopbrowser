import { shell } from "electron"
function main() {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("load")
        const a = document.body.querySelector("#open") as HTMLLinkElement
        a.addEventListener("click", e => {
            console.log("click", e)
            // e.preventDefault()
            shell.openExternal("http://localhost:7777")
        })
    })
}
main()
