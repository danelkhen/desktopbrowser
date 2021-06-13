import { Invoker } from "./Proxy"

async function httpInvoke(baseURL: string, action: string, prms?: any): Promise<any> {
    const req: RequestInit = {
        method: "GET",
    }
    const url = baseURL + "/" + action
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
    return (method, prms) => httpInvoke(url, method, prms?.[0]) as any
}
