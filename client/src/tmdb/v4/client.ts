import * as T4 from "tmdb-v4"
import {TmdbApiMetadata,  } from "./md"
import { Proxy, } from "../../utils/proxy"
import { TmdbV4Proxy, } from "./proxy"

export class TmdbV4Client {
    constructor() {
        this.proxy = new TmdbV4Proxy();
    }
    get base_url(): string { return this.proxy.base_url; }
    set base_url(value: string) { this.proxy.base_url = value; }

    get read_access_token(): string { return this.proxy.read_access_token; }
    set read_access_token(value: string) { this.proxy.read_access_token = value; }


    proxy: TmdbV4Proxy;

    accountGetFavoriteMovies(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetFavoriteMovies(req)); }
    accountGetFavoriteTVShows(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetFavoriteTVShows(req)); }
    accountGetLists(req: T4.AccountGetListsRequest): T4.PagedResponse<Promise<T4.AccountGetCreatedListsResponseItem>> { return this.proxy.invoke(t => t.accountGetLists(req)); }
    accountGetMovieRecommendations(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetMovieRecommendations(req)); }
    accountGetMovieWatchlist(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetMovieWatchlist(req)); }
    accountGetRatedMovies(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetRatedMovies(req)); }
    accountGetRatedTVShows(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetRatedTVShows(req)); }
    accountGetTVShowRecommendations(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetTVShowRecommendations(req)); }
    accountGetTVShowWatchlist(req: T4.AccountGetFavoriteMoviesRequestBase): Promise<T4.AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetTVShowWatchlist(req)); }
    authCreateAccessToken(req: T4.CreateAccessTokenRequest): Promise<T4.AuthCreateAccessTokenResponse> { return this.proxy.invoke(t => t.authCreateAccessToken(req)); }
    authCreateRequestToken(req: T4.CreateRequestTokenRequest): Promise<T4.AuthCreateRequestTokenResponse> { return this.proxy.invoke(t => t.authCreateRequestToken(req)); }
    authDeleteAccessToken(req: T4.ListCreateListRequestBase): Promise<T4.ListDeleteListResponseBase> { return this.proxy.invoke(t => t.authDeleteAccessToken(req)); }
    listAddItems(req: T4.ListAddItemsRequestBase): Promise<T4.ListAddItemsResponseBase> { return this.proxy.invoke(t => t.listAddItems(req)); }
    listCheckItemStatus(req: T4.ListCheckItemStatusRequest): Promise<T4.ListCheckItemStatusResponse> { return this.proxy.invoke(t => t.listCheckItemStatus(req)); }
    listClearList(req: T4.ListDeleteListRequestBase): Promise<T4.ListClearListResponse> { return this.proxy.invoke(t => t.listClearList(req)); }
    listCreateList(req: T4.ListCreateListRequestBase): Promise<any> { return this.proxy.invoke(t => t.listCreateList(req)); }
    listDeleteList(req: T4.ListDeleteListRequestBase): Promise<T4.ListDeleteListResponseBase> { return this.proxy.invoke(t => t.listDeleteList(req)); }
    listGetList(req: T4.ListGetListRequest): Promise<T4.ListGetListResponse> { return this.proxy.invoke(t => t.listGetList(req)); }
    listRemoveItems(req: T4.ListAddItemsRequestBase): Promise<T4.ListAddItemsResponseBase> { return this.proxy.invoke(t => t.listRemoveItems(req)); }
    listUpdateItems(req: T4.ListAddItemsRequestBase): Promise<T4.ListAddItemsResponseBase> { return this.proxy.invoke(t => t.listUpdateItems(req)); }
    listUpdateList(req: T4.ListAddItemsRequestBase): Promise<any> { return this.proxy.invoke(t => t.listUpdateList(req)); }

}
