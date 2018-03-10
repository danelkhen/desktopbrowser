"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function extractFunctionCall(code) {
    let parsed = parseFunctionCall(code);
    let target = parsed.target;
    let args = JSON.parse("[" + parsed.args + "]");
    let funcName = parsed.funcName;
    let res = { target, funcName, args };
    return res;
}
exports.extractFunctionCall = extractFunctionCall;
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
