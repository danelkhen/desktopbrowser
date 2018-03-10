System.register("api2", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("proxy", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function extractInstanceFunctionCall(func) {
        var code = func.toString();
        var index = code.indexOf(".");
        var index2 = code.indexOf("(", index);
        var res = {
            name: code.substring(index + 1, index2),
            args: null,
        };
        var fake = {};
        fake[res.name] = function () {
            res.args = Array.from(arguments);
        };
        func(fake);
        if (res.args == null)
            res.args = [];
        return res;
    }
    exports_2("extractInstanceFunctionCall", extractInstanceFunctionCall);
    var Proxy;
    return {
        setters: [],
        execute: function () {
            Proxy = (function () {
                function Proxy() {
                }
                Proxy.prototype.invoke = function (action) {
                    var pc = extractInstanceFunctionCall(action);
                    return this.onInvoke(pc);
                };
                Proxy.prototype.onInvoke = function (pc) {
                    return Promise.resolve(null);
                };
                return Proxy;
            }());
            exports_2("Proxy", Proxy);
        }
    };
});
System.register("test", ["proxy"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var proxy_1, x;
    return {
        setters: [
            function (proxy_1_1) {
                proxy_1 = proxy_1_1;
            }
        ],
        execute: function () {
            x = new proxy_1.Proxy();
            x.onInvoke = function (pc) {
                console.log(pc);
                return Promise.resolve();
            };
            x.invoke(function (t) { return t.getMovieLatest(); });
        }
    };
});
