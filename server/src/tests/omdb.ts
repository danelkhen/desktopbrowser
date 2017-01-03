//import * as rp from "request-promise-native"
//export const OMDB_API_URL = "https://www.omdbapi.com/";
//import { ByTitleOrId, ByTitleOrIdResponse, BySearch, SearchResponse, OmdbApi as OmdbApiContract } from "omdb-contracts"
//import { Proxy, ProxyCall } from "../utils/proxy"

//export class OmdbApi extends Proxy<OmdbApiContract> {
//    onInvoke<R>(pc: ProxyCall): Promise<R> {
//        let req = pc.args[0];
//        let q = Object.keys(req).map(key => key + "=" + encodeURIComponent(req[key])).join("&");
//        let url = OMDB_API_URL + "?" + q;
//        return rp(url).then(t => JSON.parse(t));
//    }
//    //byTitleOrId(req: ByTitleOrId): Promise<ByTitleOrIdResponse> {
//    //    return this.invoke(t => t.byTitleOrId(req));
//    //}
//    //bySearch(req: BySearch): Promise<SearchResponse> {
//    //    return this.invoke(t => t.bySearch(req));
//    //}
//}

    //omdbGet(req: omdb.MovieRequest): Promise<OmdbGetResponse> {
    //    return new Promise<OmdbGetResponse>((resolve, reject) => {
    //        omdb.getReq(req, (err, data) => {
    //            let movie: OmdbMovie = data;
    //            if (data != null) {
    //            }
    //            resolve({ data, err: err as any });
    //        });
    //    });
    //}

    //imdbRss(req: { path: string }): Promise<string> {
    //    return new Promise<string>((resolve, reject) => {
    //        let url = `http://rss.imdb.com${req.path}`;
    //        console.log(url);
    //        let xhr = new XMLHttpRequest();
    //        xhr.addEventListener("readystatechange", e => {
    //            if (xhr.readyState == 4)
    //                resolve(xhr.responseText);
    //        });
    //        xhr.open("GET", url);
    //        xhr.send();
    //    });
    //}

    //export interface OmdbMovie {
    //    imdbid: string;
    //    imdburl: string;
    //    genres: string;
    //    languages: string;
    //    country: string;
    //    votes: string;
    //    series: boolean;
    //    rating: number;
    //    runtime: string;
    //    title: string;
    //    year: number;
    //    type: string;
    //    poster: string;
    //    metascore: string;
    //    plot: string;
    //    rated: string;
    //    director: string;
    //    writer: string;
    //    actors: string;
    //    released: Date;
    //}

    //export interface MovieRequest {
    //    name?: string;
    //    id?: string;
    //    year?: number;
    //}
