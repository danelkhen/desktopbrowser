import { TmdbApi, TmdbApiMetadata } from "./tmdb-api"
import { Proxy } from "../utils/proxy"
import { xhr } from "./xhr"

export class TmdbApiClient extends Proxy<TmdbApi>{
    constructor() {
        super();
        this.onInvoke = pc => {
            let md = TmdbApiMetadata[pc.name];
            let path = md.path;
            let req = pc.args[0];
            let url = this.base_url + path;
            let prms = { api_key: this.api_key, ...req }
            return xhr({ url, params: prms }).then(res => {
                console.log({ pc, path, req, res });
                return res;
            });
        };
    }
    api_key: string;
    base_url = 'https://api.themoviedb.org/3';
}


