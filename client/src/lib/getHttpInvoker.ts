/* eslint-disable @typescript-eslint/no-explicit-any */
import { Invoker } from "./Proxy"

async function httpInvoke(url: string, prms?: any): Promise<any> {
    const req: RequestInit = {
        method: "GET",
    }
    if (prms != null) {
        const json = JSON.stringify(prms)
        req.method = "POST"
        req.headers = { "Content-Type": "application/json" }
        req.body = json
    }
    const res = await fetch(url, req)
    const resObj = await res.json()
    return resObj
}
export function getHttpInvoker<T>(url: string): Invoker<T> {
    return (method, ...prms) => httpInvoke(`${url}/${method}`, prms[0]) as any
}
