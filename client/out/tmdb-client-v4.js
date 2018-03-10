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
var client_1 = require("./tmdb/v4/client");
var TmdbClientV4 = (function (_super) {
    __extends(TmdbClientV4, _super);
    function TmdbClientV4() {
        var _this = _super.call(this) || this;
        _this.storage = localStorage;
        console.log("TmdbClient ctor");
        var base = _this.proxy.onInvoke;
        _this.proxy.onInvoke = function (pc) {
            if (_this.account_id != null) {
                var prm = pc.args[0];
                if (prm == null) {
                    prm = {};
                    pc.args[0] = prm;
                }
                if (prm.account_id == null && _this.account_id != null)
                    prm.account_id = _this.account_id;
            }
            return base(pc);
        };
        return _this;
    }
    TmdbClientV4.prototype.init = function () {
        return Promise.resolve();
    };
    TmdbClientV4.prototype.onLogin = function () {
        return Promise.resolve();
    };
    Object.defineProperty(TmdbClientV4.prototype, "request_token", {
        get: function () { return this.storage.tmdb_v4_request_token; },
        set: function (value) { this.storage.tmdb_v4_request_token = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmdbClientV4.prototype, "access_token", {
        get: function () { return this.storage.tmdb_v4_access_token; },
        set: function (value) { this.storage.tmdb_v4_access_token = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmdbClientV4.prototype, "account_id", {
        get: function () { return this.storage.tmdb_v4_account_id; },
        set: function (value) { this.storage.tmdb_v4_account_id = value; },
        enumerable: true,
        configurable: true
    });
    TmdbClientV4.prototype.loginToTmdb = function () {
        var _this = this;
        return this._loginToTmdb().then(function (t) { return _this.onLogin(); });
    };
    TmdbClientV4.prototype._loginToTmdb = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.addEventListener("message", function (e) {
                console.log("messsage", e.data, e);
                _this.authCreateAccessToken({ request_token: _this.request_token })
                    .then(function (e) {
                    console.log("createAccessToken", e);
                    if (!e.success) {
                        reject();
                        return;
                    }
                    _this.access_token = e.access_token;
                    _this.account_id = e.account_id;
                    resolve();
                });
            });
            var l = location;
            var redirect_to = l.protocol + "//" + l.host + "/tmdb-login.html?v=4&back=1";
            _this.authCreateRequestToken({ body: { redirect_to: redirect_to } }).then(function (e) {
                _this.request_token = e.request_token;
                console.log(e);
                var win = window.open("/tmdb-login.html?v=4&request_token=" + _this.request_token);
            });
        });
    };
    return TmdbClientV4;
}(client_1.TmdbV4Client));
exports.TmdbClientV4 = TmdbClientV4;
//# sourceMappingURL=tmdb-client-v4.js.map