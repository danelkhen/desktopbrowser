import * as http from "http"
import * as https from "https"
import * as ws from "ws"
import { FileService } from "../../shared/src/contracts"
import { objectTryGet } from "./utils/objectTryGet"
import { extractFunctionCall } from "./utils/ProxyCall"

export function setupWebsockets(server: http.Server | https.Server, services: { fileService: FileService }) {
    console.log("setupWebsockets")
    const wss = new ws.Server({ path: "/api", server })

    wss.on("connection", (ws, req) => {
        console.log("wss.onconnection", req.url)
        ws.on("message", async message => {
            try {
                let data = String(message)
                console.log("ws.message received: %s", message)
                let pc = extractFunctionCall(data)
                let target = objectTryGet(services, pc.target)
                let res = await target[pc.funcName](...pc.args)
                if (isIterable(res)) {
                    console.log("sending iterable!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for (let item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else if (isAsyncIterable(res)) {
                    console.log("sending async iterable!!!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for await (let item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else {
                    ws.send(JSON.stringify(res))
                }
            } catch (err) {
                console.log(err)
                ws.send("ERROR: " + JSON.stringify(err))
            }
        })
        ws.on("error", e => console.log("ws.error", e))
    })
}

function isIterable(obj: any): obj is Iterable<unknown> {
    if (obj == null) return false
    return typeof obj[Symbol.iterator] === "function"
}
function isAsyncIterable(obj: any): obj is AsyncIterable<unknown> {
    if (obj == null) return false
    return typeof obj[Symbol.asyncIterator] === "function"
}
