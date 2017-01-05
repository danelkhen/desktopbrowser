import { TmdbApiClient2, } from "./tmdb/tmdb-client2-v4"
import { promiseEach, tryParseInt } from "./utils/utils"

export class TmdbClientV4 extends TmdbApiClient2 {
    constructor() {
        super();
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
            return base(pc);//.then(t => this.fixResponse(t, pc.name));
        };
    }
    init(): Promise<any> {
        return Promise.resolve();
    }

    onLogin(): Promise<any> {
        return Promise.resolve();
    }

    storage: GeneralStorage = localStorage;

    get request_token(): string { return this.storage.tmdb_v4_request_token; }
    set request_token(value: string) { this.storage.tmdb_v4_request_token = value; }

    get access_token(): string { return this.storage.tmdb_v4_access_token; }
    set access_token(value: string) { this.storage.tmdb_v4_access_token = value; }

    get account_id(): string { return this.storage.tmdb_v4_account_id; }
    set account_id(value: string) { this.storage.tmdb_v4_account_id = value; }



    loginToTmdb(): Promise<any> {
        return this._loginToTmdb().then(t => this.onLogin());//.accountGetDetails()).then(t => this.getCreateTmdbWatchedList());
    }
    _loginToTmdb(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
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
            let redirect_to = l.protocol+"//"+l.host+"/tmdb-login.html?v=4&back=1";
            this.authCreateRequestToken({ body: { redirect_to } }).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?v=4&request_token=" + this.request_token);
            });
        });
    }


}

export interface GeneralStorage {
    tmdb_v4_request_token?: string;
    tmdb_v4_access_token?: string;
    tmdb_v4_account_id?: string;
}