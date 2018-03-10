"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MyModule;
(function (MyModule) {
    MyModule.Metadata = {
        "tvGetChanges": "/tv/episode/{episode_id}/changes",
        "tvGetAccountStates": "/tv/{tv_id}/account_states",
        "personGetPopular": "/person/popular",
        "movieGetDetails": "/movie/{movie_id}",
        "tvGetAccountStates2": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/account_states",
        "movieRateMovie": "/movie/{movie_id}/rating",
        "movieDeleteRating": "/movie/{movie_id}/rating",
        "tvGetImages": "/tv/{tv_id}/images",
        "movieGetMovieChangeList": "/movie/changes",
        "personGetPersonChangeList": "/person/changes",
        "discoverMovieDiscover": "/discover/movie",
        "authenticationCreateSession": "/authentication/session/new",
        "certificationGetTVCertifications": "/certification/tv/list",
        "authenticationCreateGuestSession": "/authentication/guest_session/new",
        "accountGetTVShowWatchlist": "/account/{account_id}/watchlist/tv",
        "tvGetChanges2": "/tv/{tv_id}/changes",
        "accountGetFavoriteMovies": "/account/{account_id}/favorite/movies",
        "tvGetTVEpisodeExternalIDs": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/external_ids",
        "personGetExternalIDs": "/person/{person_id}/external_ids",
        "movieGetRecommendations": "/movie/{movie_id}/recommendations",
        "movieGetLatest": "/movie/latest",
        "tvGetExternalIDs": "/tv/{tv_id}/season/{season_number}/external_ids",
        "accountGetCreatedLists": "/account/{account_id}/lists",
        "tvGetContentRatings": "/tv/{tv_id}/content_ratings",
        "personGetTVCredits": "/person/{person_id}/tv_credits",
        "tvGetSimilarTVShows": "/tv/{tv_id}/similar",
        "findFindbyID": "/find/{external_id}",
        "movieGetVideos": "/movie/{movie_id}/videos",
        "keywordGetMovies": "/keyword/{keyword_id}/movies",
        "tvGetDetails": "/tv/{tv_id}",
        "personGetCombinedCredits": "/person/{person_id}/combined_credits",
        "tvGetCredits": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/credits",
        "personGetDetails": "/person/{person_id}",
        "personGetMovieCredits": "/person/{person_id}/movie_credits",
        "tvRateTVEpisode": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/rating",
        "tvDeleteRating": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/rating",
        "movieGetAccountStates": "/movie/{movie_id}/account_states",
        "movieGetImages": "/movie/{movie_id}/images",
        "tvGetAccountStates3": "/tv/{tv_id}/season/{season_number}/account_states",
        "movieGetReviews": "/movie/{movie_id}/reviews",
        "movieGetReleaseDates": "/movie/{movie_id}/release_dates",
        "collectionGetDetails": "/collection/{collection_id}",
        "tvGetTVAiringToday": "/tv/airing_today",
        "companyGetMovies": "/company/{company_id}/movies",
        "tvGetVideos": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/videos",
        "configurationGetAPIConfiguration": "/configuration",
        "movieGetChanges": "/movie/{movie_id}/changes",
        "accountGetFavoriteTVShows": "/account/{account_id}/favorite/tv",
        "reviewGetDetails": "/review/{review_id}",
        "tvGetTVChangeList": "/tv/changes",
        "jobGetJobs": "/job/list",
        "listGetDetails": "/list/{list_id}",
        "tvGetPopular": "/tv/popular",
        "creditGetDetails": "/credit/{credit_id}",
        "movieGetSimilarMovies": "/movie/{movie_id}/similar",
        "movieGetNowPlaying": "/movie/now_playing",
        "personGetLatest": "/person/latest",
        "searchSearchMovies": "/search/movie",
        "genreGetMovieList": "/genre/movie/list",
        "listAddMovie": "/list/{list_id}/add_item",
        "tvGetDetails2": "/tv/{tv_id}/season/{season_number}",
        "collectionGetImages": "/collection/{collection_id}/images",
        "accountAddtoWatchlist": "/account/{account_id}/watchlist",
        "searchSearchTVShows": "/search/tv",
        "accountGetRatedMovies": "/account/{account_id}/rated/movies",
        "tvGetVideos2": "/tv/{tv_id}/videos",
        "networkGetDetails": "/network/{network_id}",
        "genreGetTVList": "/genre/tv/list",
        "listCheckItemStatus": "/list/{list_id}/item_status",
        "movieGetAlternativeTitles": "/movie/{movie_id}/alternative_titles",
        "companyGetDetails": "/company/{company_id}",
        "tvGetImages2": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/images",
        "movieGetKeywords": "/movie/{movie_id}/keywords",
        "tvGetDetails3": "/tv/{tv_id}/season/{season_number}/episode/{episode_number}",
        "movieGetUpcoming": "/movie/upcoming",
        "tvGetCredits2": "/tv/{tv_id}/season/{season_number}/credits",
        "certificationGetMovieCertifications": "/certification/movie/list",
        "tvRateTVShow": "/tv/{tv_id}/rating",
        "tvDeleteRating2": "/tv/{tv_id}/rating",
        "accountGetMovieWatchlist": "/account/{account_id}/watchlist/movies",
        "searchSearchCollections": "/search/collection",
        "listClearList": "/list/{list_id}/clear",
        "genreGetMovies": "/genre/{genre_id}/movies",
        "listCreateList": "/list",
        "timezonesGetList": "/timezones/list",
        "discoverTVDiscover": "/discover/tv",
        "searchSearchCompanies": "/search/company",
        "authenticationValidateRequestToken": "/authentication/token/validate_with_login",
        "personGetChanges": "/person/{person_id}/changes",
        "accountGetRatedTVEpisodes": "/account/{account_id}/rated/tv/episodes",
        "tvGetVideos3": "/tv/{tv_id}/season/{season_number}/videos",
        "movieGetPopular": "/movie/popular",
        "tvGetTopRated": "/tv/top_rated",
        "searchSearchPeople": "/search/person",
        "tvGetImages3": "/tv/{tv_id}/season/{season_number}/images",
        "guest_sessionGetRatedMovies": "/guest_session/{guest_session_id}/rated/movies",
        "authenticationCreateRequestToken": "/authentication/token/new",
        "tvGetLatest": "/tv/latest",
        "movieGetCredits": "/movie/{movie_id}/credits",
        "tvGetRecommendations": "/tv/{tv_id}/recommendations",
        "searchSearchKeywords": "/search/keyword",
        "guest_sessionGetRatedTVEpisodes": "/guest_session/{guest_session_id}/rated/tv/episodes",
        "searchMultiSearch": "/search/multi",
        "guest_sessionGetRatedTVShows": "/guest_session/{guest_session_id}/rated/tv",
        "personGetImages": "/person/{person_id}/images",
        "accountGetRatedTVShows": "/account/{account_id}/rated/tv",
        "tvGetTranslations": "/tv/{tv_id}/translations",
        "tvGetKeywords": "/tv/{tv_id}/keywords",
        "tvGetCredits3": "/tv/{tv_id}/credits",
        "tvGetAlternativeTitles": "/tv/{tv_id}/alternative_titles",
        "tvGetExternalIDs2": "/tv/{tv_id}/external_ids",
        "listRemoveMovie": "/list/{list_id}/remove_item",
        "accountMarkasFavorite": "/account/{account_id}/favorite",
        "personGetTaggedImages": "/person/{person_id}/tagged_images",
        "movieGetLists": "/movie/{movie_id}/lists",
        "tvGetChanges3": "/tv/season/{season_id}/changes",
        "movieGetTopRated": "/movie/top_rated",
        "keywordGetDetails": "/keyword/{keyword_id}",
        "tvGetTVOnTheAir": "/tv/on_the_air",
        "movieGetTranslations": "/movie/{movie_id}/translations",
        "accountGetDetails": "/account"
    };
})(MyModule = exports.MyModule || (exports.MyModule = {}));
