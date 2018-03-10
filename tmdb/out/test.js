"use strict";
/// <reference path="../../client/lib/corex-js/corex.d.ts" />
require("../../client/lib/corex-js/corex");
var proxy_1 = require("./proxy");
var XMLHttpRequest = require("xhr2");
//process.on("uncaughtException", e=>console.log(e));
//process.on("unhandledRejection", e=>console.log(e));
var x = new proxy_1.Proxy();
x.onInvoke = function (pc) {
    console.log({ pc: pc });
    var url = 'https://api.themoviedb.org/3' + '/movie/latest';
    var prms = { api_key: '16a856dff4d1db46782e6132610ddb32' };
    return xhr2({ url: url, params: prms })
        .then(function (e) { return console.log(e); });
};
x.invoke(function (t) { return t.getMovieLatest(); });
function xhr2(opts) {
    return new Promise(function (resolve, reject) {
        var url = opts.url;
        var remaining = {};
        if (opts.params != null) {
            Object.keys(opts.params).forEach(function (key) {
                var placeholder = "{" + key + "}";
                if (url.contains(placeholder)) {
                    url.replace(placeholder, encodeURIComponent(opts.params[key]));
                }
                else {
                    remaining[key] = opts.params[key];
                }
            });
            var query = Object.keys(remaining).map(function (key) { return key + "=" + encodeURIComponent(remaining[key]); }).join("&");
            url += "?" + query;
        }
        var xhr = new XMLHttpRequest();
        //console.log({ xhr });
        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 4)
                resolve(JSON.parse(xhr.responseText));
        });
        xhr.open("GET", url);
        xhr.send();
    });
}
exports.xhr2 = xhr2;
var map = {
    deleteMovieMovieIdRating: "/movie/{movie_id}/rating",
    deleteTvTvIdRating: "/tv/{tv_id}/rating",
    deleteTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberRating: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/rating",
    getAccount: "/account",
    getAccountAccountIdFavoriteMovies: "/account/{account_id}/favorite/movies",
    getAccountAccountIdFavoriteTv: "/account/{account_id}/favorite/tv",
    getAccountAccountIdLists: "/account/{account_id}/lists",
    getAccountAccountIdRatedMovies: "/account/{account_id}/rated/movies",
    getAccountAccountIdRatedTv: "/account/{account_id}/rated/tv",
    getAccountAccountIdRatedTvEpisodes: "/account/{account_id}/rated/tv/episodes",
    getAccountAccountIdWatchlistMovies: "/account/{account_id}/watchlist/movies",
    getAccountAccountIdWatchlistTv: "/account/{account_id}/watchlist/tv",
    getAuthenticationGuestSessionNew: "/authentication/guest_session/new",
    getAuthenticationSessionNew: "/authentication/session/new",
    getAuthenticationTokenNew: "/authentication/token/new",
    getAuthenticationTokenValidateWithLogin: "/authentication/token/validate_with_login",
    getCertificationMovieList: "/certification/movie/list",
    getCertificationTvList: "/certification/tv/list",
    getCollectionCollectionId: "/collection/{collection_id}",
    getCollectionCollectionIdImages: "/collection/{collection_id}/images",
    getCompanyCompanyId: "/company/{company_id}",
    getCompanyCompanyIdMovies: "/company/{company_id}/movies",
    getConfiguration: "/configuration",
    getCreditCreditId: "/credit/{credit_id}",
    getDiscoverMovie: "/discover/movie",
    getDiscoverTv: "/discover/tv",
    getFindExternalId: "/find/{external_id}",
    getGenreGenreIdMovies: "/genre/{genre_id}/movies",
    getGenreMovieList: "/genre/movie/list",
    getGenreTvList: "/genre/tv/list",
    getGuestSessionGuestSessionIdRatedMovies: "/guest_session/{guest_session_id}/rated/movies",
    getGuestSessionGuestSessionIdRatedTv: "/guest_session/{guest_session_id}/rated/tv",
    getGuestSessionGuestSessionIdRatedTvEpisodes: "/guest_session/{guest_session_id}/rated/tv/episodes",
    getJobList: "/job/list",
    getKeywordKeywordId: "/keyword/{keyword_id}",
    getKeywordKeywordIdMovies: "/keyword/{keyword_id}/movies",
    getListListId: "/list/{list_id}",
    getListListIdItemStatus: "/list/{list_id}/item_status",
    getMovieChanges: "/movie/changes",
    getMovieLatest: "/movie/latest",
    getMovieMovieId: "/movie/{movie_id}",
    getMovieMovieIdAccountStates: "/movie/{movie_id}/account_states",
    getMovieMovieIdAlternativeTitles: "/movie/{movie_id}/alternative_titles",
    getMovieMovieIdChanges: "/movie/{movie_id}/changes",
    getMovieMovieIdCredits: "/movie/{movie_id}/credits",
    getMovieMovieIdImages: "/movie/{movie_id}/images",
    getMovieMovieIdKeywords: "/movie/{movie_id}/keywords",
    getMovieMovieIdLists: "/movie/{movie_id}/lists",
    getMovieMovieIdRecommendations: "/movie/{movie_id}/recommendations",
    getMovieMovieIdReleaseDates: "/movie/{movie_id}/release_dates",
    getMovieMovieIdReviews: "/movie/{movie_id}/reviews",
    getMovieMovieIdSimilar: "/movie/{movie_id}/similar",
    getMovieMovieIdTranslations: "/movie/{movie_id}/translations",
    getMovieMovieIdVideos: "/movie/{movie_id}/videos",
    getMovieNowPlaying: "/movie/now_playing",
    getMoviePopular: "/movie/popular",
    getMovieTopRated: "/movie/top_rated",
    getMovieUpcoming: "/movie/upcoming",
    getNetworkNetworkId: "/network/{network_id}",
    getPersonChanges: "/person/changes",
    getPersonLatest: "/person/latest",
    getPersonPersonId: "/person/{person_id}",
    getPersonPersonIdChanges: "/person/{person_id}/changes",
    getPersonPersonIdCombinedCredits: "/person/{person_id}/combined_credits",
    getPersonPersonIdExternalIds: "/person/{person_id}/external_ids",
    getPersonPersonIdImages: "/person/{person_id}/images",
    getPersonPersonIdMovieCredits: "/person/{person_id}/movie_credits",
    getPersonPersonIdTaggedImages: "/person/{person_id}/tagged_images",
    getPersonPersonIdTvCredits: "/person/{person_id}/tv_credits",
    getPersonPopular: "/person/popular",
    getReviewReviewId: "/review/{review_id}",
    getSearchCollection: "/search/collection",
    getSearchCompany: "/search/company",
    getSearchKeyword: "/search/keyword",
    getSearchMovie: "/search/movie",
    getSearchMulti: "/search/multi",
    getSearchPerson: "/search/person",
    getSearchTv: "/search/tv",
    getTimezonesList: "/timezones/list",
    getTvAiringToday: "/tv/airing_today",
    getTvChanges: "/tv/changes",
    getTvEpisodeEpisodeIdChanges: "/tv/episode/{episode_id}/changes",
    getTvLatest: "/tv/latest",
    getTvOnTheAir: "/tv/on_the_air",
    getTvPopular: "/tv/popular",
    getTvSeasonSeasonIdChanges: "/tv/season/{season_id}/changes",
    getTvTopRated: "/tv/top_rated",
    getTvTvId: "/tv/{tv_id}",
    getTvTvIdAccountStates: "/tv/{tv_id}/account_states",
    getTvTvIdAlternativeTitles: "/tv/{tv_id}/alternative_titles",
    getTvTvIdChanges: "/tv/{tv_id}/changes",
    getTvTvIdContentRatings: "/tv/{tv_id}/content_ratings",
    getTvTvIdCredits: "/tv/{tv_id}/credits",
    getTvTvIdExternalIds: "/tv/{tv_id}/external_ids",
    getTvTvIdImages: "/tv/{tv_id}/images",
    getTvTvIdKeywords: "/tv/{tv_id}/keywords",
    getTvTvIdRecommendations: "/tv/{tv_id}/recommendations",
    getTvTvIdSeasonSeasonNumber: "/tv/{tv_id}/season/{season_number}",
    getTvTvIdSeasonSeasonNumberAccountStates: "/tv/{tv_id}/season/{season_number}/account_states",
    getTvTvIdSeasonSeasonNumberCredits: "/tv/{tv_id}/season/{season_number}/credits",
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumber: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}",
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberAccountStates: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/account_states",
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberCredits: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/credits",
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberExternalIds: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/external_ids",
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberImages: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/images",
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberVideos: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/videos",
    getTvTvIdSeasonSeasonNumberExternalIds: "/tv/{tv_id}/season/{season_number}/external_ids",
    getTvTvIdSeasonSeasonNumberImages: "/tv/{tv_id}/season/{season_number}/images",
    getTvTvIdSeasonSeasonNumberVideos: "/tv/{tv_id}/season/{season_number}/videos",
    getTvTvIdSimilar: "/tv/{tv_id}/similar",
    getTvTvIdTranslations: "/tv/{tv_id}/translations",
    getTvTvIdVideos: "/tv/{tv_id}/videos",
    postAccountAccountIdFavorite: "/account/{account_id}/favorite",
    postAccountAccountIdWatchlist: "/account/{account_id}/watchlist",
    postList: "/list",
    postListListIdAddItem: "/list/{list_id}/add_item",
    postListListIdClear: "/list/{list_id}/clear",
    postListListIdRemoveItem: "/list/{list_id}/remove_item",
    postMovieMovieIdRating: "/movie/{movie_id}/rating",
    postTvTvIdRating: "/tv/{tv_id}/rating",
    postTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberRating: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/rating",
};
