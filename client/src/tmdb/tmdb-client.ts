import { TmdbApi, TmdbApiMetadata } from "./tmdb-api"
import { Proxy } from "../utils/proxy"
import {xhr} from "./xhr"

export class TmdbApiClient extends Proxy<TmdbApi>{
    constructor() {
        super();
        this.onInvoke = pc => {
            console.log({ pc });
            let md = TmdbApiMetadata[pc.name];
            let path = md.path;
            let req = pc.args[0];
            console.log({ path, req });
            let url = this.base_url + path;
            let prms = { api_key: this.api_key, ...req }
            return xhr({ url, params: prms });//.then(e => console.log(e));
        };
    }
    api_key: string;
    base_url = 'https://api.themoviedb.org/3';
}


