"use strict";
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
                    for await (let item of res) {
                        ws.send(JSON.stringify(item) + ",");
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
