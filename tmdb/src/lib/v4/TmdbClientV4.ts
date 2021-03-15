import * as T4 from "../tmdb-v4"
import { TmdbV4Proxy } from "./TmdbV4Proxy"
import { Invoker } from "../utils/Proxy"

export class TmdbClientV4 {
    invoke: Invoker<T4.TmdbV4Api>
    // invoke2(method: string, prms: any[]) {
    //     this.invoke({method:{ method, pprms:rms }})
    // }
    constructor() {
        this.proxy = new TmdbV4Proxy()
        this.invoke = this.proxy.invoker
    }
    get base_url() {
        return this.proxy.base_url
    }
    set base_url(value: string) {
        this.proxy.base_url = value
    }

    get read_access_token(): string | null {
        return this.proxy.read_access_token
    }
    set read_access_token(value: string | null) {
        this.proxy.read_access_token = value
    }

    protected proxy: TmdbV4Proxy

    accountGetFavoriteMovies(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetFavoriteMoviesResponseBase> {
        return this.invoke({ method: "accountGetFavoriteMovies", prms: [req] })
    }
    accountGetFavoriteTVShows(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetTVShowWatchlistResponseBase> {
        return this.invoke({ method: "accountGetFavoriteTVShows", prms: [req] })
    }
    accountGetLists(req: T4.AccountGetListsRequest): Promise<T4.PagedResponse<T4.AccountGetCreatedListsResponseItem>> {
        return this.invoke({ method: "accountGetLists", prms: [req] })
    }
    accountGetMovieRecommendations(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetFavoriteMoviesResponseBase> {
        return this.invoke({ method: "accountGetMovieRecommendations", prms: [req] })
    }
    accountGetMovieWatchlist(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetFavoriteMoviesResponseBase> {
        return this.invoke({ method: "accountGetMovieWatchlist", prms: [req] })
    }
    accountGetRatedMovies(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetFavoriteMoviesResponseBase> {
        return this.invoke({ method: "accountGetRatedMovies", prms: [req] })
    }
    accountGetRatedTVShows(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetTVShowWatchlistResponseBase> {
        return this.invoke({ method: "accountGetRatedTVShows", prms: [req] })
    }
    accountGetTVShowRecommendations(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetTVShowWatchlistResponseBase> {
        return this.invoke({ method: "accountGetTVShowRecommendations", prms: [req] })
    }
    accountGetTVShowWatchlist(
        req: T4.AccountGetFavoriteMoviesRequestBase
    ): Promise<T4.AccountGetTVShowWatchlistResponseBase> {
        return this.invoke({ method: "accountGetTVShowWatchlist", prms: [req] })
    }
    authCreateAccessToken(req: T4.CreateAccessTokenRequest): Promise<T4.AuthCreateAccessTokenResponse> {
        return this.invoke({ method: "authCreateAccessToken", prms: [req] })
    }
    authCreateRequestToken(req: T4.CreateRequestTokenRequest): Promise<T4.AuthCreateRequestTokenResponse> {
        return this.invoke({ method: "authCreateRequestToken", prms: [req] })
    }
    authDeleteAccessToken(req: T4.ListCreateListRequestBase): Promise<T4.ListDeleteListResponseBase> {
        return this.invoke({ method: "authDeleteAccessToken", prms: [req] })
    }
    listAddItems(req: T4.ListAddItemsRequestBase): Promise<T4.ListAddItemsResponseBase> {
        return this.invoke({ method: "listAddItems", prms: [req] })
    }
    listCheckItemStatus(req: T4.ListCheckItemStatusRequest): Promise<T4.ListCheckItemStatusResponse> {
        return this.invoke({ method: "listCheckItemStatus", prms: [req] })
    }
    listClearList(req: T4.ListDeleteListRequestBase): Promise<T4.ListClearListResponse> {
        return this.invoke({ method: "listClearList", prms: [req] })
    }
    listCreateList(req: T4.ListCreateListRequestBase): Promise<void> {
        return this.invoke({ method: "listCreateList", prms: [req] })
    }
    listDeleteList(req: T4.ListDeleteListRequestBase): Promise<T4.ListDeleteListResponseBase> {
        return this.invoke({ method: "listDeleteList", prms: [req] })
    }
    listGetList(req: T4.ListGetListRequest): Promise<T4.ListGetListResponse> {
        return this.invoke({ method: "listGetList", prms: [req] })
    }
    listRemoveItems(req: T4.ListAddItemsRequestBase): Promise<T4.ListAddItemsResponseBase> {
        return this.invoke({ method: "listRemoveItems", prms: [req] })
    }
    listUpdateItems(req: T4.ListAddItemsRequestBase): Promise<T4.ListAddItemsResponseBase> {
        return this.invoke({ method: "listUpdateItems", prms: [req] })
    }
    listUpdateList(req: T4.ListAddItemsRequestBase): Promise<void> {
        return this.invoke({ method: "listUpdateList", prms: [req] })
    }
}
