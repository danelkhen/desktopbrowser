import { Invoker } from "./Proxy_"
import { getHttpInvoker } from "./getHttpInvoker"

export function httpProxyFor<T>(url: string, impl: (http: Invoker<T>) => T) {
    const http = getHttpInvoker<T>(url)
    return impl(http)
}
