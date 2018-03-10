"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
var ServiceBase = (function (_super) {
    __extends(ServiceBase, _super);
    function ServiceBase() {
        var _this = _super.call(this) || this;
        _this.onInvoke = function (pc) { return _this.Invoke(pc.name, pc.args[0]); };
        return _this;
    }
    ServiceBase.prototype.isQueryStringable = function (x) {
        return x == null || typeof (x) == "string";
    };
    ServiceBase.prototype.Invoke = function (action, prms) {
        var _this = this;
        var method = "GET";
        var contentType = null;
        var data = null;
        if (prms != null) {
            var json = JSON.stringify(prms);
            if (json.length > 1000) {
                method = "POST";
                contentType = "application/json";
                data = json;
            }
            else {
                data = { p: json };
            }
        }
        return new Promise(function (resolve, reject) {
            var xhr = jQuery.ajax({
                contentType: contentType,
                method: method,
                url: _this.Url + "/" + action,
                data: data,
                complete: function (a, b) { return resolve(a.responseJSON); },
            });
        });
    };
    return ServiceBase;
}(proxy_1.Proxy));
exports.ServiceBase = ServiceBase;
//# sourceMappingURL=service-base.js.map