"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var md_1 = require("./md");
var proxy_1 = require("../../utils/proxy");
var utils_1 = require("../../utils/utils");
var xhr_1 = require("../../utils/xhr");
var scheduler_1 = require("./scheduler");
var TmdbV3Or4Proxy = (function (_super) {
    __extends(TmdbV3Or4Proxy, _super);
    function TmdbV3Or4Proxy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.base_url = 'https://api.themoviedb.org/3';
        _this.rateLimit = { limit: null, remaining: null, reset: null };
        return _this;
    }
    TmdbV3Or4Proxy.prototype.executeProxyCall = function (pc) {
        return __awaiter(this, void 0, void 0, function () {
            var md, path, prms, body, url, xhrReq, res, x, rl, resDate, now, diff, probablyCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        md = this.md[pc.name];
                        path = md.path;
                        prms = __assign({}, pc.args[0]);
                        if (this.api_key != null && prms.api_key == null)
                            prms.api_key = this.api_key;
                        body = null;
                        if (prms.body != null) {
                            body = JSON.stringify(prms.body);
                            delete prms.body;
                        }
                        url = this.base_url + path;
                        xhrReq = {
                            url: url,
                            params: prms,
                            method: md.method || "GET",
                            body: body,
                            headers: {},
                        };
                        if (body != null)
                            xhrReq.headers["Content-Type"] = "application/json;charset=utf-8";
                        if (this.access_token != null || this.read_access_token != null)
                            xhrReq.headers["Authorization"] = "Bearer " + (this.access_token || this.read_access_token);
                        return [4, xhr_1.xhr(xhrReq)];
                    case 1:
                        res = _a.sent();
                        x = xhrReq.xhr;
                        rl = {
                            limit: utils_1.tryParseInt(x.getResponseHeader("X-RateLimit-Limit")),
                            remaining: utils_1.tryParseInt(x.getResponseHeader("X-RateLimit-Remaining")),
                            reset: utils_1.tryParseInt(x.getResponseHeader("X-RateLimit-Reset")),
                        };
                        resDate = new Date(x.getResponseHeader("date"));
                        now = new Date();
                        diff = now.valueOf() - resDate.valueOf();
                        probablyCached = diff > (60 * 1000);
                        if (!probablyCached && TmdbHelper.rateLimitIsNewer(rl, this.rateLimit)) {
                            this.rateLimit = rl;
                        }
                        else {
                            console.log("probably cached response", rl, this.rateLimit, diff);
                        }
                        console.log({ name: pc.name, res: res, path: path, pc: pc, prms: prms, rateLimit: this.rateLimit });
                        return [2, res];
                }
            });
        });
    };
    return TmdbV3Or4Proxy;
}(proxy_1.Proxy));
exports.TmdbV3Or4Proxy = TmdbV3Or4Proxy;
var TmdbV3Proxy = (function (_super) {
    __extends(TmdbV3Proxy, _super);
    function TmdbV3Proxy() {
        var _this = _super.call(this) || this;
        _this.scheduler = new scheduler_1.TmdbScheduler(_this);
        _this.onInvoke = function (pc) { return _this.scheduler.enqueueXhrRequest(pc); };
        _this.md = md_1.TmdbApiMetadata;
        return _this;
    }
    TmdbV3Proxy.prototype.getNextPage = function (action, lastRes) {
        if (lastRes.total_pages <= lastRes.page)
            return Promise.resolve(null);
        var pc = proxy_1.extractInstanceFunctionCall(action);
        var pc2 = Q.copy(pc);
        var req = pc2.args[0];
        req.page = lastRes.page + 1;
        return this.onInvoke(pc2);
    };
    TmdbV3Proxy.prototype.getAllPages = function (action, pageAction) {
        return __awaiter(this, void 0, void 0, function () {
            var page1, rest, rest2, _loop_1, this_1, i, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.invoke(action)];
                    case 1:
                        page1 = _a.sent();
                        rest = [];
                        rest2 = new Array(page1.total_pages);
                        rest2[0] = page1;
                        _loop_1 = function (i) {
                            rest.push(this_1.getNextPage(action, { page: i - 1 }).then(function (e) { return rest2[i - 1] = e; }));
                        };
                        this_1 = this;
                        for (i = 2; i <= page1.total_pages; i++) {
                            _loop_1(i);
                        }
                        return [4, Promise.all(rest)];
                    case 2:
                        _a.sent();
                        results = rest2.selectMany(function (t) { return t.results; });
                        return [2, results];
                }
            });
        });
    };
    return TmdbV3Proxy;
}(TmdbV3Or4Proxy));
exports.TmdbV3Proxy = TmdbV3Proxy;
var TmdbHelper = (function () {
    function TmdbHelper() {
    }
    TmdbHelper.rateLimitIsNewer = function (x, y) {
        if (y == null)
            return true;
        if (x.limit == null || x.remaining == null || x.reset == null)
            return false;
        if (x.reset < y.reset)
            return false;
        if (x.reset > y.reset)
            return true;
        return x.remaining < y.remaining;
    };
    return TmdbHelper;
}());
exports.TmdbHelper = TmdbHelper;
//# sourceMappingURL=proxy.js.map