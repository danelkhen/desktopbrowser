import { TmdbApi, MovieListResultObject as TmdbMovie, Configuration } from "tmdb-api"
import { TmdbApiClient } from "./tmdb/client"

export class TmdbClient extends TmdbApiClient {
    init() {
        this.api_key = '16a856dff4d1db46782e6132610ddb32';
        this.invoke(t => t.getConfiguration({})).then(t => this.configuration = t);
    }
    configuration: Configuration;

    getImageUrl(movie: TmdbMovie, prop: keyof TmdbMovie, size?: string): string {
        let c = this.configuration.images;
        if (size == null) {
            if (prop == "backdrop_path") {
                size = c.backdrop_sizes[0];
            }
            else if (prop == "poster_path") {
                size = c.poster_sizes[0];
            }
            else {
                console.warn("getImageUrl2 not implemented for prop", prop);
                return null;
            }
        }
        return `${c.base_url}${size}/${movie[prop]}`;
    }

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
    x.invoke(t => t.searchMovie({ query: "deadpool" })).then(e => console.log(e));
}

test();
