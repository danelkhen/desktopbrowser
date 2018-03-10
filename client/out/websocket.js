"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var event_1 = require("./event");
var proxy_1 = require("./utils/proxy");
var webSocket;
main();
function main() {
    var url = location.href.replace(/^https|http/, "ws");
    url = url.replace(/\?.*$/, "");
    webSocket = new WebSocket(url, ["protocolOne", "protocolTwo"]);
    webSocket.addEventListener("message", function (e) {
        console.log(e.data);
    });
    webSocket.addEventListener('open', function (e) {
        console.log("websocket open");
    });
}
exports.main = main;
function invoke(func) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, res, e_1_1, e_1, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 6, 7, 12]);
                    _a = __asyncValues(invokeStreaming(func));
                    _d.label = 1;
                case 1: return [4, _a.next()];
                case 2:
                    if (!(_b = _d.sent(), !_b.done)) return [3, 5];
                    return [4, _b.value];
                case 3:
                    res = _d.sent();
                    return [2, res];
                case 4: return [3, 1];
                case 5: return [3, 12];
                case 6:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 12];
                case 7:
                    _d.trys.push([7, , 10, 11]);
                    if (!(_b && !_b.done && (_c = _a.return))) return [3, 9];
                    return [4, _c.call(_a)];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [3, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7];
                case 11: return [7];
                case 12: return [2];
            }
        });
    });
}
exports.invoke = invoke;
function invokeStreaming(func) {
    return __asyncGenerator(this, arguments, function invokeStreaming_1() {
        var pc, cmd, events, events_1, events_1_1, data, json, x, item, item, e_2_1, e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pc = proxy_1.extractInstanceFunctionCall2(func);
                    console.log(pc);
                    cmd = pc.target.join('.') + "." + pc.funcName + "(" + pc.args.map(function (t) { return JSON.stringify(t); }).join(",") + ")";
                    events = send(cmd);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 14, 15, 20]);
                    events_1 = __asyncValues(events);
                    _b.label = 2;
                case 2: return [4, __await(events_1.next())];
                case 3:
                    if (!(events_1_1 = _b.sent(), !events_1_1.done)) return [3, 13];
                    return [4, __await(events_1_1.value)];
                case 4:
                    data = _b.sent();
                    if (!0) return [3, 5];
                    return [3, 12];
                case 5:
                    if (!data.startsWith("ERROR: ")) return [3, 6];
                    json = data.substr("ERROR ".length);
                    if (json.length > 0) {
                        x = JSON.parse(json);
                    }
                    throw new Error(data);
                case 6:
                    if (!(data == "[")) return [3, 7];
                    return [3, 12];
                case 7:
                    if (!data.endsWith(",")) return [3, 9];
                    item = JSON.parse(data.substr(0, data.length - 1));
                    return [4, item];
                case 8:
                    _b.sent();
                    return [3, 12];
                case 9:
                    if (!(data == "]")) return [3, 10];
                    return [3, 13];
                case 10:
                    item = JSON.parse(data);
                    return [4, item];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12: return [3, 2];
                case 13: return [3, 20];
                case 14:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 20];
                case 15:
                    _b.trys.push([15, , 18, 19]);
                    if (!(events_1_1 && !events_1_1.done && (_a = events_1.return))) return [3, 17];
                    return [4, __await(_a.call(events_1))];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17: return [3, 19];
                case 18:
                    if (e_2) throw e_2.error;
                    return [7];
                case 19: return [7];
                case 20: return [2];
            }
        });
    });
}
exports.invokeStreaming = invokeStreaming;
function send(cmd) {
    return __asyncGenerator(this, arguments, function send_1() {
        var events, iterable, events_2, events_2_1, e, data, err, e_3_1, e_3, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    webSocket.send(cmd);
                    events = event_1.iterateDomEvent(webSocket, "message");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 15, 16, 21]);
                    events_2 = __asyncValues(events);
                    _b.label = 2;
                case 2: return [4, __await(events_2.next())];
                case 3:
                    if (!(events_2_1 = _b.sent(), !events_2_1.done)) return [3, 14];
                    return [4, __await(events_2_1.value)];
                case 4:
                    e = _b.sent();
                    data = e.data;
                    if (!(data == "[")) return [3, 6];
                    if (iterable != null)
                        throw new Error();
                    iterable = true;
                    return [4, data];
                case 5:
                    _b.sent();
                    return [3, 13];
                case 6:
                    if (!data.endsWith(",")) return [3, 8];
                    if (iterable !== true)
                        throw new Error();
                    return [4, data];
                case 7:
                    _b.sent();
                    return [3, 13];
                case 8:
                    if (!(data == "]")) return [3, 10];
                    if (iterable !== true)
                        throw new Error();
                    return [4, data];
                case 9:
                    _b.sent();
                    return [3, 14];
                case 10:
                    if (!(data.startsWith == "ERROR: ")) return [3, 11];
                    err = JSON.parse(data.substr("ERROR: ".length));
                    throw new Error(err.message || err);
                case 11:
                    if (iterable === true)
                        throw new Error();
                    return [4, data];
                case 12:
                    _b.sent();
                    return [3, 14];
                case 13: return [3, 2];
                case 14: return [3, 21];
                case 15:
                    e_3_1 = _b.sent();
                    e_3 = { error: e_3_1 };
                    return [3, 21];
                case 16:
                    _b.trys.push([16, , 19, 20]);
                    if (!(events_2_1 && !events_2_1.done && (_a = events_2.return))) return [3, 18];
                    return [4, __await(_a.call(events_2))];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18: return [3, 20];
                case 19:
                    if (e_3) throw e_3.error;
                    return [7];
                case 20: return [7];
                case 21: return [2];
            }
        });
    });
}
exports.send = send;
//# sourceMappingURL=websocket.js.map