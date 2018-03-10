"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
var TmdbV3Client = (function () {
    function TmdbV3Client() {
        this.proxy = new proxy_1.TmdbV3Proxy();
    }
    Object.defineProperty(TmdbV3Client.prototype, "base_url", {
        get: function () { return this.proxy.base_url; },
        set: function (value) { this.proxy.base_url = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmdbV3Client.prototype, "api_key", {
        get: function () { return this.proxy.api_key; },
        set: function (value) { this.proxy.api_key = value; },
        enumerable: true,
        configurable: true
    });
    TmdbV3Client.prototype.getApiConfiguration = function (req) { return this.proxy.invoke(function (t) { return t.getApiConfiguration(req); }); };
    TmdbV3Client.prototype.searchMovies = function (req) { return this.proxy.invoke(function (t) { return t.searchMovies(req); }); };
    TmdbV3Client.prototype.searchTvShows = function (req) { return this.proxy.invoke(function (t) { return t.searchTvShows(req); }); };
    TmdbV3Client.prototype.movieGetPopular = function (req) { return this.proxy.invoke(function (t) { return t.movieGetPopular(req); }); };
    TmdbV3Client.prototype.tvGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.tvGetDetails(req); }); };
    TmdbV3Client.prototype.searchMulti = function (req) { return this.proxy.invoke(function (t) { return t.searchMulti(req); }); };
    TmdbV3Client.prototype.accountAddtoWatchlist = function (req) { return this.proxy.invoke(function (t) { return t.accountAddtoWatchlist(req); }); };
    TmdbV3Client.prototype.accountGetCreatedLists = function (req) { return this.proxy.invoke(function (t) { return t.accountGetCreatedLists(req); }); };
    TmdbV3Client.prototype.accountGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.accountGetDetails(req); }); };
    TmdbV3Client.prototype.accountGetFavoriteMovies = function (req) { return this.proxy.invoke(function (t) { return t.accountGetFavoriteMovies(req); }); };
    TmdbV3Client.prototype.accountGetFavoriteTVShows = function (req) { return this.proxy.invoke(function (t) { return t.accountGetFavoriteTVShows(req); }); };
    TmdbV3Client.prototype.accountGetMovieWatchlist = function (req) { return this.proxy.invoke(function (t) { return t.accountGetMovieWatchlist(req); }); };
    TmdbV3Client.prototype.accountGetRatedMovies = function (req) { return this.proxy.invoke(function (t) { return t.accountGetRatedMovies(req); }); };
    TmdbV3Client.prototype.accountGetRatedTVEpisodes = function (req) { return this.proxy.invoke(function (t) { return t.accountGetRatedTVEpisodes(req); }); };
    TmdbV3Client.prototype.accountGetRatedTVShows = function (req) { return this.proxy.invoke(function (t) { return t.accountGetRatedTVShows(req); }); };
    TmdbV3Client.prototype.accountGetTVShowWatchlist = function (req) { return this.proxy.invoke(function (t) { return t.accountGetTVShowWatchlist(req); }); };
    TmdbV3Client.prototype.accountMarkasFavorite = function (req) { return this.proxy.invoke(function (t) { return t.accountMarkasFavorite(req); }); };
    TmdbV3Client.prototype.authenticationCreateGuestSession = function (req) { return this.proxy.invoke(function (t) { return t.authenticationCreateGuestSession(req); }); };
    TmdbV3Client.prototype.authenticationCreateRequestToken = function (req) { return this.proxy.invoke(function (t) { return t.authenticationCreateRequestToken(req); }); };
    TmdbV3Client.prototype.authenticationCreateSession = function (req) { return this.proxy.invoke(function (t) { return t.authenticationCreateSession(req); }); };
    TmdbV3Client.prototype.authenticationValidateRequestToken = function (req) { return this.proxy.invoke(function (t) { return t.authenticationValidateRequestToken(req); }); };
    TmdbV3Client.prototype.certificationGetMovieCertifications = function (req) { return this.proxy.invoke(function (t) { return t.certificationGetMovieCertifications(req); }); };
    TmdbV3Client.prototype.certificationGetTVCertifications = function (req) { return this.proxy.invoke(function (t) { return t.certificationGetTVCertifications(req); }); };
    TmdbV3Client.prototype.collectionGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.collectionGetDetails(req); }); };
    TmdbV3Client.prototype.collectionGetImages = function (req) { return this.proxy.invoke(function (t) { return t.collectionGetImages(req); }); };
    TmdbV3Client.prototype.companyGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.companyGetDetails(req); }); };
    TmdbV3Client.prototype.companyGetMovies = function (req) { return this.proxy.invoke(function (t) { return t.companyGetMovies(req); }); };
    TmdbV3Client.prototype.creditGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.creditGetDetails(req); }); };
    TmdbV3Client.prototype.discoverMovieDiscover = function (req) { return this.proxy.invoke(function (t) { return t.discoverMovieDiscover(req); }); };
    TmdbV3Client.prototype.discoverTVDiscover = function (req) { return this.proxy.invoke(function (t) { return t.discoverTVDiscover(req); }); };
    TmdbV3Client.prototype.findFindbyID = function (req) { return this.proxy.invoke(function (t) { return t.findFindbyID(req); }); };
    TmdbV3Client.prototype.genreGetMovieList = function (req) { return this.proxy.invoke(function (t) { return t.genreGetMovieList(req); }); };
    TmdbV3Client.prototype.genreGetMovies = function (req) { return this.proxy.invoke(function (t) { return t.genreGetMovies(req); }); };
    TmdbV3Client.prototype.genreGetTVList = function (req) { return this.proxy.invoke(function (t) { return t.genreGetTVList(req); }); };
    TmdbV3Client.prototype.guest_sessionGetRatedMovies = function (req) { return this.proxy.invoke(function (t) { return t.guest_sessionGetRatedMovies(req); }); };
    TmdbV3Client.prototype.guest_sessionGetRatedTVEpisodes = function (req) { return this.proxy.invoke(function (t) { return t.guest_sessionGetRatedTVEpisodes(req); }); };
    TmdbV3Client.prototype.guest_sessionGetRatedTVShows = function (req) { return this.proxy.invoke(function (t) { return t.guest_sessionGetRatedTVShows(req); }); };
    TmdbV3Client.prototype.jobGetJobs = function (req) { return this.proxy.invoke(function (t) { return t.jobGetJobs(req); }); };
    TmdbV3Client.prototype.keywordGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.keywordGetDetails(req); }); };
    TmdbV3Client.prototype.keywordGetMovies = function (req) { return this.proxy.invoke(function (t) { return t.keywordGetMovies(req); }); };
    TmdbV3Client.prototype.listAddMovie = function (req) { return this.proxy.invoke(function (t) { return t.listAddMovie(req); }); };
    TmdbV3Client.prototype.listCheckItemStatus = function (req) { return this.proxy.invoke(function (t) { return t.listCheckItemStatus(req); }); };
    TmdbV3Client.prototype.listClearList = function (req) { return this.proxy.invoke(function (t) { return t.listClearList(req); }); };
    TmdbV3Client.prototype.listCreateList = function (req) { return this.proxy.invoke(function (t) { return t.listCreateList(req); }); };
    TmdbV3Client.prototype.listGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.listGetDetails(req); }); };
    TmdbV3Client.prototype.listRemoveMovie = function (req) { return this.proxy.invoke(function (t) { return t.listRemoveMovie(req); }); };
    TmdbV3Client.prototype.movieDeleteRating = function (req) { return this.proxy.invoke(function (t) { return t.movieDeleteRating(req); }); };
    TmdbV3Client.prototype.movieGetAccountStates = function (req) { return this.proxy.invoke(function (t) { return t.movieGetAccountStates(req); }); };
    TmdbV3Client.prototype.movieGetAlternativeTitles = function (req) { return this.proxy.invoke(function (t) { return t.movieGetAlternativeTitles(req); }); };
    TmdbV3Client.prototype.movieGetChanges = function (req) { return this.proxy.invoke(function (t) { return t.movieGetChanges(req); }); };
    TmdbV3Client.prototype.movieGetCredits = function (req) { return this.proxy.invoke(function (t) { return t.movieGetCredits(req); }); };
    TmdbV3Client.prototype.movieGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.movieGetDetails(req); }); };
    TmdbV3Client.prototype.movieGetImages = function (req) { return this.proxy.invoke(function (t) { return t.movieGetImages(req); }); };
    TmdbV3Client.prototype.movieGetKeywords = function (req) { return this.proxy.invoke(function (t) { return t.movieGetKeywords(req); }); };
    TmdbV3Client.prototype.movieGetLatest = function (req) { return this.proxy.invoke(function (t) { return t.movieGetLatest(req); }); };
    TmdbV3Client.prototype.movieGetLists = function (req) { return this.proxy.invoke(function (t) { return t.movieGetLists(req); }); };
    TmdbV3Client.prototype.movieGetMovieChangeList = function (req) { return this.proxy.invoke(function (t) { return t.movieGetMovieChangeList(req); }); };
    TmdbV3Client.prototype.movieGetNowPlaying = function (req) { return this.proxy.invoke(function (t) { return t.movieGetNowPlaying(req); }); };
    TmdbV3Client.prototype.movieGetRecommendations = function (req) { return this.proxy.invoke(function (t) { return t.movieGetRecommendations(req); }); };
    TmdbV3Client.prototype.movieGetReleaseDates = function (req) { return this.proxy.invoke(function (t) { return t.movieGetReleaseDates(req); }); };
    TmdbV3Client.prototype.movieGetReviews = function (req) { return this.proxy.invoke(function (t) { return t.movieGetReviews(req); }); };
    TmdbV3Client.prototype.movieGetSimilarMovies = function (req) { return this.proxy.invoke(function (t) { return t.movieGetSimilarMovies(req); }); };
    TmdbV3Client.prototype.movieGetTopRated = function (req) { return this.proxy.invoke(function (t) { return t.movieGetTopRated(req); }); };
    TmdbV3Client.prototype.movieGetTranslations = function (req) { return this.proxy.invoke(function (t) { return t.movieGetTranslations(req); }); };
    TmdbV3Client.prototype.movieGetUpcoming = function (req) { return this.proxy.invoke(function (t) { return t.movieGetUpcoming(req); }); };
    TmdbV3Client.prototype.movieGetVideos = function (req) { return this.proxy.invoke(function (t) { return t.movieGetVideos(req); }); };
    TmdbV3Client.prototype.movieRateMovie = function (req) { return this.proxy.invoke(function (t) { return t.movieRateMovie(req); }); };
    TmdbV3Client.prototype.networkGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.networkGetDetails(req); }); };
    TmdbV3Client.prototype.personGetChanges = function (req) { return this.proxy.invoke(function (t) { return t.personGetChanges(req); }); };
    TmdbV3Client.prototype.personGetCombinedCredits = function (req) { return this.proxy.invoke(function (t) { return t.personGetCombinedCredits(req); }); };
    TmdbV3Client.prototype.personGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.personGetDetails(req); }); };
    TmdbV3Client.prototype.personGetExternalIDs = function (req) { return this.proxy.invoke(function (t) { return t.personGetExternalIDs(req); }); };
    TmdbV3Client.prototype.personGetImages = function (req) { return this.proxy.invoke(function (t) { return t.personGetImages(req); }); };
    TmdbV3Client.prototype.personGetLatest = function (req) { return this.proxy.invoke(function (t) { return t.personGetLatest(req); }); };
    TmdbV3Client.prototype.personGetMovieCredits = function (req) { return this.proxy.invoke(function (t) { return t.personGetMovieCredits(req); }); };
    TmdbV3Client.prototype.personGetPersonChangeList = function (req) { return this.proxy.invoke(function (t) { return t.personGetPersonChangeList(req); }); };
    TmdbV3Client.prototype.personGetPopular = function (req) { return this.proxy.invoke(function (t) { return t.personGetPopular(req); }); };
    TmdbV3Client.prototype.personGetTaggedImages = function (req) { return this.proxy.invoke(function (t) { return t.personGetTaggedImages(req); }); };
    TmdbV3Client.prototype.personGetTVCredits = function (req) { return this.proxy.invoke(function (t) { return t.personGetTVCredits(req); }); };
    TmdbV3Client.prototype.reviewGetDetails = function (req) { return this.proxy.invoke(function (t) { return t.reviewGetDetails(req); }); };
    TmdbV3Client.prototype.searchSearchCollections = function (req) { return this.proxy.invoke(function (t) { return t.searchSearchCollections(req); }); };
    TmdbV3Client.prototype.searchSearchCompanies = function (req) { return this.proxy.invoke(function (t) { return t.searchSearchCompanies(req); }); };
    TmdbV3Client.prototype.searchSearchKeywords = function (req) { return this.proxy.invoke(function (t) { return t.searchSearchKeywords(req); }); };
    TmdbV3Client.prototype.searchSearchPeople = function (req) { return this.proxy.invoke(function (t) { return t.searchSearchPeople(req); }); };
    TmdbV3Client.prototype.timezonesGetList = function (req) { return this.proxy.invoke(function (t) { return t.timezonesGetList(req); }); };
    TmdbV3Client.prototype.tvDeleteRating = function (req) { return this.proxy.invoke(function (t) { return t.tvDeleteRating(req); }); };
    TmdbV3Client.prototype.tvDeleteRating2 = function (req) { return this.proxy.invoke(function (t) { return t.tvDeleteRating2(req); }); };
    TmdbV3Client.prototype.tvGetAccountStates = function (req) { return this.proxy.invoke(function (t) { return t.tvGetAccountStates(req); }); };
    TmdbV3Client.prototype.tvGetAccountStates2 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetAccountStates2(req); }); };
    TmdbV3Client.prototype.tvGetAccountStates3 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetAccountStates3(req); }); };
    TmdbV3Client.prototype.tvGetAlternativeTitles = function (req) { return this.proxy.invoke(function (t) { return t.tvGetAlternativeTitles(req); }); };
    TmdbV3Client.prototype.tvGetChanges = function (req) { return this.proxy.invoke(function (t) { return t.tvGetChanges(req); }); };
    TmdbV3Client.prototype.tvGetChanges2 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetChanges2(req); }); };
    TmdbV3Client.prototype.tvGetChanges3 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetChanges3(req); }); };
    TmdbV3Client.prototype.tvGetContentRatings = function (req) { return this.proxy.invoke(function (t) { return t.tvGetContentRatings(req); }); };
    TmdbV3Client.prototype.tvGetCredits = function (req) { return this.proxy.invoke(function (t) { return t.tvGetCredits(req); }); };
    TmdbV3Client.prototype.tvGetCredits2 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetCredits2(req); }); };
    TmdbV3Client.prototype.tvGetCredits3 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetCredits3(req); }); };
    TmdbV3Client.prototype.tvGetSeason = function (req) { return this.proxy.invoke(function (t) { return t.tvGetSeason(req); }); };
    TmdbV3Client.prototype.tvGetDetails3 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetDetails3(req); }); };
    TmdbV3Client.prototype.tvGetExternalIDs = function (req) { return this.proxy.invoke(function (t) { return t.tvGetExternalIDs(req); }); };
    TmdbV3Client.prototype.tvGetExternalIDs2 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetExternalIDs2(req); }); };
    TmdbV3Client.prototype.tvGetImages = function (req) { return this.proxy.invoke(function (t) { return t.tvGetImages(req); }); };
    TmdbV3Client.prototype.tvGetImages2 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetImages2(req); }); };
    TmdbV3Client.prototype.tvGetImages3 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetImages3(req); }); };
    TmdbV3Client.prototype.tvGetKeywords = function (req) { return this.proxy.invoke(function (t) { return t.tvGetKeywords(req); }); };
    TmdbV3Client.prototype.tvGetLatest = function (req) { return this.proxy.invoke(function (t) { return t.tvGetLatest(req); }); };
    TmdbV3Client.prototype.tvGetPopular = function (req) { return this.proxy.invoke(function (t) { return t.tvGetPopular(req); }); };
    TmdbV3Client.prototype.tvGetRecommendations = function (req) { return this.proxy.invoke(function (t) { return t.tvGetRecommendations(req); }); };
    TmdbV3Client.prototype.tvGetSimilarTVShows = function (req) { return this.proxy.invoke(function (t) { return t.tvGetSimilarTVShows(req); }); };
    TmdbV3Client.prototype.tvGetTopRated = function (req) { return this.proxy.invoke(function (t) { return t.tvGetTopRated(req); }); };
    TmdbV3Client.prototype.tvGetTranslations = function (req) { return this.proxy.invoke(function (t) { return t.tvGetTranslations(req); }); };
    TmdbV3Client.prototype.tvGetTVAiringToday = function (req) { return this.proxy.invoke(function (t) { return t.tvGetTVAiringToday(req); }); };
    TmdbV3Client.prototype.tvGetTVChangeList = function (req) { return this.proxy.invoke(function (t) { return t.tvGetTVChangeList(req); }); };
    TmdbV3Client.prototype.tvGetTVEpisodeExternalIDs = function (req) { return this.proxy.invoke(function (t) { return t.tvGetTVEpisodeExternalIDs(req); }); };
    TmdbV3Client.prototype.tvGetTVOnTheAir = function (req) { return this.proxy.invoke(function (t) { return t.tvGetTVOnTheAir(req); }); };
    TmdbV3Client.prototype.tvGetVideos = function (req) { return this.proxy.invoke(function (t) { return t.tvGetVideos(req); }); };
    TmdbV3Client.prototype.tvGetVideos2 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetVideos2(req); }); };
    TmdbV3Client.prototype.tvGetVideos3 = function (req) { return this.proxy.invoke(function (t) { return t.tvGetVideos3(req); }); };
    TmdbV3Client.prototype.tvRateTVEpisode = function (req) { return this.proxy.invoke(function (t) { return t.tvRateTVEpisode(req); }); };
    TmdbV3Client.prototype.tvRateTVShow = function (req) { return this.proxy.invoke(function (t) { return t.tvRateTVShow(req); }); };
    return TmdbV3Client;
}());
exports.TmdbV3Client = TmdbV3Client;
//# sourceMappingURL=client.js.map