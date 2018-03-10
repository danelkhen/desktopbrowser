"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function xhr(opts) {
    return new Promise(function (resolve, reject) {
        var url = opts.url;
        var method = opts.method || "GET";
        var body = opts.body;
        var remaining = {};
        if (opts.params != null) {
            var interpolated = interpolateUrl(url, opts.params);
            var query = toQueryString(interpolated.remaining);
            url = interpolated.url;
            if (query.length > 0)
                url += "?" + query;
        }
        var xhr = new XMLHttpRequest();
        opts.xhr = xhr;
        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 4) {
                var res = null;
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
            Object.keys(opts.headers).forEach(function (key) { return xhr.setRequestHeader(key, opts.headers[key]); });
        }
        xhr.send(body);
    });
}
exports.xhr = xhr;
function interpolateUrl(url, params) {
    var remaining = {};
    Object.keys(params).forEach(function (key) {
        var placeholder = "{" + key + "}";
        if (url.indexOf(placeholder) >= 0) {
            url = url.replace(placeholder, encodeURIComponent(params[key]));
        }
        else {
            remaining[key] = params[key];
        }
    });
    return { url: url, remaining: remaining };
}
exports.interpolateUrl = interpolateUrl;
function toQueryString(params) {
    var query = Object.keys(params).map(function (key) { return key + "=" + encodeURIComponent(params[key]); }).join("&");
    return query;
}
exports.toQueryString = toQueryString;
//# sourceMappingURL=xhr.js.map