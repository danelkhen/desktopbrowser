"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws = require("ws");
const proxy_1 = require("./utils/proxy");
const app_1 = require("./app");
function setupWebsockets(server) {
    console.log("setupWebsockets");
    const wss = new ws.Server({ server });
    wss.on('connection', (ws, req) => {
        console.log("wss.onconnection", req.url);
        ws.on('message', async (message) => {
            try {
                let data = String(message);
                console.log('ws.message received: %s', message);
                let pc = proxy_1.extractFunctionCall(data);
                let target = Object.tryGet(app_1.app, pc.target);
                let res = await target[pc.funcName](...pc.args);
                if (isIterable(res)) {
                    console.log("sending iterable!!!!!!!!!!!!!!!!");
                    ws.send("[");
                    for (let item of res) {
                        ws.send(JSON.stringify(item) + ",");
                    }
                    ws.send("]");
                }
                else if (isAsyncIterable(res)) {
                    console.log("sending async iterable!!!!!!!!!!!!!!!!!!");
                    ws.send("[");
                    try {
                        for (var res_1 = __asyncValues(res), res_1_1; res_1_1 = await res_1.next(), !res_1_1.done;) {
                            let item = await res_1_1.value;
                            ws.send(JSON.stringify(item) + ",");
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (res_1_1 && !res_1_1.done && (_a = res_1.return)) await _a.call(res_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    ws.send("]");
                }
                else {
                    ws.send(JSON.stringify(res));
                }
            }
            catch (err) {
                console.log(err);
                ws.send("ERROR: " + JSON.stringify(err));
            }
            var e_1, _a;
        });
        ws.on('error', e => console.log('ws.error', e));
    });
}
exports.setupWebsockets = setupWebsockets;
function isIterable(obj) {
    if (obj == null)
        return false;
    return typeof obj[Symbol.iterator] === 'function';
}
function isAsyncIterable(obj) {
    if (obj == null)
        return false;
    return typeof obj[Symbol.asyncIterator] === 'function';
}
