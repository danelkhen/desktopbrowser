import { TmdbApi, } from "tmdb-api"
import { TmdbApiPaths } from "./md"
import { Proxy } from "../utils/proxy"

export class TmdbApiClient extends Proxy<TmdbApi>{
    constructor() {
        super();
        this.onInvoke = pc => {
            console.log({ pc });
            let path = TmdbApiPaths[pc.name];
            let req = pc.args[0];
            console.log({ path, req });
            let url = this.base_url + path;
            let prms = { api_key: this.api_key, ...req }
            return xhr2({ url, params: prms });//.then(e => console.log(e));
        };
    }
    api_key: string;
    base_url = 'https://api.themoviedb.org/3'

}


export function xhr2<T>(opts: XhrConfig) {
    return new Promise<string>((resolve, reject) => {
        let url = opts.url;
        let method = opts.method || "GET";
        let remaining = {};
        if (opts.params != null && method == "GET") {
            Object.keys(opts.params).forEach(key => {
                let placeholder = "{" + key + "}";
                if (url.contains(placeholder)) {
                    url.replace(placeholder, encodeURIComponent(opts.params[key]));
                }
                else {
                    remaining[key] = opts.params[key];
                }
            });
            let query = Object.keys(remaining).map(key => `${key}=${encodeURIComponent(remaining[key])}`).join("&");
            url += "?" + query;
        }
        console.log({ url });
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", e => {
            if (xhr.readyState == 4)
                resolve(JSON.parse(xhr.responseText));
        });
        xhr.open("GET", url);
        xhr.send();
    });
}

export interface XhrConfig {
    url?: string;
    queryParams?: any;
    params?: any;
    method?: string;
}

function test() {
    let x = new TmdbApiClient();
    x.api_key = '16a856dff4d1db46782e6132610ddb32';
    x.invoke(t => t.getSearchMovie({ query: "deadpool" })).then(e => console.log(e));
}

test();
