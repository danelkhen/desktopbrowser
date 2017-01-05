import {
    AccountGetCreatedListsResponseItem, AccountGetFavoriteMoviesRequestBase, AccountGetFavoriteMoviesResponseBase, AccountGetListsRequest, AccountGetTVShowWatchlistResponseBase,
    AccountGetTVShowWatchlistResponse_resultsBase, ApiMetadata, AuthCreateAccessTokenResponse, AuthCreateRequestTokenResponse, CreateAccessTokenRequest, CreateRequestTokenRequest,
    ListAddItemsRequestBase, ListAddItemsResponseBase, ListAddItemsResponse_resultsBase, ListCheckItemStatusRequest, ListCheckItemStatusResponse, ListClearListResponse, 
    ListCreateListRequestBase, ListDeleteListRequestBase, ListDeleteListResponseBase, ListGetListRequest, ListGetListResponse, PagedResponse, Request, Response, TmdbApiMetadata, TmdbApiV4
} from "./tmdb-api-v4"
import { TvShow, TmdbMovie, AccountRatedTVEpisode, Person, RatedMovie, RatedTvShow, ChangeList, PopularPerson, SessionRatedTVEpisode } from "./tmdb-api"
import { Proxy, } from "../utils/proxy"
import { TmdbApiClient, } from "./tmdb-client-v4"

export class TmdbApiClient2 {
    constructor() {
        this.proxy = new TmdbApiClient();
    }
    get base_url(): string { return this.proxy.base_url; }
    set base_url(value: string) { this.proxy.base_url = value; }

    proxy: TmdbApiClient;

    accountGetFavoriteMovies(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetFavoriteMovies(req)); }
    accountGetFavoriteTVShows(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetFavoriteTVShows(req)); }
    accountGetLists(req: AccountGetListsRequest): PagedResponse<Promise<AccountGetCreatedListsResponseItem>> { return this.proxy.invoke(t => t.accountGetLists(req)); }
    accountGetMovieRecommendations(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetMovieRecommendations(req)); }
    accountGetMovieWatchlist(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetMovieWatchlist(req)); }
    accountGetRatedMovies(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetFavoriteMoviesResponseBase> { return this.proxy.invoke(t => t.accountGetRatedMovies(req)); }
    accountGetRatedTVShows(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetRatedTVShows(req)); }
    accountGetTVShowRecommendations(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetTVShowRecommendations(req)); }
    accountGetTVShowWatchlist(req: AccountGetFavoriteMoviesRequestBase): Promise<AccountGetTVShowWatchlistResponseBase> { return this.proxy.invoke(t => t.accountGetTVShowWatchlist(req)); }
    authCreateAccessToken(req: CreateAccessTokenRequest): Promise<AuthCreateAccessTokenResponse> { return this.proxy.invoke(t => t.authCreateAccessToken(req)); }
    authCreateRequestToken(req: CreateRequestTokenRequest): Promise<AuthCreateRequestTokenResponse> { return this.proxy.invoke(t => t.authCreateRequestToken(req)); }
    authDeleteAccessToken(req: ListCreateListRequestBase): Promise<ListDeleteListResponseBase> { return this.proxy.invoke(t => t.authDeleteAccessToken(req)); }
    listAddItems(req: ListAddItemsRequestBase): Promise<ListAddItemsResponseBase> { return this.proxy.invoke(t => t.listAddItems(req)); }
    listCheckItemStatus(req: ListCheckItemStatusRequest): Promise<ListCheckItemStatusResponse> { return this.proxy.invoke(t => t.listCheckItemStatus(req)); }
    listClearList(req: ListDeleteListRequestBase): Promise<ListClearListResponse> { return this.proxy.invoke(t => t.listClearList(req)); }
    listCreateList(req: ListCreateListRequestBase): Promise<any> { return this.proxy.invoke(t => t.listCreateList(req)); }
    listDeleteList(req: ListDeleteListRequestBase): Promise<ListDeleteListResponseBase> { return this.proxy.invoke(t => t.listDeleteList(req)); }
    listGetList(req: ListGetListRequest): Promise<ListGetListResponse> { return this.proxy.invoke(t => t.listGetList(req)); }
    listRemoveItems(req: ListAddItemsRequestBase): Promise<ListAddItemsResponseBase> { return this.proxy.invoke(t => t.listRemoveItems(req)); }
    listUpdateItems(req: ListAddItemsRequestBase): Promise<ListAddItemsResponseBase> { return this.proxy.invoke(t => t.listUpdateItems(req)); }
    listUpdateList(req: ListAddItemsRequestBase): Promise<any> { return this.proxy.invoke(t => t.listUpdateList(req)); }

}
