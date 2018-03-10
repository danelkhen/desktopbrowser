"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Proxy {
    constructor() {
        this.onInvoke = pc => Promise.resolve(null);
    }
    invoke(action) {
        let pc = extractInstanceFunctionCall(action);
        return this.onInvoke(pc);
    }
}
exports.Proxy = Proxy;
function extractInstanceFunctionCall(func) {
    let code = func.toString();
    let index = code.indexOf(".");
    let index2 = code.indexOf("(", index);
    let res = {
        name: code.substring(index + 1, index2),
        args: null,
    };
    let fake = {};
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
    let code = func.toString();
    code = code.replace(/^\s*([a-zA-Z0-9_]+)\s*\=\>\s*\1\s*\.\s*/, "");
    let parsed = parseFunctionCall(code);
    let index = code.indexOf(".");
    let index2 = code.indexOf("(", index);
    let res = {
        funcName: parsed.funcName,
        target: parsed.target,
        args: null,
    };
    let fake = {};
    let lastTarget = fake;
    for (let target of parsed.target) {
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
    let match = /^([a-zA-Z0-9_\.]+)\((.*)\)$/.exec(code);
    console.log("extractFunctionCall", code);
    if (match != null)
        console.log("extractFunctionCall", match[0], match[1], match[2]);
    let target = match[1].split(".");
    let args = match[2];
    let funcName = target.pop();
    let res = { target, funcName, args };
    return res;
}
exports.parseFunctionCall = parseFunctionCall;
//# sourceMappingURL=proxy.js.map