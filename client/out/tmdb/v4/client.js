"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
var TmdbV4Client = (function () {
    function TmdbV4Client() {
        this.proxy = new proxy_1.TmdbV4Proxy();
    }
    Object.defineProperty(TmdbV4Client.prototype, "base_url", {
        get: function () { return this.proxy.base_url; },
        set: function (value) { this.proxy.base_url = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmdbV4Client.prototype, "read_access_token", {
        get: function () { return this.proxy.read_access_token; },
        set: function (value) { this.proxy.read_access_token = value; },
        enumerable: true,
        configurable: true
    });
    TmdbV4Client.prototype.accountGetFavoriteMovies = function (req) { return this.proxy.invoke(function (t) { return t.accountGetFavoriteMovies(req); }); };
    TmdbV4Client.prototype.accountGetFavoriteTVShows = function (req) { return this.proxy.invoke(function (t) { return t.accountGetFavoriteTVShows(req); }); };
    TmdbV4Client.prototype.accountGetLists = function (req) { return this.proxy.invoke(function (t) { return t.accountGetLists(req); }); };
    TmdbV4Client.prototype.accountGetMovieRecommendations = function (req) { return this.proxy.invoke(function (t) { return t.accountGetMovieRecommendations(req); }); };
    TmdbV4Client.prototype.accountGetMovieWatchlist = function (req) { return this.proxy.invoke(function (t) { return t.accountGetMovieWatchlist(req); }); };
    TmdbV4Client.prototype.accountGetRatedMovies = function (req) { return this.proxy.invoke(function (t) { return t.accountGetRatedMovies(req); }); };
    TmdbV4Client.prototype.accountGetRatedTVShows = function (req) { return this.proxy.invoke(function (t) { return t.accountGetRatedTVShows(req); }); };
    TmdbV4Client.prototype.accountGetTVShowRecommendations = function (req) { return this.proxy.invoke(function (t) { return t.accountGetTVShowRecommendations(req); }); };
    TmdbV4Client.prototype.accountGetTVShowWatchlist = function (req) { return this.proxy.invoke(function (t) { return t.accountGetTVShowWatchlist(req); }); };
    TmdbV4Client.prototype.authCreateAccessToken = function (req) { return this.proxy.invoke(function (t) { return t.authCreateAccessToken(req); }); };
    TmdbV4Client.prototype.authCreateRequestToken = function (req) { return this.proxy.invoke(function (t) { return t.authCreateRequestToken(req); }); };
    TmdbV4Client.prototype.authDeleteAccessToken = function (req) { return this.proxy.invoke(function (t) { return t.authDeleteAccessToken(req); }); };
    TmdbV4Client.prototype.listAddItems = function (req) { return this.proxy.invoke(function (t) { return t.listAddItems(req); }); };
    TmdbV4Client.prototype.listCheckItemStatus = function (req) { return this.proxy.invoke(function (t) { return t.listCheckItemStatus(req); }); };
    TmdbV4Client.prototype.listClearList = function (req) { return this.proxy.invoke(function (t) { return t.listClearList(req); }); };
    TmdbV4Client.prototype.listCreateList = function (req) { return this.proxy.invoke(function (t) { return t.listCreateList(req); }); };
    TmdbV4Client.prototype.listDeleteList = function (req) { return this.proxy.invoke(function (t) { return t.listDeleteList(req); }); };
    TmdbV4Client.prototype.listGetList = function (req) { return this.proxy.invoke(function (t) { return t.listGetList(req); }); };
    TmdbV4Client.prototype.listRemoveItems = function (req) { return this.proxy.invoke(function (t) { return t.listRemoveItems(req); }); };
    TmdbV4Client.prototype.listUpdateItems = function (req) { return this.proxy.invoke(function (t) { return t.listUpdateItems(req); }); };
    TmdbV4Client.prototype.listUpdateList = function (req) { return this.proxy.invoke(function (t) { return t.listUpdateList(req); }); };
    return TmdbV4Client;
}());
exports.TmdbV4Client = TmdbV4Client;
//# sourceMappingURL=client.js.map