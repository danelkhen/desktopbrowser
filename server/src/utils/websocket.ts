import * as http from "http"
import * as https from "https"
import * as ws from "ws"
import { objectTryGet } from "./objectTryGet"
import { extractFunctionCall } from "./ProxyCall"

export function setupWebsockets<T>(server: http.Server | https.Server, services: T) {
    console.log("setupWebsockets")
    const wss = new ws.Server({ path: "/api", server })

    wss.on("connection", (ws, req) => {
        console.log("wss.onconnection", req.url)
        ws.on("message", async message => {
            try {
                const data = String(message)
                console.log("ws.message received: %s", message)
                const pc = extractFunctionCall(data)
                const target = objectTryGet(services, pc.target)
                const res = await target[pc.funcName](...pc.args)
                if (isIterable(res)) {
                    console.log("sending iterable!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for (const item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else if (isAsyncIterable(res)) {
                    console.log("sending async iterable!!!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for await (const item of res) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIterable(obj: any): obj is Iterable<unknown> {
    if (obj == null) return false
    return typeof obj[Symbol.iterator] === "function"
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAsyncIterable(obj: any): obj is AsyncIterable<unknown> {
    if (obj == null) return false
    return typeof obj[Symbol.asyncIterator] === "function"
}
