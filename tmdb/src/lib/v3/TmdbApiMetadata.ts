import * as tmdb from "../tmdb-v3"

export let TmdbApiMetadata: tmdb.ApiMd<tmdb.TmdbV3Api> = {
    tvGetChanges: { path: "/tv/episode/{episode_id}/changes", method: "GET" },
    tvGetAccountStates: { path: "/tv/{tv_id}/account_states", method: "GET" },
    personGetPopular: { path: "/person/popular", method: "GET" },
    movieGetDetails: { path: "/movie/{movie_id}", method: "GET" },
    tvGetAccountStates2: {
        path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/account_states",
        method: "GET",
    },
    movieRateMovie: { path: "/movie/{movie_id}/rating", method: "POST" },
    movieDeleteRating: { path: "/movie/{movie_id}/rating", method: "delete" },
    tvGetImages: { path: "/tv/{tv_id}/images", method: "GET" },
    movieGetMovieChangeList: { path: "/movie/changes", method: "GET" },
    personGetPersonChangeList: { path: "/person/changes", method: "GET" },
    discoverMovieDiscover: { path: "/discover/movie", method: "GET" },
    authenticationCreateSession: { path: "/authentication/session/new", method: "GET" },
    certificationGetTVCertifications: { path: "/certification/tv/list", method: "GET" },
    authenticationCreateGuestSession: { path: "/authentication/guest_session/new", method: "GET" },
    accountGetTVShowWatchlist: { path: "/account/{account_id}/watchlist/tv", method: "GET" },
    tvGetChanges2: { path: "/tv/{tv_id}/changes", method: "GET" },
    accountGetFavoriteMovies: { path: "/account/{account_id}/favorite/movies", method: "GET" },
    tvGetTVEpisodeExternalIDs: {
        path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/external_ids",
        method: "GET",
    },
    personGetExternalIDs: { path: "/person/{person_id}/external_ids", method: "GET" },
    movieGetRecommendations: { path: "/movie/{movie_id}/recommendations", method: "GET" },
    movieGetLatest: { path: "/movie/latest", method: "GET" },
    tvGetExternalIDs: { path: "/tv/{tv_id}/season/{season_number}/external_ids", method: "GET" },
    accountGetCreatedLists: { path: "/account/{account_id}/lists", method: "GET" },
    tvGetContentRatings: { path: "/tv/{tv_id}/content_ratings", method: "GET" },
    personGetTVCredits: { path: "/person/{person_id}/tv_credits", method: "GET" },
    tvGetSimilarTVShows: { path: "/tv/{tv_id}/similar", method: "GET" },
    findFindbyID: { path: "/find/{external_id}", method: "GET" },
    movieGetVideos: { path: "/movie/{movie_id}/videos", method: "GET" },
    keywordGetMovies: { path: "/keyword/{keyword_id}/movies", method: "GET" },
    tvGetDetails: { path: "/tv/{tv_id}", method: "GET" },
    personGetCombinedCredits: { path: "/person/{person_id}/combined_credits", method: "GET" },
    tvGetCredits: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/credits", method: "GET" },
    personGetDetails: { path: "/person/{person_id}", method: "GET" },
    personGetMovieCredits: { path: "/person/{person_id}/movie_credits", method: "GET" },
    tvRateTVEpisode: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/rating", method: "POST" },
    tvDeleteRating: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/rating", method: "delete" },
    movieGetAccountStates: { path: "/movie/{movie_id}/account_states", method: "GET" },
    movieGetImages: { path: "/movie/{movie_id}/images", method: "GET" },
    tvGetAccountStates3: { path: "/tv/{tv_id}/season/{season_number}/account_states", method: "GET" },
    movieGetReviews: { path: "/movie/{movie_id}/reviews", method: "GET" },
    movieGetReleaseDates: { path: "/movie/{movie_id}/release_dates", method: "GET" },
    collectionGetDetails: { path: "/collection/{collection_id}", method: "GET" },
    tvGetTVAiringToday: { path: "/tv/airing_today", method: "GET" },
    companyGetMovies: { path: "/company/{company_id}/movies", method: "GET" },
    tvGetVideos: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/videos", method: "GET" },
    getApiConfiguration: { path: "/configuration", method: "GET" },
    movieGetChanges: { path: "/movie/{movie_id}/changes", method: "GET" },
    accountGetFavoriteTVShows: { path: "/account/{account_id}/favorite/tv", method: "GET" },
    reviewGetDetails: { path: "/review/{review_id}", method: "GET" },
    tvGetTVChangeList: { path: "/tv/changes", method: "GET" },
    jobGetJobs: { path: "/job/list", method: "GET" },
    listGetDetails: { path: "/list/{list_id}", method: "GET" },
    tvGetPopular: { path: "/tv/popular", method: "GET" },
    creditGetDetails: { path: "/credit/{credit_id}", method: "GET" },
    movieGetSimilarMovies: { path: "/movie/{movie_id}/similar", method: "GET" },
    movieGetNowPlaying: { path: "/movie/now_playing", method: "GET" },
    personGetLatest: { path: "/person/latest", method: "GET" },
    searchMovies: { path: "/search/movie", method: "GET" },
    genreGetMovieList: { path: "/genre/movie/list", method: "GET" },
    listAddMovie: { path: "/list/{list_id}/add_item", method: "POST" },
    tvGetSeason: { path: "/tv/{tv_id}/season/{season_number}", method: "GET" },
    collectionGetImages: { path: "/collection/{collection_id}/images", method: "GET" },
    accountAddtoWatchlist: { path: "/account/{account_id}/watchlist", method: "POST" },
    searchTvShows: { path: "/search/tv", method: "GET" },
    accountGetRatedMovies: { path: "/account/{account_id}/rated/movies", method: "GET" },
    tvGetVideos2: { path: "/tv/{tv_id}/videos", method: "GET" },
    networkGetDetails: { path: "/network/{network_id}", method: "GET" },
    genreGetTVList: { path: "/genre/tv/list", method: "GET" },
    listCheckItemStatus: { path: "/list/{list_id}/item_status", method: "GET" },
    movieGetAlternativeTitles: { path: "/movie/{movie_id}/alternative_titles", method: "GET" },
    companyGetDetails: { path: "/company/{company_id}", method: "GET" },
    tvGetImages2: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/images", method: "GET" },
    movieGetKeywords: { path: "/movie/{movie_id}/keywords", method: "GET" },
    tvGetDetails3: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}", method: "GET" },
    movieGetUpcoming: { path: "/movie/upcoming", method: "GET" },
    tvGetCredits2: { path: "/tv/{tv_id}/season/{season_number}/credits", method: "GET" },
    certificationGetMovieCertifications: { path: "/certification/movie/list", method: "GET" },
    tvRateTVShow: { path: "/tv/{tv_id}/rating", method: "POST" },
    tvDeleteRating2: { path: "/tv/{tv_id}/rating", method: "delete" },
    accountGetMovieWatchlist: { path: "/account/{account_id}/watchlist/movies", method: "GET" },
    searchSearchCollections: { path: "/search/collection", method: "GET" },
    listClearList: { path: "/list/{list_id}/clear", method: "POST" },
    genreGetMovies: { path: "/genre/{genre_id}/movies", method: "GET" },
    listCreateList: { path: "/list", method: "POST" },
    timezonesGetList: { path: "/timezones/list", method: "GET" },
    discoverTVDiscover: { path: "/discover/tv", method: "GET" },
    searchSearchCompanies: { path: "/search/company", method: "GET" },
    authenticationValidateRequestToken: { path: "/authentication/token/validate_with_login", method: "GET" },
    personGetChanges: { path: "/person/{person_id}/changes", method: "GET" },
    accountGetRatedTVEpisodes: { path: "/account/{account_id}/rated/tv/episodes", method: "GET" },
    tvGetVideos3: { path: "/tv/{tv_id}/season/{season_number}/videos", method: "GET" },
    movieGetPopular: { path: "/movie/popular", method: "GET" },
    tvGetTopRated: { path: "/tv/top_rated", method: "GET" },
    searchSearchPeople: { path: "/search/person", method: "GET" },
    tvGetImages3: { path: "/tv/{tv_id}/season/{season_number}/images", method: "GET" },
    guest_sessionGetRatedMovies: { path: "/guest_session/{guest_session_id}/rated/movies", method: "GET" },
    authenticationCreateRequestToken: { path: "/authentication/token/new", method: "GET" },
    tvGetLatest: { path: "/tv/latest", method: "GET" },
    movieGetCredits: { path: "/movie/{movie_id}/credits", method: "GET" },
    tvGetRecommendations: { path: "/tv/{tv_id}/recommendations", method: "GET" },
    searchSearchKeywords: { path: "/search/keyword", method: "GET" },
    guest_sessionGetRatedTVEpisodes: { path: "/guest_session/{guest_session_id}/rated/tv/episodes", method: "GET" },
    searchMulti: { path: "/search/multi", method: "GET" },
    guest_sessionGetRatedTVShows: { path: "/guest_session/{guest_session_id}/rated/tv", method: "GET" },
    personGetImages: { path: "/person/{person_id}/images", method: "GET" },
    accountGetRatedTVShows: { path: "/account/{account_id}/rated/tv", method: "GET" },
    tvGetTranslations: { path: "/tv/{tv_id}/translations", method: "GET" },
    tvGetKeywords: { path: "/tv/{tv_id}/keywords", method: "GET" },
    tvGetCredits3: { path: "/tv/{tv_id}/credits", method: "GET" },
    tvGetAlternativeTitles: { path: "/tv/{tv_id}/alternative_titles", method: "GET" },
    tvGetExternalIDs2: { path: "/tv/{tv_id}/external_ids", method: "GET" },
    listRemoveMovie: { path: "/list/{list_id}/remove_item", method: "POST" },
    accountMarkasFavorite: { path: "/account/{account_id}/favorite", method: "POST" },
    personGetTaggedImages: { path: "/person/{person_id}/tagged_images", method: "GET" },
    movieGetLists: { path: "/movie/{movie_id}/lists", method: "GET" },
    tvGetChanges3: { path: "/tv/season/{season_id}/changes", method: "GET" },
    movieGetTopRated: { path: "/movie/top_rated", method: "GET" },
    keywordGetDetails: { path: "/keyword/{keyword_id}", method: "GET" },
    tvGetTVOnTheAir: { path: "/tv/on_the_air", method: "GET" },
    movieGetTranslations: { path: "/movie/{movie_id}/translations", method: "GET" },
    accountGetDetails: { path: "/account", method: "GET" },
}