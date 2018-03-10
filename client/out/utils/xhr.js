"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function xhr(opts) {
    return new Promise((resolve, reject) => {
        let url = opts.url;
        let method = opts.method || "GET";
        let body = opts.body;
        let remaining = {};
        if (opts.params != null) {
            let interpolated = interpolateUrl(url, opts.params);
            let query = toQueryString(interpolated.remaining);
            url = interpolated.url;
            if (query.length > 0)
                url += "?" + query;
        }
        let xhr = new XMLHttpRequest();
        opts.xhr = xhr;
        xhr.addEventListener("readystatechange", e => {
            if (xhr.readyState == 4) {
                let res = null;
                if (xhr.responseText.length > 0)
                    res = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300)
                    resolve(res);
                else {
                    reject(res);
                }
            }
        });
        xhr.open(opts.method || "GET", url);
        if (opts.headers != null) {
            Object.keys(opts.headers).forEach(key => xhr.setRequestHeader(key, opts.headers[key]));
        }
        xhr.send(body);
    });
}
exports.xhr = xhr;
function interpolateUrl(url, params) {
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
exports.interpolateUrl = interpolateUrl;
function toQueryString(params) {
    let query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join("&");
    return query;
}
exports.toQueryString = toQueryString;
//# sourceMappingURL=xhr.js.map