import { getWebSocketInvoker } from "../utils/webSocket"
import { Invoker } from "./Proxy_"

export function wsProxyFor<T>(url: string, impl: (ws: Invoker<T>) => T) {
    const ws = getWebSocketInvoker<T>(url)
    return impl(ws)
}
