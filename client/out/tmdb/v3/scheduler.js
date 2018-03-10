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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils/utils");
var TmdbScheduler = (function () {
    function TmdbScheduler(owner) {
        this.owner = owner;
        this.queue = [];
    }
    TmdbScheduler.prototype.enqueueXhrRequest = function (pc) {
        var _this = this;
        var task = this.queue.find(function (t) {
            var pc2 = t.data;
            if (pc.name != pc2.name)
                return false;
            if (pc.args.length != pc2.args.length)
                return false;
            if (JSON.stringify(pc.args) != JSON.stringify(pc2.args))
                return false;
            return true;
        });
        if (task != null) {
            console.log("found similar ProxyCall, reusing", task, pc);
            return task.toPromise();
        }
        task = new SingleTask(new ActionDataTask(pc, function (t) { return _this.owner.executeProxyCall(t); }));
        task.data = pc;
        this.queue.push(task);
        this.scheduleProcessQueue();
        return task.toPromise();
    };
    TmdbScheduler.prototype.scheduleProcessQueue = function (delay) {
        if (delay === void 0) { delay = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isScheduled)
                            return [2];
                        this.isScheduled = true;
                        return [4, utils_1.promiseSetTimeout(delay)];
                    case 1:
                        _a.sent();
                        this.isScheduled = false;
                        this.processQueue();
                        return [2];
                }
            });
        });
    };
    TmdbScheduler.prototype.processQueue = function () {
        this._processQueue();
    };
    TmdbScheduler.prototype._processQueue = function () {
        for (var i = 0; i < 10; i++) {
            if (this.queue.length == 0)
                return;
            this.queue.removeAll(function (t) { return t.started != null && t.ended != null; });
            if (this.queue.length == 0)
                return;
            if (this.queue.filter(function (t) { return !t.started; }).length == 0)
                return;
            var tto = this.getTimeToWait();
            if (tto > 0) {
                console.log("time to wait", tto);
                this.scheduleProcessQueue(tto);
                return;
            }
            if (this.queue.filter(function (t) { return t.started != null && t.ended == null; }).length > 10)
                return;
            var task = this.queue.first(function (t) { return !t.started; });
            if (task == null)
                return;
            task.execute();
        }
        this.scheduleProcessQueue(100);
    };
    TmdbScheduler.prototype.getTimeToWait = function () {
        if (this.owner.rateLimit == null || this.owner.rateLimit.remaining > 10)
            return 0;
        var endTime = this.owner.rateLimit.reset * 1000;
        var now = new Date().valueOf();
        var diff = endTime - now;
        return diff;
    };
    TmdbScheduler.prototype.waitUntilNextResetIfNeeded = function () {
        var diff = this.getTimeToWait();
        if (diff <= 0)
            return Promise.resolve();
        return utils_1.promiseSetTimeout(diff);
    };
    return TmdbScheduler;
}());
exports.TmdbScheduler = TmdbScheduler;
var ActionTask = (function () {
    function ActionTask(action) {
        this.action = action;
    }
    ActionTask.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.started = new Date();
                        return [4, this.action()];
                    case 1:
                        res = _a.sent();
                        this.ended = new Date();
                        return [2, res];
                }
            });
        });
    };
    return ActionTask;
}());
exports.ActionTask = ActionTask;
var ActionDataTask = (function () {
    function ActionDataTask(data, action) {
        this.data = data;
        this.action = action;
    }
    ActionDataTask.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.started = new Date();
                        return [4, this.action(this.data)];
                    case 1:
                        res = _a.sent();
                        this.ended = new Date();
                        return [2, res];
                }
            });
        });
    };
    return ActionDataTask;
}());
exports.ActionDataTask = ActionDataTask;
var SingleTask = (function () {
    function SingleTask(task) {
        this.task = task;
    }
    Object.defineProperty(SingleTask.prototype, "started", {
        get: function () { return this.task.started; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleTask.prototype, "ended", {
        get: function () { return this.task.ended; },
        enumerable: true,
        configurable: true
    });
    SingleTask.prototype.execute = function () {
        if (this.resultPromise != null)
            return this.resultPromise;
        this.resultPromise = this.task.execute();
        if (this.resolve != null)
            this.resolve(this.resultPromise);
        return this.resultPromise;
    };
    SingleTask.prototype.toPromise = function () {
        var _this = this;
        if (this.resultPromise != null)
            return this.resultPromise;
        if (this.promise != null)
            return this.promise;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        return this.promise;
    };
    return SingleTask;
}());
exports.SingleTask = SingleTask;
//# sourceMappingURL=scheduler.js.map