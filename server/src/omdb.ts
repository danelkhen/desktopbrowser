import * as rp from "request-promise-native"
export const OMDB_API_URL = "https://www.omdbapi.com/";
import { ByTitleOrId, ByTitleOrIdResponse, BySearch, SearchResponse, OmdbApi as OmdbApiContract } from "omdb-contracts"
import { Proxy, ProxyCall } from "./utils/proxy"

export class OmdbApi extends Proxy<OmdbApiContract> {
    onInvoke<R>(pc: ProxyCall): Promise<R> {
        let req = pc.args[0];
        let q = Object.keys(req).map(key => key + "=" + encodeURIComponent(req[key])).join("&");
        let url = OMDB_API_URL + "?" + q;
        return rp(url).then(t => JSON.parse(t));
    }
    //byTitleOrId(req: ByTitleOrId): Promise<ByTitleOrIdResponse> {
    //    return this.invoke(t => t.byTitleOrId(req));
    //}
    //bySearch(req: BySearch): Promise<SearchResponse> {
    //    return this.invoke(t => t.bySearch(req));
    //}
}
