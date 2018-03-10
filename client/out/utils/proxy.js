"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function extractInstanceFunctionCall2(func) {
    var code = func.toString();
    code = code.replace(/^\s*([a-zA-Z0-9_]+)\s*\=\>\s*\1\s*\.\s*/, "");
    var parsed = parseFunctionCall(code);
    var index = code.indexOf(".");
    var index2 = code.indexOf("(", index);
    var res = {
        funcName: parsed.funcName,
        target: parsed.target,
        args: null,
    };
    var fake = {};
    var lastTarget = fake;
    for (var _i = 0, _a = parsed.target; _i < _a.length; _i++) {
        var target = _a[_i];
        lastTarget = {};
        fake[target] = lastTarget;
    }
    lastTarget[parsed.funcName] = function () {
        res.args = Array.from(arguments);
    };
    func(fake);
    if (res.args == null)
        res.args = [];
    return res;
}
exports.extractInstanceFunctionCall2 = extractInstanceFunctionCall2;
function parseFunctionCall(code) {
    var match = /^.*return\s*(.*)\;.*$/.exec(code);
    if (match)
        code = match[1];
    match = /^([a-zA-Z0-9_\.]+)\((.*)\)$/.exec(code);
    console.log("extractFunctionCall", code);
    if (match != null)
        console.log("extractFunctionCall", match[0], match[1], match[2]);
    var target = match[1].split(".").slice(1);
    var args = match[2];
    var funcName = target.pop();
    var res = { target: target, funcName: funcName, args: args };
    return res;
}
exports.parseFunctionCall = parseFunctionCall;
//# sourceMappingURL=proxy.js.map