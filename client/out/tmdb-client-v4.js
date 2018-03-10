"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./tmdb/v4/client");
class TmdbClientV4 extends client_1.TmdbV4Client {
    constructor() {
        super();
        this.storage = localStorage;
        console.log("TmdbClient ctor");
        let base = this.proxy.onInvoke;
        this.proxy.onInvoke = pc => {
            if (this.account_id != null) {
                let prm = pc.args[0];
                if (prm == null) {
                    prm = {};
                    pc.args[0] = prm;
                }
                if (prm.account_id == null && this.account_id != null)
                    prm.account_id = this.account_id;
            }
            return base(pc);
        };
    }
    init() {
        return Promise.resolve();
    }
    onLogin() {
        return Promise.resolve();
    }
    get request_token() { return this.storage.tmdb_v4_request_token; }
    set request_token(value) { this.storage.tmdb_v4_request_token = value; }
    get access_token() { return this.storage.tmdb_v4_access_token; }
    set access_token(value) { this.storage.tmdb_v4_access_token = value; }
    get account_id() { return this.storage.tmdb_v4_account_id; }
    set account_id(value) { this.storage.tmdb_v4_account_id = value; }
    loginToTmdb() {
        return this._loginToTmdb().then(t => this.onLogin());
    }
    _loginToTmdb() {
        return new Promise((resolve, reject) => {
            window.addEventListener("message", e => {
                console.log("messsage", e.data, e);
                this.authCreateAccessToken({ request_token: this.request_token })
                    .then(e => {
                    console.log("createAccessToken", e);
                    if (!e.success) {
                        reject();
                        return;
                    }
                    this.access_token = e.access_token;
                    this.account_id = e.account_id;
                    resolve();
                });
            });
            var l = location;
            let redirect_to = l.protocol + "//" + l.host + "/tmdb-login.html?v=4&back=1";
            this.authCreateRequestToken({ body: { redirect_to } }).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?v=4&request_token=" + this.request_token);
            });
        });
    }
}
exports.TmdbClientV4 = TmdbClientV4;
//# sourceMappingURL=tmdb-client-v4.js.map