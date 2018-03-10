"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MyModule;
(function (MyModule) {
    MyModule.Metadata = {
        "accountGetFavoriteMovies": {
            "path": "/account/{account_id}/movie/favorites",
            "method": "get"
        },
        "accountGetTVShowWatchlist": {
            "path": "/account/{account_id}/tv/watchlist",
            "method": "get"
        },
        "listCreateList": {
            "path": "/list",
            "method": "post"
        },
        "listAddItems": {
            "path": "/list/{list_id}/items",
            "method": "post"
        },
        "listUpdateItems": {
            "path": "/list/{list_id}/items",
            "method": "put"
        },
        "listRemoveItems": {
            "path": "/list/{list_id}/items",
            "method": "delete"
        },
        "accountGetMovieWatchlist": {
            "path": "/account/{account_id}/movie/watchlist",
            "method": "get"
        },
        "listGetList": {
            "path": "/list/{list_id}",
            "method": "get"
        },
        "listUpdateList": {
            "path": "/list/{list_id}",
            "method": "put"
        },
        "listDeleteList": {
            "path": "/list/{list_id}",
            "method": "delete"
        },
        "authCreateAccessToken": {
            "path": "/auth/access_token",
            "method": "post"
        },
        "authDeleteAccessToken": {
            "path": "/auth/access_token",
            "method": "delete"
        },
        "accountGetTVShowRecommendations": {
            "path": "/account/{account_id}/tv/recommendations",
            "method": "get"
        },
        "authCreateRequestToken": {
            "path": "/auth/request_token",
            "method": "post"
        },
        "accountGetLists": {
            "path": "/account/{account_id}/lists",
            "method": "get"
        },
        "accountGetRatedMovies": {
            "path": "/account/{account_id}/movie/rated",
            "method": "get"
        },
        "listClearList": {
            "path": "/list/{list_id}/clear",
            "method": "get"
        },
        "accountGetMovieRecommendations": {
            "path": "/account/{account_id}/movie/recommendations",
            "method": "get"
        },
        "accountGetFavoriteTVShows": {
            "path": "/account/{account_id}/tv/favorites",
            "method": "get"
        },
        "accountGetRatedTVShows": {
            "path": "/account/{account_id}/tv/rated",
            "method": "get"
        },
        "listCheckItemStatus": {
            "path": "/list/{list_id}/item_status",
            "method": "get"
        }
    };
})(MyModule = exports.MyModule || (exports.MyModule = {}));
