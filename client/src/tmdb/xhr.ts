import * as XMLHttpRequest from "xhr2"


export function xhr<T>(opts: XhrRequest): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let url = opts.url;
        let method = opts.method || "GET";
        let remaining = {};
        if (opts.params != null && method == "GET") {
            let interpolated = interpolateUrl(url, opts.params);
            let query = toQueryString(interpolated.remaining);
            url = interpolated.url;
            url += "?" + query;
        }
        console.log({ url });
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", e => {
            if (xhr.readyState == 4)
                resolve(JSON.parse(xhr.responseText));
        });
        xhr.open("GET", url);
        xhr.send();
    });
}


export interface XhrRequest {
    url?: string;
    queryParams?: any;
    params?: any;
    method?: string;
}


export function interpolateUrl(url: string, params: any): { url: string, remaining: any } {
    let remaining = {};
    Object.keys(params).forEach(key => {
        let placeholder = "{" + key + "}";
        if (url.indexOf(placeholder) >= 0) {
            url = url.replace(placeholder, encodeURIComponent(params[key]));
        }
        else {
            remaining[key] = params[key];
        }
    });
    return { url, remaining };
}

export function toQueryString(params: any): string {
    let query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join("&");
    return query;
}

