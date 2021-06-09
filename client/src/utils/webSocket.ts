import { iterateDomEvent } from "./iterateEvent"
import { Invoker } from "./Proxy"
import ReconnectingWebSocket from "reconnecting-websocket"

let webSocket: ReconnectingWebSocket

main()
export function main() {
    let url = location.href.replace(/^https|http/, "ws")
    url = url.replace(/\?.*$/, "")
    webSocket = new ReconnectingWebSocket(url + "api", ["protocolOne", "protocolTwo"])
    // webSocket.open()
    // webSocket.addEventListener("message", e => {
    //     // console.log(e.data);
    // })
    // Connection opened
    // webSocket.addEventListener("open", e => {
    //     console.log("websocket open")
    //     //socket.send('Hello Server!');
    // })
}

//TODO:
//export function invoke2<T>(func: (server: App) => AsyncIterableIterator<T>): AsyncIterableIterator<T>
//export function invoke2<T>(func: (server: App) => T): Promise<T> {
//}

export interface InvokeInfo {
    target: string[]
    funcName: string
    args: any[]
}
export function getWebSocketInvoker<T>(...target: string[]): Invoker<T> {
    return (method, prms) => {
        return invoke({ target, funcName: method, args: prms as any }) as any
    }
}
export async function invoke<T>(pc: InvokeInfo): Promise<T> {
    for await (let res of invokeStreaming(pc)) return res as any
    return undefined!
}

export async function* invokeStreaming<T>(pc: InvokeInfo): AsyncIterableIterator<T> {
    // let pc = extractInstanceFunctionCall2(func)
    console.log(pc)
    let cmd = `${pc!.target.join(".")}.${pc!.funcName}(${pc!.args!.map(t => JSON.stringify(t)).join(",")})`
    let events = send(cmd)
    for await (let data of events) {
        if (0) {
        } else if (data.startsWith("ERROR: ")) {
            let json = data.substr("ERROR ".length)
            if (json.length > 0) {
                let x = JSON.parse(json)
            }
            throw new Error(data)
        } else if (data == "[") {
        } else if (data.endsWith(",")) {
            let item = JSON.parse(data.substr(0, data.length - 1))
            yield item
        } else if (data == "]") {
            break
        } else {
            let item = JSON.parse(data) as T
            yield item
        }
    }
}

export async function* send(cmd: string): AsyncIterableIterator<string> {
    webSocket.send(cmd)
    let events = iterateDomEvent<MessageEvent>(webSocket as any, "message") // TODO:
    let iterable: boolean | null = null
    for await (const e of events) {
        let data = e.data
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
            let err = JSON.parse(data.substr("ERROR: ".length))
            throw new Error(err.message || err)
        } else {
            if (iterable === true) throw new Error()
            yield data
            break
        }
    }
}

//export async function test() {
//    let res = send2(t => t.testAsyncIterable());
//    for await (let item of res) {
//        console.log(item);
//    }
//}