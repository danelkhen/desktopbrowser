import * as rp from "request-promise-native"
export const OMDB_API_URL = "https://www.omdbapi.com/";
import { ByTitleOrId, ByTitleOrIdResponse, BySearch, SearchResponse, OmdbApi as OmdbApiContract } from "omdb-contracts"

export class OmdbApi implements OmdbApiContract {
    invoke(req: any): Promise<any> {
        let q = Object.keys(req).map(key => key + "=" + encodeURIComponent(req[key])).join("&");
        let url = OMDB_API_URL + "?" + q;
        return rp(url).then(t => JSON.parse(t));
    }
    byTitleOrId(req: ByTitleOrId): Promise<ByTitleOrIdResponse> {
        return this.invoke(req);
    }
    bySearch(req: BySearch): Promise<SearchResponse> {
        return this.invoke(req);
    }
}
