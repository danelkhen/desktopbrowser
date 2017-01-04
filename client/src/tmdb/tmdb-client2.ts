import * as tmdb from "./tmdb-api"
import { TvShow, TmdbMovie, AccountRatedTVEpisode, Person, RatedMovie, RatedTvShow, ChangeList, PopularPerson, SessionRatedTVEpisode } from "./tmdb-api"
import { Proxy, } from "../utils/proxy"
import { TmdbApiClient } from "./tmdb-client"

export class TmdbApiClient2 {
    constructor() {
        this.proxy = new TmdbApiClient();
    }
    get base_url(): string { return this.proxy.base_url; }
    set base_url(value: string) { this.proxy.base_url = value; }
    get api_key(): string { return this.proxy.api_key; }
    set api_key(value: string) { this.proxy.api_key = value; }

    proxy: TmdbApiClient;
    getApiConfiguration(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.GetApiConfigurationResponse> { return this.proxy.invoke(t => t.getApiConfiguration(req)); }
    searchMovies(req: tmdb.SearchMoviesRequest): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.searchMovies(req)); }
    searchTvShows(req: tmdb.SearchSearchTVShowsRequest): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.searchTvShows(req)); }
    movieGetPopular(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.movieGetPopular(req)); }
    tvGetDetails(req: tmdb.TvGetDetailsRequest): Promise<tmdb.TmdbTvShowDetails> { return this.proxy.invoke(t => t.tvGetDetails(req)); }
    searchMulti(req: tmdb.SearchSearchPeopleRequestBase): Promise<tmdb.PagedResponse<TmdbMovie | TvShow | Person>> { return this.proxy.invoke(t => t.searchMulti(req)); }
    accountAddtoWatchlist(req: tmdb.AccountAddtoWatchlistRequestBase): Promise<any> { return this.proxy.invoke(t => t.accountAddtoWatchlist(req)); }
    accountGetCreatedLists(req: tmdb.AccountGetCreatedListsRequest): Promise<tmdb.PagedResponse<tmdb.AccountGetCreatedListsResponseItem>> { return this.proxy.invoke(t => t.accountGetCreatedLists(req)); }
    accountGetDetails(req: tmdb.AccountGetDetailsRequest): Promise<tmdb.AccountDetails> { return this.proxy.invoke(t => t.accountGetDetails(req)); }
    accountGetFavoriteMovies(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.accountGetFavoriteMovies(req)); }
    accountGetFavoriteTVShows(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.accountGetFavoriteTVShows(req)); }
    accountGetMovieWatchlist(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.accountGetMovieWatchlist(req)); }
    accountGetRatedMovies(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<RatedMovie>> { return this.proxy.invoke(t => t.accountGetRatedMovies(req)); }
    accountGetRatedTVEpisodes(req: tmdb.AccountGetRatedTVEpisodesRequest): Promise<tmdb.PagedResponse<AccountRatedTVEpisode>> { return this.proxy.invoke(t => t.accountGetRatedTVEpisodes(req)); }
    accountGetRatedTVShows(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<RatedTvShow>> { return this.proxy.invoke(t => t.accountGetRatedTVShows(req)); }
    accountGetTVShowWatchlist(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.accountGetTVShowWatchlist(req)); }
    accountMarkasFavorite(req: tmdb.AccountMarkAsFavoriteRequest): Promise<tmdb.Response> { return this.proxy.invoke(t => t.accountMarkasFavorite(req)); }
    authenticationCreateGuestSession(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.AuthenticationCreateGuestSessionResponse> { return this.proxy.invoke(t => t.authenticationCreateGuestSession(req)); }
    authenticationCreateRequestToken(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.AuthenticationCreateRequestTokenResponse> { return this.proxy.invoke(t => t.authenticationCreateRequestToken(req)); }
    authenticationCreateSession(req: tmdb.AuthenticationCreateSessionRequest): Promise<tmdb.AuthenticationCreateSessionResponse> { return this.proxy.invoke(t => t.authenticationCreateSession(req)); }
    authenticationValidateRequestToken(req: tmdb.AuthenticationValidateRequestTokenRequest): Promise<tmdb.AuthenticationValidateRequestTokenResponse> { return this.proxy.invoke(t => t.authenticationValidateRequestToken(req)); }
    certificationGetMovieCertifications(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.CertificationGetMovieCertificationsResponse> { return this.proxy.invoke(t => t.certificationGetMovieCertifications(req)); }
    certificationGetTVCertifications(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.CertificationGetTVCertificationsResponse> { return this.proxy.invoke(t => t.certificationGetTVCertifications(req)); }
    collectionGetDetails(req: tmdb.CollectionGetDetailsRequestBase): Promise<tmdb.CollectionGetDetailsResponse> { return this.proxy.invoke(t => t.collectionGetDetails(req)); }
    collectionGetImages(req: tmdb.CollectionGetDetailsRequestBase): Promise<tmdb.CollectionGetImagesResponse> { return this.proxy.invoke(t => t.collectionGetImages(req)); }
    companyGetDetails(req: tmdb.CompanyGetDetailsRequest): Promise<tmdb.CompanyGetDetailsResponse> { return this.proxy.invoke(t => t.companyGetDetails(req)); }
    companyGetMovies(req: tmdb.CompanyGetMoviesRequest): Promise<tmdb.KeywordGetMoviesResponseBase> { return this.proxy.invoke(t => t.companyGetMovies(req)); }
    creditGetDetails(req: tmdb.CreditGetDetailsRequest): Promise<tmdb.CreditGetDetailsResponse> { return this.proxy.invoke(t => t.creditGetDetails(req)); }
    discoverMovieDiscover(req: tmdb.DiscoverMovieDiscoverRequest): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.discoverMovieDiscover(req)); }
    discoverTVDiscover(req: tmdb.DiscoverTVDiscoverRequest): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.discoverTVDiscover(req)); }
    findFindbyID(req: tmdb.FindFindbyIDRequest): Promise<tmdb.FindFindbyIDResponse> { return this.proxy.invoke(t => t.findFindbyID(req)); }
    genreGetMovieList(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.GenreGetMovieListResponseBase> { return this.proxy.invoke(t => t.genreGetMovieList(req)); }
    genreGetMovies(req: tmdb.GenreGetMoviesRequest): Promise<tmdb.KeywordGetMoviesResponseBase> { return this.proxy.invoke(t => t.genreGetMovies(req)); }
    genreGetTVList(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.GenreGetMovieListResponseBase> { return this.proxy.invoke(t => t.genreGetTVList(req)); }
    guest_sessionGetRatedMovies(req: tmdb.Guest_sessionGetRatedMoviesRequestBase): Promise<tmdb.PagedResponse<RatedMovie>> { return this.proxy.invoke(t => t.guest_sessionGetRatedMovies(req)); }
    guest_sessionGetRatedTVEpisodes(req: tmdb.Guest_sessionGetRatedMoviesRequestBase): Promise<tmdb.PagedResponse<SessionRatedTVEpisode>> { return this.proxy.invoke(t => t.guest_sessionGetRatedTVEpisodes(req)); }
    guest_sessionGetRatedTVShows(req: tmdb.Guest_sessionGetRatedMoviesRequestBase): Promise<tmdb.PagedResponse<RatedTvShow>> { return this.proxy.invoke(t => t.guest_sessionGetRatedTVShows(req)); }
    jobGetJobs(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.JobGetJobsResponse> { return this.proxy.invoke(t => t.jobGetJobs(req)); }
    keywordGetDetails(req: tmdb.KeywordGetDetailsRequest): Promise<tmdb.Genre> { return this.proxy.invoke(t => t.keywordGetDetails(req)); }
    keywordGetMovies(req: tmdb.KeywordGetMoviesRequest): Promise<tmdb.KeywordGetMoviesResponseBase> { return this.proxy.invoke(t => t.keywordGetMovies(req)); }
    listAddMovie(req: tmdb.ListAddMovieRequestBase): Promise<any> { return this.proxy.invoke(t => t.listAddMovie(req)); }
    listCheckItemStatus(req: tmdb.ListCheckItemStatusRequest): Promise<tmdb.ListCheckItemStatusResponse> { return this.proxy.invoke(t => t.listCheckItemStatus(req)); }
    listClearList(req: tmdb.ListClearListRequest): Promise<any> { return this.proxy.invoke(t => t.listClearList(req)); }
    listCreateList(req: tmdb.ListCreateListRequest): Promise<tmdb.ListCreateListResponse> { return this.proxy.invoke(t => t.listCreateList(req)); }
    listGetDetails(req: tmdb.ListGetDetailsRequest): Promise<tmdb.ListDetails> { return this.proxy.invoke(t => t.listGetDetails(req)); }
    listRemoveMovie(req: tmdb.ListAddMovieRequestBase): Promise<tmdb.Response> { return this.proxy.invoke(t => t.listRemoveMovie(req)); }
    movieDeleteRating(req: tmdb.MovieDeleteRatingRequest): Promise<tmdb.Response> { return this.proxy.invoke(t => t.movieDeleteRating(req)); }
    movieGetAccountStates(req: tmdb.MovieGetAccountStatesRequest): Promise<tmdb.AccountStates> { return this.proxy.invoke(t => t.movieGetAccountStates(req)); }
    movieGetAlternativeTitles(req: tmdb.MovieGetAlternativeTitlesRequest): Promise<tmdb.MovieGetAlternativeTitlesResponse> { return this.proxy.invoke(t => t.movieGetAlternativeTitles(req)); }
    movieGetChanges(req: tmdb.MovieGetChangesRequest): Promise<tmdb.MovieGetChangesResponse> { return this.proxy.invoke(t => t.movieGetChanges(req)); }
    movieGetCredits(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetCreditsResponse> { return this.proxy.invoke(t => t.movieGetCredits(req)); }
    movieGetDetails(req: tmdb.MovieGetDetailsRequest): Promise<tmdb.TmdbMovieDetails> { return this.proxy.invoke(t => t.movieGetDetails(req)); }
    movieGetImages(req: tmdb.MovieGetImagesRequest): Promise<tmdb.MovieGetImagesResponse> { return this.proxy.invoke(t => t.movieGetImages(req)); }
    movieGetKeywords(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetKeywordsResponse> { return this.proxy.invoke(t => t.movieGetKeywords(req)); }
    movieGetLatest(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.MovieGetLatestResponse> { return this.proxy.invoke(t => t.movieGetLatest(req)); }
    movieGetLists(req: tmdb.MovieRequest): Promise<tmdb.MovieGetListsResponse> { return this.proxy.invoke(t => t.movieGetLists(req)); }
    movieGetMovieChangeList(req: tmdb.MovieGetMovieChangeListRequestBase): Promise<tmdb.PagedResponse<ChangeList>> { return this.proxy.invoke(t => t.movieGetMovieChangeList(req)); }
    movieGetNowPlaying(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.movieGetNowPlaying(req)); }
    movieGetRecommendations(req: tmdb.MovieRequest): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.movieGetRecommendations(req)); }
    movieGetReleaseDates(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetReleaseDatesResponse> { return this.proxy.invoke(t => t.movieGetReleaseDates(req)); }
    movieGetReviews(req: tmdb.MovieRequest): Promise<tmdb.MovieGetReviewsResponse> { return this.proxy.invoke(t => t.movieGetReviews(req)); }
    movieGetSimilarMovies(req: tmdb.MovieRequest): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.movieGetSimilarMovies(req)); }
    movieGetTopRated(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.movieGetTopRated(req)); }
    movieGetTranslations(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetTranslationsResponse> { return this.proxy.invoke(t => t.movieGetTranslations(req)); }
    movieGetUpcoming(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> { return this.proxy.invoke(t => t.movieGetUpcoming(req)); }
    movieGetVideos(req: tmdb.MovieGetVideosRequest): Promise<tmdb.GetVideosResponse> { return this.proxy.invoke(t => t.movieGetVideos(req)); }
    movieRateMovie(req: tmdb.MovieRateMovieRequest): Promise<any> { return this.proxy.invoke(t => t.movieRateMovie(req)); }
    networkGetDetails(req: tmdb.NetworkGetDetailsRequest): Promise<tmdb.Genre> { return this.proxy.invoke(t => t.networkGetDetails(req)); }
    personGetChanges(req: tmdb.PersonGetChangesRequest): Promise<tmdb.PersonGetChangesResponse> { return this.proxy.invoke(t => t.personGetChanges(req)); }
    personGetCombinedCredits(req: tmdb.PersonRequest): Promise<tmdb.PersonGetCombinedCreditsResponse> { return this.proxy.invoke(t => t.personGetCombinedCredits(req)); }
    personGetDetails(req: tmdb.PersonGetDetailsRequest): Promise<tmdb.Person> { return this.proxy.invoke(t => t.personGetDetails(req)); }
    personGetExternalIDs(req: tmdb.PersonRequest): Promise<tmdb.PersonGetExternalIDsResponse> { return this.proxy.invoke(t => t.personGetExternalIDs(req)); }
    personGetImages(req: tmdb.PersonGetImagesRequest): Promise<tmdb.PersonGetImagesResponse> { return this.proxy.invoke(t => t.personGetImages(req)); }
    personGetLatest(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.Person> { return this.proxy.invoke(t => t.personGetLatest(req)); }
    personGetMovieCredits(req: tmdb.PersonRequest): Promise<tmdb.PersonGetMovieCreditsResponse> { return this.proxy.invoke(t => t.personGetMovieCredits(req)); }
    personGetPersonChangeList(req: tmdb.MovieGetMovieChangeListRequestBase): Promise<tmdb.PagedResponse<ChangeList>> { return this.proxy.invoke(t => t.personGetPersonChangeList(req)); }
    personGetPopular(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<PopularPerson>> { return this.proxy.invoke(t => t.personGetPopular(req)); }
    personGetTaggedImages(req: tmdb.PersonGetTaggedImagesRequest): Promise<tmdb.PersonGetTaggedImagesResponse> { return this.proxy.invoke(t => t.personGetTaggedImages(req)); }
    personGetTVCredits(req: tmdb.PersonRequest): Promise<tmdb.PersonGetTVCreditsResponse> { return this.proxy.invoke(t => t.personGetTVCredits(req)); }
    reviewGetDetails(req: tmdb.ReviewGetDetailsRequest): Promise<tmdb.ReviewGetDetailsResponse> { return this.proxy.invoke(t => t.reviewGetDetails(req)); }
    searchSearchCollections(req: tmdb.SearchSearchCollectionsRequest): Promise<tmdb.SearchSearchCollectionsResponse> { return this.proxy.invoke(t => t.searchSearchCollections(req)); }
    searchSearchCompanies(req: tmdb.SearchSearchCompaniesRequestBase): Promise<tmdb.SearchSearchCompaniesResponse> { return this.proxy.invoke(t => t.searchSearchCompanies(req)); }
    searchSearchKeywords(req: tmdb.SearchSearchCompaniesRequestBase): Promise<tmdb.SearchSearchKeywordsResponse> { return this.proxy.invoke(t => t.searchSearchKeywords(req)); }
    searchSearchPeople(req: tmdb.SearchSearchPeopleRequestBase): Promise<tmdb.PagedResponse<PopularPerson>> { return this.proxy.invoke(t => t.searchSearchPeople(req)); }
    timezonesGetList(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.Unknown[]> { return this.proxy.invoke(t => t.timezonesGetList(req)); }
    tvDeleteRating(req: tmdb.TvDeleteRatingRequest): Promise<tmdb.Response> { return this.proxy.invoke(t => t.tvDeleteRating(req)); }
    tvDeleteRating2(req: tmdb.TvDeleteRating2Request): Promise<tmdb.Response> { return this.proxy.invoke(t => t.tvDeleteRating2(req)); }
    tvGetAccountStates(req: tmdb.TvGetAccountStatesRequest): Promise<tmdb.AccountStates> { return this.proxy.invoke(t => t.tvGetAccountStates(req)); }
    tvGetAccountStates2(req: tmdb.TvGetAccountStates2Request): Promise<tmdb.TvGetAccountStates2Response> { return this.proxy.invoke(t => t.tvGetAccountStates2(req)); }
    tvGetAccountStates3(req: tmdb.TvGetAccountStates3Request): Promise<tmdb.TvGetAccountStates3Response> { return this.proxy.invoke(t => t.tvGetAccountStates3(req)); }
    tvGetAlternativeTitles(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetAlternativeTitlesResponse> { return this.proxy.invoke(t => t.tvGetAlternativeTitles(req)); }
    tvGetChanges(req: tmdb.TvGetChangesRequest): Promise<tmdb.TvGetChangesResponse> { return this.proxy.invoke(t => t.tvGetChanges(req)); }
    tvGetChanges2(req: tmdb.TvGetChanges2Request): Promise<tmdb.TvGetChanges2Response> { return this.proxy.invoke(t => t.tvGetChanges2(req)); }
    tvGetChanges3(req: tmdb.TvGetChanges3Request): Promise<tmdb.TvGetChanges3Response> { return this.proxy.invoke(t => t.tvGetChanges3(req)); }
    tvGetContentRatings(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetContentRatingsResponse> { return this.proxy.invoke(t => t.tvGetContentRatings(req)); }
    tvGetCredits(req: tmdb.TvGetTVEpisodeExternalIDsRequestBase): Promise<tmdb.TvGetCreditsResponse> { return this.proxy.invoke(t => t.tvGetCredits(req)); }
    tvGetCredits2(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.TvShowCreditsResponse> { return this.proxy.invoke(t => t.tvGetCredits2(req)); }
    tvGetCredits3(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvShowCreditsResponse> { return this.proxy.invoke(t => t.tvGetCredits3(req)); }
    tvGetDetails2(req: tmdb.TvGetDetails2Request): Promise<tmdb.TvGetDetails2Response> { return this.proxy.invoke(t => t.tvGetDetails2(req)); }
    tvGetDetails3(req: tmdb.TvGetDetails3Request): Promise<tmdb.TvGetDetails3Response> { return this.proxy.invoke(t => t.tvGetDetails3(req)); }
    tvGetExternalIDs(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.TvGetExternalIDsResponse> { return this.proxy.invoke(t => t.tvGetExternalIDs(req)); }
    tvGetExternalIDs2(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetExternalIDs2Response> { return this.proxy.invoke(t => t.tvGetExternalIDs2(req)); }
    tvGetImages(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetImagesResponse> { return this.proxy.invoke(t => t.tvGetImages(req)); }
    tvGetImages2(req: tmdb.TvGetTVEpisodeExternalIDsRequestBase): Promise<tmdb.TvGetImages2Response> { return this.proxy.invoke(t => t.tvGetImages2(req)); }
    tvGetImages3(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.TvGetImages3Response> { return this.proxy.invoke(t => t.tvGetImages3(req)); }
    tvGetKeywords(req: tmdb.TvGetKeywordsRequest): Promise<tmdb.TvGetKeywordsResponse> { return this.proxy.invoke(t => t.tvGetKeywords(req)); }
    tvGetLatest(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.TvGetLatestResponse> { return this.proxy.invoke(t => t.tvGetLatest(req)); }
    tvGetPopular(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.tvGetPopular(req)); }
    tvGetRecommendations(req: tmdb.TvGetSimilarTVShowsRequestBase): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.tvGetRecommendations(req)); }
    tvGetSimilarTVShows(req: tmdb.TvGetSimilarTVShowsRequestBase): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.tvGetSimilarTVShows(req)); }
    tvGetTopRated(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.tvGetTopRated(req)); }
    tvGetTranslations(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetTranslationsResponse> { return this.proxy.invoke(t => t.tvGetTranslations(req)); }
    tvGetTVAiringToday(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.tvGetTVAiringToday(req)); }
    tvGetTVChangeList(req: tmdb.MovieGetMovieChangeListRequestBase): Promise<tmdb.PagedResponse<ChangeList>> { return this.proxy.invoke(t => t.tvGetTVChangeList(req)); }
    tvGetTVEpisodeExternalIDs(req: tmdb.TvGetTVEpisodeExternalIDsRequestBase): Promise<tmdb.TvGetTVEpisodeExternalIDsResponse> { return this.proxy.invoke(t => t.tvGetTVEpisodeExternalIDs(req)); }
    tvGetTVOnTheAir(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> { return this.proxy.invoke(t => t.tvGetTVOnTheAir(req)); }
    tvGetVideos(req: tmdb.TvGetVideosRequest): Promise<tmdb.GetVideosResponse> { return this.proxy.invoke(t => t.tvGetVideos(req)); }
    tvGetVideos2(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.GetVideosResponse> { return this.proxy.invoke(t => t.tvGetVideos2(req)); }
    tvGetVideos3(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.GetVideosResponse> { return this.proxy.invoke(t => t.tvGetVideos3(req)); }
    tvRateTVEpisode(req: tmdb.TvRateTVEpisodeRequest): Promise<any> { return this.proxy.invoke(t => t.tvRateTVEpisode(req)); }
    tvRateTVShow(req: tmdb.TvRateTVShowRequest): Promise<any> { return this.proxy.invoke(t => t.tvRateTVShow(req)); }

}
