"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_1 = require("./proxy");
class TmdbV4Client {
    constructor() {
        this.proxy = new proxy_1.TmdbV4Proxy();
    }
    get base_url() { return this.proxy.base_url; }
    set base_url(value) { this.proxy.base_url = value; }
    get read_access_token() { return this.proxy.read_access_token; }
    set read_access_token(value) { this.proxy.read_access_token = value; }
    accountGetFavoriteMovies(req) { return this.proxy.invoke(t => t.accountGetFavoriteMovies(req)); }
    accountGetFavoriteTVShows(req) { return this.proxy.invoke(t => t.accountGetFavoriteTVShows(req)); }
    accountGetLists(req) { return this.proxy.invoke(t => t.accountGetLists(req)); }
    accountGetMovieRecommendations(req) { return this.proxy.invoke(t => t.accountGetMovieRecommendations(req)); }
    accountGetMovieWatchlist(req) { return this.proxy.invoke(t => t.accountGetMovieWatchlist(req)); }
    accountGetRatedMovies(req) { return this.proxy.invoke(t => t.accountGetRatedMovies(req)); }
    accountGetRatedTVShows(req) { return this.proxy.invoke(t => t.accountGetRatedTVShows(req)); }
    accountGetTVShowRecommendations(req) { return this.proxy.invoke(t => t.accountGetTVShowRecommendations(req)); }
    accountGetTVShowWatchlist(req) { return this.proxy.invoke(t => t.accountGetTVShowWatchlist(req)); }
    authCreateAccessToken(req) { return this.proxy.invoke(t => t.authCreateAccessToken(req)); }
    authCreateRequestToken(req) { return this.proxy.invoke(t => t.authCreateRequestToken(req)); }
    authDeleteAccessToken(req) { return this.proxy.invoke(t => t.authDeleteAccessToken(req)); }
    listAddItems(req) { return this.proxy.invoke(t => t.listAddItems(req)); }
    listCheckItemStatus(req) { return this.proxy.invoke(t => t.listCheckItemStatus(req)); }
    listClearList(req) { return this.proxy.invoke(t => t.listClearList(req)); }
    listCreateList(req) { return this.proxy.invoke(t => t.listCreateList(req)); }
    listDeleteList(req) { return this.proxy.invoke(t => t.listDeleteList(req)); }
    listGetList(req) { return this.proxy.invoke(t => t.listGetList(req)); }
    listRemoveItems(req) { return this.proxy.invoke(t => t.listRemoveItems(req)); }
    listUpdateItems(req) { return this.proxy.invoke(t => t.listUpdateItems(req)); }
    listUpdateList(req) { return this.proxy.invoke(t => t.listUpdateList(req)); }
}
exports.TmdbV4Client = TmdbV4Client;
//# sourceMappingURL=client.js.map