/* eslint-disable no-empty */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { iterateDomEvent } from "./iterateEvent"
import { Invoker } from "./Proxy"
import ReconnectingWebSocket from "reconnecting-websocket"

let webSocket: ReconnectingWebSocket

main()
export function main() {
    const url = new URL(location.href)
    url.search = ""
    url.protocol = "ws:"
    url.pathname = "/api"
    webSocket = new ReconnectingWebSocket(url.toString(), ["protocolOne", "protocolTwo"])
}

export interface InvokeInfo {
    target: string[]
    funcName: string
    args: any[]
}
export function getWebSocketInvoker<T>(...target: string[]): Invoker<T> {
    return (method, ...prms) => {
        return invoke({ target, funcName: method, args: prms }) as any
    }
}
export async function invoke<T>(pc: InvokeInfo): Promise<T> {
    for await (const res of invokeStreaming(pc)) return res as any
    return undefined!
}

export async function* invokeStreaming<T>(pc: InvokeInfo): AsyncIterableIterator<T> {
    // let pc = extractInstanceFunctionCall2(func)
    console.log(pc)
    const cmd = `${pc!.target.join(".")}.${pc!.funcName}(${pc!.args!.map(t => JSON.stringify(t)).join(",")})`
    const events = send(cmd)
    for await (const data of events) {
        if (0) {
        } else if (data.startsWith("ERROR: ")) {
            const json = data.substring("ERROR ".length)
            if (json.length > 0) {
                // TODO: const x = JSON.parse(json)
            }
            throw new Error(data)
        } else if (data == "[") {
        } else if (data.endsWith(",")) {
            const item = JSON.parse(data.substr(0, data.length - 1))
            yield item
        } else if (data == "]") {
            break
        } else {
            const item = JSON.parse(data) as T
            yield item
        }
    }
}

export async function* send(cmd: string): AsyncIterableIterator<string> {
    webSocket.send(cmd)
    const events = iterateDomEvent<MessageEvent>(webSocket as any, "message") // TODO:
    let iterable: boolean | null = null
    for await (const e of events) {
        const data = e.data
        if (data == "[") {
            if (iterable != null) throw new Error()
            iterable = true
            yield data
        } else if (data.endsWith(",")) {
            if (iterable !== true) throw new Error()
            yield data
        } else if (data == "]") {
            if (iterable !== true) throw new Error()
            yield data
            break
        } else if (data.startsWith == "ERROR: ") {
            const err = JSON.parse(data.substr("ERROR: ".length))
            throw new Error(err.message || err)
        } else {
            if (iterable === true) throw new Error()
            yield data
            break
        }
    }
}
