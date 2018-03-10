"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Name {
    static of() {
        return nameof;
    }
}
exports.Name = Name;
function nameof(prop) {
    let prop2 = prop;
    let code;
    if (prop2.isDelegate)
        code = prop2.func.toString();
    else
        code = prop.toString();
    let res = /\.([a-zA-Z_][a-zA-Z0-9_]*)/.exec(code);
    let name = res[1];
    console.log({ code, name });
    return name;
}
exports.nameof = nameof;
function promiseEach(list, handler) {
    return promiseMap(list, handler);
}
exports.promiseEach = promiseEach;
function promiseMap(list, handler) {
    let res = [];
    let promise = Promise.resolve();
    list.forEach((obj, i) => promise = promise.then(() => handler(obj, i)).then(e => { res.push(e); }));
    return promise.then(() => res);
}
exports.promiseMap = promiseMap;
function arrayDistinctBy(list, selector) {
    let pairs = list.map(t => [selector(t), t]);
    let map = new Map(pairs);
    let list2 = Array.from(map.values());
    return list2;
}
exports.arrayDistinctBy = arrayDistinctBy;
function tryParseInt(s) {
    let x = parseInt(s);
    if (isNaN(x))
        return null;
    return x;
}
exports.tryParseInt = tryParseInt;
function promiseSetTimeout(ms) {
    return new Promise((resolve, reject) => window.setTimeout(resolve, ms));
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
    let list = [];
    x.forEach(t => !y.has(t) && list.push(t));
    return new Set(list);
}
exports.setMinus = setMinus;
function setPlus(x, y) {
    return new Set([...Array.from(x), ...Array.from(y)]);
}
exports.setPlus = setPlus;
function setIntersect(x, y) {
    let list = [];
    x.forEach(t => x.has(t) && y.has(t) && list.push(t));
    return new Set(list);
}
exports.setIntersect = setIntersect;
function promiseReuseIfStillRunning(action) {
    let promise = null;
    return function () {
        console.log("promiseReuseIfStillRunning", { this: this });
        if (promise != null)
            return promise;
        promise = action.call(this).then((t) => { promise = null; return t; });
        return promise;
    };
}
exports.promiseReuseIfStillRunning = promiseReuseIfStillRunning;
function ReusePromiseIfStillRunning() {
    return function (target, propertyKey, descriptor) {
        let originalFuncKey = "_" + propertyKey + "_original";
        let promiseKey = "_" + propertyKey + "_promise";
        target[originalFuncKey] = descriptor.value;
        descriptor.value = new Function(`// generated code
if (this.${promiseKey} == null) {
    this.${promiseKey} = this.${originalFuncKey}().then(t => { 
        this.${promiseKey} = null; 
        return t;
    }, 
    err => {
        this.${promiseKey} = null; 
        return Promise.reject(err); 
    });
}
return this.${promiseKey};
`);
    };
}
exports.ReusePromiseIfStillRunning = ReusePromiseIfStillRunning;
function ReusePromise() {
    return function (target, propertyKey, descriptor) {
        let originalFuncKey = "_" + propertyKey + "_original";
        let promiseKey = "_" + propertyKey + "_promise";
        target[originalFuncKey] = descriptor.value;
        descriptor.value = new Function(`// generated code
if (this.${promiseKey} == null)
    this.${promiseKey} = this.${originalFuncKey}();
return this.${promiseKey};
`);
    };
}
exports.ReusePromise = ReusePromise;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || 0));
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map