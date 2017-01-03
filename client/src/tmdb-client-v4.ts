import { TmdbApiClient, } from "./tmdb/tmdb-client-v4"
import { promiseEach, tryParseInt } from "./utils/utils"

export class TmdbClientV4 extends TmdbApiClient {
    constructor() {
        super();
        console.log("TmdbClient ctor");
        let base = this.onInvoke;
        this.onInvoke = pc => {
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
        this.read_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmE4NTZkZmY0ZDFkYjQ2NzgyZTYxMzI2MTBkZGIzMiIsInN1YiI6IjU4NGZlYzU1OTI1MTQxNmU0YjAwODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jg-T4s-kFV_FlXwG1tovDvCQhXGaw9cjMA9e669xFaE";
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

    get account_id(): number { return tryParseInt(this.storage.tmdb_account_id); }
    set account_id(value: number) { this.storage.tmdb_account_id = String(value); }



    loginToTmdb(): Promise<any> {
        return this._loginToTmdb().then(t => this.onLogin());//.accountGetDetails()).then(t => this.getCreateTmdbWatchedList());
    }
    _loginToTmdb(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            //TODO:
            //window.addEventListener("message", e => {
            //    console.log("messsage", e.data, e);
            //    let x: TmdbLoginPagePrms = e.data;
            //    if (x.approved != "true") {
            //        reject();
            //        return;
            //    }
            //    this.invoke(t => t.createAccessToken({request_token:this.request_token}))
            //        .then(e => {
            //            console.log("session", e);
            //            if (!e.success) {
            //                reject();
            //                return;
            //            }
            //            this.request_token = e.access_token;
            //            resolve();
            //        });
            //});
            this.invoke(t => t.createRequestToken({})).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?v=4&request_token=" + this.request_token);
            });
            setTimeout(() => {
                this.invoke(t => t.createAccessToken({request_token:this.request_token}))
                    .then(e => {
                        console.log("createAccessToken", e);
                        if (!e.success) {
                            reject();
                            return;
                        }
                        this.access_token = e.access_token;
                        this.account_id = tryParseInt(e.account_id);
                        resolve();
                    });

            }, 5000);
        });
    }


}

export interface GeneralStorage {
    tmdb_v4_request_token?: string;
    tmdb_v4_access_token?: string;
    tmdb_account_id?: string;
}