"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebsockets = void 0;
const ws = __importStar(require("ws"));
const utils_1 = require("./utils");
const ProxyCall_1 = require("./utils/ProxyCall");
function setupWebsockets(server, app) {
    console.log("setupWebsockets");
    const wss = new ws.Server({ server });
    wss.on("connection", (ws, req) => {
        console.log("wss.onconnection", req.url);
        ws.on("message", async (message) => {
            var e_1, _a;
            try {
                let data = String(message);
                console.log("ws.message received: %s", message);
                let pc = ProxyCall_1.extractFunctionCall(data);
                let target = utils_1.objectTryGet(app, pc.target);
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
                            let item = res_1_1.value;
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
        });
        ws.on("error", e => console.log("ws.error", e));
    });
}
exports.setupWebsockets = setupWebsockets;
function isIterable(obj) {
    if (obj == null)
        return false;
    return typeof obj[Symbol.iterator] === "function";
}
function isAsyncIterable(obj) {
    if (obj == null)
        return false;
    return typeof obj[Symbol.asyncIterator] === "function";
}
