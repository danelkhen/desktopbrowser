import { Invoker } from "./Proxy"
import { getHttpInvoker } from "./ServiceBase"

export function httpProxyFor<T>(url: string, impl: (http: Invoker<T>) => T) {
    const http = getHttpInvoker<T>(url)
    return impl(http)
}
