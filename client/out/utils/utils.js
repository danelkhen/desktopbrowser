"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Name = (function () {
    function Name() {
    }
    Name.of = function () {
        return nameof;
    };
    return Name;
}());
exports.Name = Name;
function nameof(prop) {
    var prop2 = prop;
    var code;
    if (prop2.isDelegate)
        code = prop2.func.toString();
    else
        code = prop.toString();
    var res = /\.([a-zA-Z_][a-zA-Z0-9_]*)/.exec(code);
    var name = res[1];
    console.log({ code: code, name: name });
    return name;
}
exports.nameof = nameof;
function promiseEach(list, handler) {
    return promiseMap(list, handler);
}
exports.promiseEach = promiseEach;
function promiseMap(list, handler) {
    var res = [];
    var promise = Promise.resolve();
    list.forEach(function (obj, i) { return promise = promise.then(function () { return handler(obj, i); }).then(function (e) { res.push(e); }); });
    return promise.then(function () { return res; });
}
exports.promiseMap = promiseMap;
function arrayDistinctBy(list, selector) {
    var pairs = list.map(function (t) { return [selector(t), t]; });
    var map = new Map(pairs);
    var list2 = Array.from(map.values());
    return list2;
}
exports.arrayDistinctBy = arrayDistinctBy;
function tryParseInt(s) {
    var x = parseInt(s);
    if (isNaN(x))
        return null;
    return x;
}
exports.tryParseInt = tryParseInt;
function promiseSetTimeout(ms) {
    return new Promise(function (resolve, reject) { return window.setTimeout(resolve, ms); });
}
exports.promiseSetTimeout = promiseSetTimeout;
function promiseWhile(condition, action) {
    function loop() {
        if (!condition())
            return Promise.resolve();
        return action().then(loop);
    }
    return loop();
}
exports.promiseWhile = promiseWhile;
function setMinus(x, y) {
    var list = [];
    x.forEach(function (t) { return !y.has(t) && list.push(t); });
    return new Set(list);
}
exports.setMinus = setMinus;
function setPlus(x, y) {
    return new Set(Array.from(x).concat(Array.from(y)));
}
exports.setPlus = setPlus;
function setIntersect(x, y) {
    var list = [];
    x.forEach(function (t) { return x.has(t) && y.has(t) && list.push(t); });
    return new Set(list);
}
exports.setIntersect = setIntersect;
function promiseReuseIfStillRunning(action) {
    var promise = null;
    return function () {
        console.log("promiseReuseIfStillRunning", { this: this });
        if (promise != null)
            return promise;
        promise = action.call(this).then(function (t) { promise = null; return t; });
        return promise;
    };
}
exports.promiseReuseIfStillRunning = promiseReuseIfStillRunning;
function ReusePromiseIfStillRunning() {
    return function (target, propertyKey, descriptor) {
        var originalFuncKey = "_" + propertyKey + "_original";
        var promiseKey = "_" + propertyKey + "_promise";
        target[originalFuncKey] = descriptor.value;
        descriptor.value = new Function("// generated code\nif (this." + promiseKey + " == null) {\n    this." + promiseKey + " = this." + originalFuncKey + "().then(t => { \n        this." + promiseKey + " = null; \n        return t;\n    }, \n    err => {\n        this." + promiseKey + " = null; \n        return Promise.reject(err); \n    });\n}\nreturn this." + promiseKey + ";\n");
    };
}
exports.ReusePromiseIfStillRunning = ReusePromiseIfStillRunning;
function ReusePromise() {
    return function (target, propertyKey, descriptor) {
        var originalFuncKey = "_" + propertyKey + "_original";
        var promiseKey = "_" + propertyKey + "_promise";
        target[originalFuncKey] = descriptor.value;
        descriptor.value = new Function("// generated code\nif (this." + promiseKey + " == null)\n    this." + promiseKey + " = this." + originalFuncKey + "();\nreturn this." + promiseKey + ";\n");
    };
}
exports.ReusePromise = ReusePromise;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms || 0); });
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map