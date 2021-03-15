export function xhr(opts: XhrRequest): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let url = opts.url
        let body = opts.body
        if (opts.params != null) {
            let interpolated = interpolateUrl(url!, opts.params)
            let query = toQueryString(interpolated.remaining)
            url = interpolated.url
            if (query.length > 0) url += "?" + query
        }
        let xhr = new XMLHttpRequest()
        opts.xhr = xhr
        xhr.addEventListener("readystatechange", e => {
            if (xhr.readyState == 4) {
                let res = null
                if (xhr.responseText.length > 0) res = JSON.parse(xhr.responseText)
                if (xhr.status >= 200 && xhr.status < 300) resolve(res)
                else {
                    //console.log(xhr.status);
                    reject(res)
                }
            }
        })
        xhr.open(opts.method || "GET", url!)
        if (opts.headers != null) {
            Object.keys(opts.headers).forEach(key => xhr.setRequestHeader(key, opts.headers![key]))
        }
        xhr.send(body)
    })
}

export interface XhrRequest {
    url?: string
    queryParams?: any
    params?: any
    method?: string
    xhr?: XMLHttpRequest
    headers?: { [key: string]: string }
    body?: any
}

export function interpolateUrl(url: string, params: any): { url: string; remaining: any } {
    let remaining = {}
    Object.keys(params).forEach(key => {
        let placeholder = "{" + key + "}"
        if (url.indexOf(placeholder) >= 0) {
            url = url.replace(placeholder, encodeURIComponent(params[key]))
        } else {
            ;(remaining as any)[key] = params[key]
        }
    })
    return { url, remaining }
}

export function toQueryString(params: any): string {
    let query = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join("&")
    return query
}
