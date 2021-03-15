import * as T3 from "../tmdb-v3"
import * as T4 from "../tmdb-v4"

export let TmdbApiMetadata: T3.ApiMd<T4.TmdbV4Api> = {
    accountGetFavoriteMovies: { path: "/account/{account_id}/movie/favorites", method: "GET" },
    accountGetTVShowWatchlist: { path: "/account/{account_id}/tv/watchlist", method: "GET" },
    listCreateList: { path: "/list", method: "POST" },
    listAddItems: { path: "/list/{list_id}/items", method: "POST" },
    listUpdateItems: { path: "/list/{list_id}/items", method: "PUT" },
    listRemoveItems: { path: "/list/{list_id}/items", method: "DELETE" },
    accountGetMovieWatchlist: { path: "/account/{account_id}/movie/watchlist", method: "GET" },
    listGetList: { path: "/list/{list_id}", method: "GET" },
    listUpdateList: { path: "/list/{list_id}", method: "PUT" },
    listDeleteList: { path: "/list/{list_id}", method: "DELETE" },
    authCreateAccessToken: { path: "/auth/access_token", method: "POST" },
    authDeleteAccessToken: { path: "/auth/access_token", method: "DELETE" },
    accountGetTVShowRecommendations: { path: "/account/{account_id}/tv/recommendations", method: "GET" },
    authCreateRequestToken: { path: "/auth/request_token", method: "POST" },
    accountGetLists: { path: "/account/{account_id}/lists", method: "GET" },
    accountGetRatedMovies: { path: "/account/{account_id}/movie/rated", method: "GET" },
    listClearList: { path: "/list/{list_id}/clear", method: "GET" },
    accountGetMovieRecommendations: { path: "/account/{account_id}/movie/recommendations", method: "GET" },
    accountGetFavoriteTVShows: { path: "/account/{account_id}/tv/favorites", method: "GET" },
    accountGetRatedTVShows: { path: "/account/{account_id}/tv/rated", method: "GET" },
    listCheckItemStatus: { path: "/list/{list_id}/item_status", method: "GET" },
}
