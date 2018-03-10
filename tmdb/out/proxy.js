"use strict";
var Proxy = (function () {
    function Proxy() {
        this.onInvoke = function (pc) { return Promise.resolve(null); };
    }
    Proxy.prototype.invoke = function (action) {
        var pc = extractInstanceFunctionCall(action);
        return this.onInvoke(pc);
    };
    return Proxy;
}());
exports.Proxy = Proxy;
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
exports.extractInstanceFunctionCall = extractInstanceFunctionCall;
