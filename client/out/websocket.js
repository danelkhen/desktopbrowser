"use strict";
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("./event");
const proxy_1 = require("./utils/proxy");
let webSocket;
main();
function main() {
    let url = location.href.replace(/^https|http/, "ws");
    url = url.replace(/\?.*$/, "");
    webSocket = new WebSocket(url, ["protocolOne", "protocolTwo"]);
    webSocket.addEventListener("message", e => {
        console.log(e.data);
    });
    webSocket.addEventListener('open', e => {
        console.log("websocket open");
    });
}
exports.main = main;
async function invoke(func) {
    try {
        for (var _a = __asyncValues(invokeStreaming(func)), _b; _b = await _a.next(), !_b.done;) {
            let res = await _b.value;
            return res;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) await _c.call(_a);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var e_1, _c;
}
exports.invoke = invoke;
function invokeStreaming(func) {
    return __asyncGenerator(this, arguments, function* invokeStreaming_1() {
        let pc = proxy_1.extractInstanceFunctionCall2(func);
        console.log(pc);
        let cmd = `${pc.target.join('.')}.${pc.funcName}(${pc.args.map(t => JSON.stringify(t)).join(",")})`;
        let events = send(cmd);
        try {
            for (var events_1 = __asyncValues(events), events_1_1; events_1_1 = yield __await(events_1.next()), !events_1_1.done;) {
                let data = yield __await(events_1_1.value);
                if (0) { }
                else if (data.startsWith("ERROR: ")) {
                    let json = data.substr("ERROR ".length);
                    if (json.length > 0) {
                        let x = JSON.parse(json);
                    }
                    throw new Error(data);
                }
                else if (data == "[") {
                }
                else if (data.endsWith(",")) {
                    let item = JSON.parse(data.substr(0, data.length - 1));
                    yield item;
                }
                else if (data == "]") {
                    break;
                }
                else {
                    let item = JSON.parse(data);
                    yield item;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (events_1_1 && !events_1_1.done && (_a = events_1.return)) yield __await(_a.call(events_1));
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _a;
    });
}
exports.invokeStreaming = invokeStreaming;
function send(cmd) {
    return __asyncGenerator(this, arguments, function* send_1() {
        webSocket.send(cmd);
        let events = event_1.iterateDomEvent(webSocket, "message");
        let iterable;
        try {
            for (var events_2 = __asyncValues(events), events_2_1; events_2_1 = yield __await(events_2.next()), !events_2_1.done;) {
                let e = yield __await(events_2_1.value);
                let data = e.data;
                if (data == "[") {
                    if (iterable != null)
                        throw new Error();
                    iterable = true;
                    yield data;
                }
                else if (data.endsWith(",")) {
                    if (iterable !== true)
                        throw new Error();
                    yield data;
                }
                else if (data == "]") {
                    if (iterable !== true)
                        throw new Error();
                    yield data;
                    break;
                }
                else if (data.startsWith == "ERROR: ") {
                    let err = JSON.parse(data.substr("ERROR: ".length));
                    throw new Error(err.message || err);
                }
                else {
                    if (iterable === true)
                        throw new Error();
                    yield data;
                    break;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (events_2_1 && !events_2_1.done && (_a = events_2.return)) yield __await(_a.call(events_2));
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _a;
    });
}
exports.send = send;
//# sourceMappingURL=websocket.js.map