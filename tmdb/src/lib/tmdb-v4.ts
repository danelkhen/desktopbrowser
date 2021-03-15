export const test = "test"
export interface TmdbV4Api {
    accountGetFavoriteMovies(req: AccountGetFavoriteMoviesRequestBase): AccountGetFavoriteMoviesResponseBase
    accountGetFavoriteTVShows(req: AccountGetFavoriteMoviesRequestBase): AccountGetTVShowWatchlistResponseBase
    accountGetLists(req: AccountGetListsRequest): PagedResponse<AccountGetCreatedListsResponseItem>
    accountGetMovieRecommendations(req: AccountGetFavoriteMoviesRequestBase): AccountGetFavoriteMoviesResponseBase
    accountGetMovieWatchlist(req: AccountGetFavoriteMoviesRequestBase): AccountGetFavoriteMoviesResponseBase
    accountGetRatedMovies(req: AccountGetFavoriteMoviesRequestBase): AccountGetFavoriteMoviesResponseBase
    accountGetRatedTVShows(req: AccountGetFavoriteMoviesRequestBase): AccountGetTVShowWatchlistResponseBase
    accountGetTVShowRecommendations(req: AccountGetFavoriteMoviesRequestBase): AccountGetTVShowWatchlistResponseBase
    accountGetTVShowWatchlist(req: AccountGetFavoriteMoviesRequestBase): AccountGetTVShowWatchlistResponseBase
    authCreateAccessToken(req: CreateAccessTokenRequest): AuthCreateAccessTokenResponse
    authCreateRequestToken(req: CreateRequestTokenRequest): AuthCreateRequestTokenResponse
    authDeleteAccessToken(req: ListCreateListRequestBase): ListDeleteListResponseBase
    listAddItems(req: ListAddItemsRequestBase): ListAddItemsResponseBase
    listCheckItemStatus(req: ListCheckItemStatusRequest): ListCheckItemStatusResponse
    listClearList(req: ListDeleteListRequestBase): ListClearListResponse
    listCreateList(req: ListCreateListRequestBase): any
    listDeleteList(req: ListDeleteListRequestBase): ListDeleteListResponseBase
    listGetList(req: ListGetListRequest): ListGetListResponse
    listRemoveItems(req: ListAddItemsRequestBase): ListAddItemsResponseBase
    listUpdateItems(req: ListAddItemsRequestBase): ListAddItemsResponseBase
    listUpdateList(req: ListAddItemsRequestBase): any
}

export interface Request {
    Authorization?: string
    "Content-Type"?: string
}
export interface Response {
    status_message: string
    success: boolean
    status_code: number
}
export interface CreateAccessTokenRequest extends Request {
    request_token: string
}

export interface ListGetListResponse {
    backdrop_path: string
    id: number
    page: number
    poster_path: string
    public: boolean
    results: any[]
    revenue: string
    total_results: number
}

export interface AuthCreateAccessTokenResponse {
    access_token: string
    account_id: string
    status_code: number
    status_message: string
    success: boolean
}

export interface AuthCreateRequestTokenResponse {
    request_token: string
    status_code: number
    status_message: string
    success: boolean
}

export interface ListClearListResponse {
    id: number
    items_deleted: number
    status_code: number
    status_message: string
    success: boolean
}

export interface ListCheckItemStatusResponse {
    id: number
    media_id: number
    media_type: string
    status_code: number
    status_message: string
    success: boolean
}

export interface ListGetListRequest {
    api_key?: string
    Authorization?: string
    "Content-Type"?: string
    language?: string
    list_id?: number
    page?: number
    sort_by?: string
}

export interface AccountGetListsRequest {
    account_id?: string
    Authorization?: string
    page?: number
}

export interface ListCheckItemStatusRequest {
    Authorization?: string
    "Content-Type"?: string
    list_id?: number
    media_id?: number
    media_type?: string
}

export interface AccountGetFavoriteMoviesResponseBase {
    page: number
    results: any[]
    total_pages: number
    total_results: number
}

export interface AccountGetTVShowWatchlistResponse_resultsBase {
    backdrop_path: string
    first_air_date: string
    genre_ids: number[]
    id: number
    name: string
    origin_country: string[]
    original_language: string
    original_name: string
    overview: string
    popularity: number
    poster_path: string
    vote_average: number
    vote_count: number
}

export interface AccountGetTVShowWatchlistResponseBase {
    page: number
    results: AccountGetTVShowWatchlistResponse_resultsBase[]
}

export interface ListAddItemsResponse_resultsBase {
    media_id: number
    media_type: string
    success: boolean
}

export interface ListAddItemsResponseBase {
    results: ListAddItemsResponse_resultsBase[]
    status_code: number
    status_message: string
    success: boolean
}

export interface ListDeleteListResponseBase {
    status_code: number
    status_message: string
    success: boolean
}
export interface CreateRequestTokenRequest extends Request {
    body?: { redirect_to: string }
}

export interface AccountGetFavoriteMoviesRequestBase {
    account_id?: string
    Authorization?: string
    page?: number
    sort_by?: string
}

export interface ListCreateListRequestBase {
    Authorization?: string
    body?: any
    "Content-Type"?: string
}

export interface ListAddItemsRequestBase {
    Authorization?: string
    body?: any
    "Content-Type"?: string
    list_id?: number
}

export interface ListDeleteListRequestBase {
    Authorization?: string
    "Content-Type"?: string
    list_id?: number
}
export interface ApiMetadata {
    path: string
    method: string
}

export interface PagedResponse<T> {
    page?: number
    results?: T[]
    total_pages?: number
    total_results?: number
}

export interface AccountGetCreatedListsResponseItem {
    description: string
    favorite_count: number
    id: number
    iso_639_1: string
    item_count: number
    list_type: string
    name: string
    poster_path: null
}
