import * as tmdb from "../tmdb-v3"
import {
    AccountRatedTVEpisode,
    ChangeList,
    Person,
    PopularPerson,
    RatedMovie,
    RatedTvShow,
    SessionRatedTVEpisode,
    TmdbMovie,
    TvShow,
} from "../tmdb-v3"
import { TmdbV3Proxy } from "../TmdbProxy"
import { Invoker } from "../utils/Proxy"

export class TmdbClientV3 {
    invoke: Invoker<tmdb.TmdbV3Api>
    constructor() {
        this.proxy = new TmdbV3Proxy()
        this.invoke = this.proxy.invoker
    }
    set base_url(value: string) {
        this.proxy.base_url = value
    }
    get api_key(): string | null {
        return this.proxy.api_key
    }
    set api_key(value: string | null) {
        this.proxy.api_key = value
    }

    proxy: TmdbV3Proxy
    getApiConfiguration(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.GetApiConfigurationResponse> {
        return this.invoke({ method: "getApiConfiguration", prms: [req] })
    }
    searchMovies(req: tmdb.SearchMoviesRequest): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "searchMovies", prms: [req] })
    }
    searchTvShows(req: tmdb.SearchSearchTVShowsRequest): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "searchTvShows", prms: [req] })
    }
    movieGetPopular(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "movieGetPopular", prms: [req] })
    }
    tvGetDetails(req: tmdb.TvGetDetailsRequest): Promise<tmdb.TmdbTvShowDetails> {
        return this.invoke({ method: "tvGetDetails", prms: [req] })
    }
    searchMulti(req: tmdb.SearchSearchPeopleRequestBase): Promise<tmdb.PagedResponse<TmdbMovie | TvShow | Person>> {
        return this.invoke({ method: "searchMulti", prms: [req] })
    }
    accountAddtoWatchlist(req: tmdb.AccountAddtoWatchlistRequestBase): Promise<void> {
        return this.invoke({ method: "accountAddtoWatchlist", prms: [req] })
    }
    accountGetCreatedLists(
        req: tmdb.AccountGetCreatedListsRequest
    ): Promise<tmdb.PagedResponse<tmdb.AccountGetCreatedListsResponseItem>> {
        return this.invoke({ method: "accountGetCreatedLists", prms: [req] })
    }
    accountGetDetails(req: tmdb.AccountGetDetailsRequest): Promise<tmdb.AccountDetails> {
        return this.invoke({ method: "accountGetDetails", prms: [req] })
    }
    accountGetFavoriteMovies(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "accountGetFavoriteMovies", prms: [req] })
    }
    accountGetFavoriteTVShows(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "accountGetFavoriteTVShows", prms: [req] })
    }
    accountGetMovieWatchlist(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "accountGetMovieWatchlist", prms: [req] })
    }
    accountGetRatedMovies(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<RatedMovie>> {
        return this.invoke({ method: "accountGetRatedMovies", prms: [req] })
    }
    accountGetRatedTVEpisodes(
        req: tmdb.AccountGetRatedTVEpisodesRequest
    ): Promise<tmdb.PagedResponse<AccountRatedTVEpisode>> {
        return this.invoke({ method: "accountGetRatedTVEpisodes", prms: [req] })
    }
    accountGetRatedTVShows(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<RatedTvShow>> {
        return this.invoke({ method: "accountGetRatedTVShows", prms: [req] })
    }
    accountGetTVShowWatchlist(req: tmdb.AccountGetTVShowWatchlistRequestBase): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "accountGetTVShowWatchlist", prms: [req] })
    }
    accountMarkasFavorite(req: tmdb.AccountMarkAsFavoriteRequest): Promise<tmdb.Response> {
        return this.invoke({ method: "accountMarkasFavorite", prms: [req] })
    }
    authenticationCreateGuestSession(
        req: tmdb.GetApiConfigurationRequest
    ): Promise<tmdb.AuthenticationCreateGuestSessionResponse> {
        return this.invoke({ method: "authenticationCreateGuestSession", prms: [req] })
    }
    authenticationCreateRequestToken(
        req: tmdb.GetApiConfigurationRequest
    ): Promise<tmdb.AuthenticationCreateRequestTokenResponse> {
        return this.invoke({ method: "authenticationCreateRequestToken", prms: [req] })
    }
    authenticationCreateSession(
        req: tmdb.AuthenticationCreateSessionRequest
    ): Promise<tmdb.AuthenticationCreateSessionResponse> {
        return this.invoke({ method: "authenticationCreateSession", prms: [req] })
    }
    authenticationValidateRequestToken(
        req: tmdb.AuthenticationValidateRequestTokenRequest
    ): Promise<tmdb.AuthenticationValidateRequestTokenResponse> {
        return this.invoke({ method: "authenticationValidateRequestToken", prms: [req] })
    }
    certificationGetMovieCertifications(
        req: tmdb.GetApiConfigurationRequest
    ): Promise<tmdb.CertificationGetMovieCertificationsResponse> {
        return this.invoke({ method: "certificationGetMovieCertifications", prms: [req] })
    }
    certificationGetTVCertifications(
        req: tmdb.GetApiConfigurationRequest
    ): Promise<tmdb.CertificationGetTVCertificationsResponse> {
        return this.invoke({ method: "certificationGetTVCertifications", prms: [req] })
    }
    collectionGetDetails(req: tmdb.CollectionGetDetailsRequestBase): Promise<tmdb.CollectionGetDetailsResponse> {
        return this.invoke({ method: "collectionGetDetails", prms: [req] })
    }
    collectionGetImages(req: tmdb.CollectionGetDetailsRequestBase): Promise<tmdb.CollectionGetImagesResponse> {
        return this.invoke({ method: "collectionGetImages", prms: [req] })
    }
    companyGetDetails(req: tmdb.CompanyGetDetailsRequest): Promise<tmdb.CompanyGetDetailsResponse> {
        return this.invoke({ method: "companyGetDetails", prms: [req] })
    }
    companyGetMovies(req: tmdb.CompanyGetMoviesRequest): Promise<tmdb.KeywordGetMoviesResponseBase> {
        return this.invoke({ method: "companyGetMovies", prms: [req] })
    }
    creditGetDetails(req: tmdb.CreditGetDetailsRequest): Promise<tmdb.CreditGetDetailsResponse> {
        return this.invoke({ method: "creditGetDetails", prms: [req] })
    }
    discoverMovieDiscover(req: tmdb.DiscoverMovieDiscoverRequest): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "discoverMovieDiscover", prms: [req] })
    }
    discoverTVDiscover(req: tmdb.DiscoverTVDiscoverRequest): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "discoverTVDiscover", prms: [req] })
    }
    findFindbyID(req: tmdb.FindFindbyIDRequest): Promise<tmdb.FindFindbyIDResponse> {
        return this.invoke({ method: "findFindbyID", prms: [req] })
    }
    genreGetMovieList(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.GenreGetMovieListResponseBase> {
        return this.invoke({ method: "genreGetMovieList", prms: [req] })
    }
    genreGetMovies(req: tmdb.GenreGetMoviesRequest): Promise<tmdb.KeywordGetMoviesResponseBase> {
        return this.invoke({ method: "genreGetMovies", prms: [req] })
    }
    genreGetTVList(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.GenreGetMovieListResponseBase> {
        return this.invoke({ method: "genreGetTVList", prms: [req] })
    }
    guest_sessionGetRatedMovies(
        req: tmdb.Guest_sessionGetRatedMoviesRequestBase
    ): Promise<tmdb.PagedResponse<RatedMovie>> {
        return this.invoke({ method: "guest_sessionGetRatedMovies", prms: [req] })
    }
    guest_sessionGetRatedTVEpisodes(
        req: tmdb.Guest_sessionGetRatedMoviesRequestBase
    ): Promise<tmdb.PagedResponse<SessionRatedTVEpisode>> {
        return this.invoke({ method: "guest_sessionGetRatedTVEpisodes", prms: [req] })
    }
    guest_sessionGetRatedTVShows(
        req: tmdb.Guest_sessionGetRatedMoviesRequestBase
    ): Promise<tmdb.PagedResponse<RatedTvShow>> {
        return this.invoke({ method: "guest_sessionGetRatedTVShows", prms: [req] })
    }
    jobGetJobs(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.JobGetJobsResponse> {
        return this.invoke({ method: "jobGetJobs", prms: [req] })
    }
    keywordGetDetails(req: tmdb.KeywordGetDetailsRequest): Promise<tmdb.Genre> {
        return this.invoke({ method: "keywordGetDetails", prms: [req] })
    }
    keywordGetMovies(req: tmdb.KeywordGetMoviesRequest): Promise<tmdb.KeywordGetMoviesResponseBase> {
        return this.invoke({ method: "keywordGetMovies", prms: [req] })
    }
    listAddMovie(req: tmdb.ListAddMovieRequestBase): Promise<void> {
        return this.invoke({ method: "listAddMovie", prms: [req] })
    }
    listCheckItemStatus(req: tmdb.ListCheckItemStatusRequest): Promise<tmdb.ListCheckItemStatusResponse> {
        return this.invoke({ method: "listCheckItemStatus", prms: [req] })
    }
    listClearList(req: tmdb.ListClearListRequest): Promise<void> {
        return this.invoke({ method: "listClearList", prms: [req] })
    }
    listCreateList(req: tmdb.ListCreateListRequest): Promise<tmdb.ListCreateListResponse> {
        return this.invoke({ method: "listCreateList", prms: [req] })
    }
    listGetDetails(req: tmdb.ListGetDetailsRequest): Promise<tmdb.ListDetails> {
        return this.invoke({ method: "listGetDetails", prms: [req] })
    }
    listRemoveMovie(req: tmdb.ListAddMovieRequestBase): Promise<tmdb.Response> {
        return this.invoke({ method: "listRemoveMovie", prms: [req] })
    }
    movieDeleteRating(req: tmdb.MovieDeleteRatingRequest): Promise<tmdb.Response> {
        return this.invoke({ method: "movieDeleteRating", prms: [req] })
    }
    movieGetAccountStates(req: tmdb.MovieGetAccountStatesRequest): Promise<tmdb.AccountStates> {
        return this.invoke({ method: "movieGetAccountStates", prms: [req] })
    }
    movieGetAlternativeTitles(
        req: tmdb.MovieGetAlternativeTitlesRequest
    ): Promise<tmdb.MovieGetAlternativeTitlesResponse> {
        return this.invoke({ method: "movieGetAlternativeTitles", prms: [req] })
    }
    movieGetChanges(req: tmdb.MovieGetChangesRequest): Promise<tmdb.MovieGetChangesResponse> {
        return this.invoke({ method: "movieGetChanges", prms: [req] })
    }
    movieGetCredits(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetCreditsResponse> {
        return this.invoke({ method: "movieGetCredits", prms: [req] })
    }
    movieGetDetails(req: tmdb.MovieGetDetailsRequest): Promise<tmdb.TmdbMovieDetails> {
        return this.invoke({ method: "movieGetDetails", prms: [req] })
    }
    movieGetImages(req: tmdb.MovieGetImagesRequest): Promise<tmdb.MovieGetImagesResponse> {
        return this.invoke({ method: "movieGetImages", prms: [req] })
    }
    movieGetKeywords(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetKeywordsResponse> {
        return this.invoke({ method: "movieGetKeywords", prms: [req] })
    }
    movieGetLatest(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.MovieGetLatestResponse> {
        return this.invoke({ method: "movieGetLatest", prms: [req] })
    }
    movieGetLists(req: tmdb.MovieRequest): Promise<tmdb.MovieGetListsResponse> {
        return this.invoke({ method: "movieGetLists", prms: [req] })
    }
    movieGetMovieChangeList(req: tmdb.MovieGetMovieChangeListRequestBase): Promise<tmdb.PagedResponse<ChangeList>> {
        return this.invoke({ method: "movieGetMovieChangeList", prms: [req] })
    }
    movieGetNowPlaying(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "movieGetNowPlaying", prms: [req] })
    }
    movieGetRecommendations(req: tmdb.MovieRequest): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "movieGetRecommendations", prms: [req] })
    }
    movieGetReleaseDates(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetReleaseDatesResponse> {
        return this.invoke({ method: "movieGetReleaseDates", prms: [req] })
    }
    movieGetReviews(req: tmdb.MovieRequest): Promise<tmdb.MovieGetReviewsResponse> {
        return this.invoke({ method: "movieGetReviews", prms: [req] })
    }
    movieGetSimilarMovies(req: tmdb.MovieRequest): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "movieGetSimilarMovies", prms: [req] })
    }
    movieGetTopRated(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "movieGetTopRated", prms: [req] })
    }
    movieGetTranslations(req: tmdb.MovieGetReleaseDatesRequestBase): Promise<tmdb.MovieGetTranslationsResponse> {
        return this.invoke({ method: "movieGetTranslations", prms: [req] })
    }
    movieGetUpcoming(req: tmdb.MovieGetNowPlayingRequestBase): Promise<tmdb.PagedResponse<TmdbMovie>> {
        return this.invoke({ method: "movieGetUpcoming", prms: [req] })
    }
    movieGetVideos(req: tmdb.MovieGetVideosRequest): Promise<tmdb.GetVideosResponse> {
        return this.invoke({ method: "movieGetVideos", prms: [req] })
    }
    movieRateMovie(req: tmdb.MovieRateMovieRequest): Promise<void> {
        return this.invoke({ method: "movieRateMovie", prms: [req] })
    }
    networkGetDetails(req: tmdb.NetworkGetDetailsRequest): Promise<tmdb.Genre> {
        return this.invoke({ method: "networkGetDetails", prms: [req] })
    }
    personGetChanges(req: tmdb.PersonGetChangesRequest): Promise<tmdb.PersonGetChangesResponse> {
        return this.invoke({ method: "personGetChanges", prms: [req] })
    }
    personGetCombinedCredits(req: tmdb.PersonRequest): Promise<tmdb.PersonGetCombinedCreditsResponse> {
        return this.invoke({ method: "personGetCombinedCredits", prms: [req] })
    }
    personGetDetails(req: tmdb.PersonGetDetailsRequest): Promise<tmdb.Person> {
        return this.invoke({ method: "personGetDetails", prms: [req] })
    }
    personGetExternalIDs(req: tmdb.PersonRequest): Promise<tmdb.PersonGetExternalIDsResponse> {
        return this.invoke({ method: "personGetExternalIDs", prms: [req] })
    }
    personGetImages(req: tmdb.PersonGetImagesRequest): Promise<tmdb.PersonGetImagesResponse> {
        return this.invoke({ method: "personGetImages", prms: [req] })
    }
    personGetLatest(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.Person> {
        return this.invoke({ method: "personGetLatest", prms: [req] })
    }
    personGetMovieCredits(req: tmdb.PersonRequest): Promise<tmdb.PersonGetMovieCreditsResponse> {
        return this.invoke({ method: "personGetMovieCredits", prms: [req] })
    }
    personGetPersonChangeList(req: tmdb.MovieGetMovieChangeListRequestBase): Promise<tmdb.PagedResponse<ChangeList>> {
        return this.invoke({ method: "personGetPersonChangeList", prms: [req] })
    }
    personGetPopular(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<PopularPerson>> {
        return this.invoke({ method: "personGetPopular", prms: [req] })
    }
    personGetTaggedImages(req: tmdb.PersonGetTaggedImagesRequest): Promise<tmdb.PersonGetTaggedImagesResponse> {
        return this.invoke({ method: "personGetTaggedImages", prms: [req] })
    }
    personGetTVCredits(req: tmdb.PersonRequest): Promise<tmdb.PersonGetTVCreditsResponse> {
        return this.invoke({ method: "personGetTVCredits", prms: [req] })
    }
    reviewGetDetails(req: tmdb.ReviewGetDetailsRequest): Promise<tmdb.ReviewGetDetailsResponse> {
        return this.invoke({ method: "reviewGetDetails", prms: [req] })
    }
    searchSearchCollections(req: tmdb.SearchSearchCollectionsRequest): Promise<tmdb.SearchSearchCollectionsResponse> {
        return this.invoke({ method: "searchSearchCollections", prms: [req] })
    }
    searchSearchCompanies(req: tmdb.SearchSearchCompaniesRequestBase): Promise<tmdb.SearchSearchCompaniesResponse> {
        return this.invoke({ method: "searchSearchCompanies", prms: [req] })
    }
    searchSearchKeywords(req: tmdb.SearchSearchCompaniesRequestBase): Promise<tmdb.SearchSearchKeywordsResponse> {
        return this.invoke({ method: "searchSearchKeywords", prms: [req] })
    }
    searchSearchPeople(req: tmdb.SearchSearchPeopleRequestBase): Promise<tmdb.PagedResponse<PopularPerson>> {
        return this.invoke({ method: "searchSearchPeople", prms: [req] })
    }
    timezonesGetList(req: tmdb.GetApiConfigurationRequest): Promise<tmdb.Unknown[]> {
        return this.invoke({ method: "timezonesGetList", prms: [req] })
    }
    tvDeleteRating(req: tmdb.TvDeleteRatingRequest): Promise<tmdb.Response> {
        return this.invoke({ method: "tvDeleteRating", prms: [req] })
    }
    tvDeleteRating2(req: tmdb.TvDeleteRating2Request): Promise<tmdb.Response> {
        return this.invoke({ method: "tvDeleteRating2", prms: [req] })
    }
    tvGetAccountStates(req: tmdb.TvGetAccountStatesRequest): Promise<tmdb.AccountStates> {
        return this.invoke({ method: "tvGetAccountStates", prms: [req] })
    }
    tvGetAccountStates2(req: tmdb.TvGetAccountStates2Request): Promise<tmdb.TvGetAccountStates2Response> {
        return this.invoke({ method: "tvGetAccountStates2", prms: [req] })
    }
    tvGetAccountStates3(req: tmdb.TvGetAccountStates3Request): Promise<tmdb.TvGetAccountStates3Response> {
        return this.invoke({ method: "tvGetAccountStates3", prms: [req] })
    }
    tvGetAlternativeTitles(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetAlternativeTitlesResponse> {
        return this.invoke({ method: "tvGetAlternativeTitles", prms: [req] })
    }
    tvGetChanges(req: tmdb.TvGetChangesRequest): Promise<tmdb.TvGetChangesResponse> {
        return this.invoke({ method: "tvGetChanges", prms: [req] })
    }
    tvGetChanges2(req: tmdb.TvGetChanges2Request): Promise<tmdb.TvGetChanges2Response> {
        return this.invoke({ method: "tvGetChanges2", prms: [req] })
    }
    tvGetChanges3(req: tmdb.TvGetChanges3Request): Promise<tmdb.TvGetChanges3Response> {
        return this.invoke({ method: "tvGetChanges3", prms: [req] })
    }
    tvGetContentRatings(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetContentRatingsResponse> {
        return this.invoke({ method: "tvGetContentRatings", prms: [req] })
    }
    tvGetCredits(req: tmdb.TvGetTVEpisodeExternalIDsRequestBase): Promise<tmdb.TvGetCreditsResponse> {
        return this.invoke({ method: "tvGetCredits", prms: [req] })
    }
    tvGetCredits2(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.TvShowCreditsResponse> {
        return this.invoke({ method: "tvGetCredits2", prms: [req] })
    }
    tvGetCredits3(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvShowCreditsResponse> {
        return this.invoke({ method: "tvGetCredits3", prms: [req] })
    }
    tvGetSeason(req: tmdb.TvGetSeasonRequest): Promise<tmdb.TvGetSeasonResponse> {
        return this.invoke({ method: "tvGetSeason", prms: [req] })
    }
    tvGetDetails3(req: tmdb.TvGetDetails3Request): Promise<tmdb.TvGetDetails3Response> {
        return this.invoke({ method: "tvGetDetails3", prms: [req] })
    }
    tvGetExternalIDs(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.TvGetExternalIDsResponse> {
        return this.invoke({ method: "tvGetExternalIDs", prms: [req] })
    }
    tvGetExternalIDs2(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetExternalIDs2Response> {
        return this.invoke({ method: "tvGetExternalIDs2", prms: [req] })
    }
    tvGetImages(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetImagesResponse> {
        return this.invoke({ method: "tvGetImages", prms: [req] })
    }
    tvGetImages2(req: tmdb.TvGetTVEpisodeExternalIDsRequestBase): Promise<tmdb.TvGetImages2Response> {
        return this.invoke({ method: "tvGetImages2", prms: [req] })
    }
    tvGetImages3(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.TvGetImages3Response> {
        return this.invoke({ method: "tvGetImages3", prms: [req] })
    }
    tvGetKeywords(req: tmdb.TvGetKeywordsRequest): Promise<tmdb.TvGetKeywordsResponse> {
        return this.invoke({ method: "tvGetKeywords", prms: [req] })
    }
    tvGetLatest(req: tmdb.MovieGetLatestRequestBase): Promise<tmdb.TvGetLatestResponse> {
        return this.invoke({ method: "tvGetLatest", prms: [req] })
    }
    tvGetPopular(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "tvGetPopular", prms: [req] })
    }
    tvGetRecommendations(req: tmdb.TvGetSimilarTVShowsRequestBase): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "tvGetRecommendations", prms: [req] })
    }
    tvGetSimilarTVShows(req: tmdb.TvGetSimilarTVShowsRequestBase): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "tvGetSimilarTVShows", prms: [req] })
    }
    tvGetTopRated(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "tvGetTopRated", prms: [req] })
    }
    tvGetTranslations(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.TvGetTranslationsResponse> {
        return this.invoke({ method: "tvGetTranslations", prms: [req] })
    }
    tvGetTVAiringToday(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "tvGetTVAiringToday", prms: [req] })
    }
    tvGetTVChangeList(req: tmdb.MovieGetMovieChangeListRequestBase): Promise<tmdb.PagedResponse<ChangeList>> {
        return this.invoke({ method: "tvGetTVChangeList", prms: [req] })
    }
    tvGetTVEpisodeExternalIDs(
        req: tmdb.TvGetTVEpisodeExternalIDsRequestBase
    ): Promise<tmdb.TvGetTVEpisodeExternalIDsResponse> {
        return this.invoke({ method: "tvGetTVEpisodeExternalIDs", prms: [req] })
    }
    tvGetTVOnTheAir(req: tmdb.PagedLanguageRequest): Promise<tmdb.PagedResponse<TvShow>> {
        return this.invoke({ method: "tvGetTVOnTheAir", prms: [req] })
    }
    tvGetVideos(req: tmdb.TvGetVideosRequest): Promise<tmdb.GetVideosResponse> {
        return this.invoke({ method: "tvGetVideos", prms: [req] })
    }
    tvGetVideos2(req: tmdb.TvGetImagesRequestBase): Promise<tmdb.GetVideosResponse> {
        return this.invoke({ method: "tvGetVideos2", prms: [req] })
    }
    tvGetVideos3(req: tmdb.TvGetExternalIDsRequestBase): Promise<tmdb.GetVideosResponse> {
        return this.invoke({ method: "tvGetVideos3", prms: [req] })
    }
    tvRateTVEpisode(req: tmdb.TvRateTVEpisodeRequest): Promise<void> {
        return this.invoke({ method: "tvRateTVEpisode", prms: [req] })
    }
    tvRateTVShow(req: tmdb.TvRateTVShowRequest): Promise<void> {
        return this.invoke({ method: "tvRateTVShow", prms: [req] })
    }
}
