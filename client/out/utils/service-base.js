"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_1 = require("./proxy");
class ServiceBase extends proxy_1.Proxy {
    constructor() {
        super();
        this.onInvoke = pc => this.Invoke(pc.name, pc.args[0]);
    }
    isQueryStringable(x) {
        return x == null || typeof (x) == "string";
    }
    Invoke(action, prms) {
        let method = "GET";
        let contentType = null;
        let data = null;
        if (prms != null) {
            let json = JSON.stringify(prms);
            if (json.length > 1000) {
                method = "POST";
                contentType = "application/json";
                data = json;
            }
            else {
                data = { p: json };
            }
        }
        return new Promise((resolve, reject) => {
            var xhr = jQuery.ajax({
                contentType,
                method,
                url: this.Url + "/" + action,
                data: data,
                complete: (a, b) => resolve(a.responseJSON),
            });
        });
    }
}
exports.ServiceBase = ServiceBase;
//# sourceMappingURL=service-base.js.map