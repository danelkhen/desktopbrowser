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
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("../v3/proxy");
var md_1 = require("./md");
var scheduler_1 = require("../v3/scheduler");
var TmdbV4Proxy = (function (_super) {
    __extends(TmdbV4Proxy, _super);
    function TmdbV4Proxy() {
        var _this = _super.call(this) || this;
        _this.scheduler = new scheduler_1.TmdbScheduler(_this);
        _this.onInvoke = function (pc) { return _this.scheduler.enqueueXhrRequest(pc); };
        _this.base_url = 'https://api.themoviedb.org/4';
        _this.md = md_1.TmdbApiMetadata;
        return _this;
    }
    return TmdbV4Proxy;
}(proxy_1.TmdbV3Or4Proxy));
exports.TmdbV4Proxy = TmdbV4Proxy;
//# sourceMappingURL=proxy.js.map