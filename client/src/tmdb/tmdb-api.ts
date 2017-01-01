export interface TmdbApi {

    getApiConfiguration(req: GetApiConfigurationRequest): GetApiConfigurationResponse;

    searchMovies(req: SearchMoviesRequest): PagedResponse<Movie>;
    searchTvShows(req: SearchSearchTVShowsRequest): PagedResponse<TvShow>;
    movieGetPopular(req: MovieGetNowPlayingRequestBase): PagedResponse<Movie>;
    tvGetDetails(req: TvGetDetailsRequest): TvShowDetails;
    searchMulti(req: SearchSearchPeopleRequestBase): PagedResponse<Movie | TvShow | Person>;


    accountAddtoWatchlist(req: AccountAddtoWatchlistRequestBase): any;
    accountGetCreatedLists(req: AccountGetCreatedListsRequest): PagedResponse<AccountGetCreatedListsResponseItem>;
    accountGetDetails(req: AccountGetDetailsRequest): AccountDetails;
    accountGetFavoriteMovies(req: AccountGetTVShowWatchlistRequestBase): PagedResponse<Movie>;
    accountGetFavoriteTVShows(req: AccountGetTVShowWatchlistRequestBase): PagedResponse<TvShow>;
    accountGetMovieWatchlist(req: AccountGetTVShowWatchlistRequestBase): PagedResponse<Movie>;
    accountGetRatedMovies(req: AccountGetTVShowWatchlistRequestBase): PagedResponse<RatedMovie>;
    accountGetRatedTVEpisodes(req: AccountGetRatedTVEpisodesRequest): PagedResponse<AccountRatedTVEpisode>;
    accountGetRatedTVShows(req: AccountGetTVShowWatchlistRequestBase): PagedResponse<RatedTvShow>;
    accountGetTVShowWatchlist(req: AccountGetTVShowWatchlistRequestBase): PagedResponse<TvShow>;
    accountMarkasFavorite(req: AccountAddtoWatchlistRequestBase): any;

    authenticationCreateGuestSession(req: GetApiConfigurationRequest): AuthenticationCreateGuestSessionResponse;
    authenticationCreateRequestToken(req: GetApiConfigurationRequest): AuthenticationCreateRequestTokenResponse;
    authenticationCreateSession(req: AuthenticationCreateSessionRequest): AuthenticationCreateSessionResponse;
    authenticationValidateRequestToken(req: AuthenticationValidateRequestTokenRequest): AuthenticationValidateRequestTokenResponse;

    certificationGetMovieCertifications(req: GetApiConfigurationRequest): CertificationGetMovieCertificationsResponse;
    certificationGetTVCertifications(req: GetApiConfigurationRequest): CertificationGetTVCertificationsResponse;

    collectionGetDetails(req: CollectionGetDetailsRequestBase): CollectionGetDetailsResponse;
    collectionGetImages(req: CollectionGetDetailsRequestBase): CollectionGetImagesResponse;

    companyGetDetails(req: CompanyGetDetailsRequest): CompanyGetDetailsResponse;
    companyGetMovies(req: CompanyGetMoviesRequest): KeywordGetMoviesResponseBase;

    creditGetDetails(req: CreditGetDetailsRequest): CreditGetDetailsResponse;

    discoverMovieDiscover(req: DiscoverMovieDiscoverRequest): PagedResponse<Movie>;
    discoverTVDiscover(req: DiscoverTVDiscoverRequest): PagedResponse<TvShow>;

    findFindbyID(req: FindFindbyIDRequest): FindFindbyIDResponse;

    genreGetMovieList(req: MovieGetLatestRequestBase): GenreGetMovieListResponseBase;
    genreGetMovies(req: GenreGetMoviesRequest): KeywordGetMoviesResponseBase;
    genreGetTVList(req: MovieGetLatestRequestBase): GenreGetMovieListResponseBase;

    guest_sessionGetRatedMovies(req: Guest_sessionGetRatedMoviesRequestBase): PagedResponse<RatedMovie>;
    guest_sessionGetRatedTVEpisodes(req: Guest_sessionGetRatedMoviesRequestBase): PagedResponse<SessionRatedTVEpisode>;
    guest_sessionGetRatedTVShows(req: Guest_sessionGetRatedMoviesRequestBase): PagedResponse<RatedTvShow>;

    jobGetJobs(req: GetApiConfigurationRequest): JobGetJobsResponse;

    keywordGetDetails(req: KeywordGetDetailsRequest): Genre;
    keywordGetMovies(req: KeywordGetMoviesRequest): KeywordGetMoviesResponseBase;

    listAddMovie(req: ListAddMovieRequestBase): any;
    listCheckItemStatus(req: ListCheckItemStatusRequest): ListCheckItemStatusResponse;
    listClearList(req: ListClearListRequest): any;
    listCreateList(req: ListCreateListRequest): ListCreateListResponse;
    listGetDetails(req: ListGetDetailsRequest): ListDetails;
    listRemoveMovie(req: ListAddMovieRequestBase): Response;

    movieDeleteRating(req: MovieDeleteRatingRequest): Response;
    movieGetAccountStates(req: MovieGetAccountStatesRequest): AccountStates;
    movieGetAlternativeTitles(req: MovieGetAlternativeTitlesRequest): MovieGetAlternativeTitlesResponse;
    movieGetChanges(req: MovieGetChangesRequest): MovieGetChangesResponse;
    movieGetCredits(req: MovieGetReleaseDatesRequestBase): MovieGetCreditsResponse;
    movieGetDetails(req: MovieGetDetailsRequest): MovieDetails;
    movieGetImages(req: MovieGetImagesRequest): MovieGetImagesResponse;
    movieGetKeywords(req: MovieGetReleaseDatesRequestBase): MovieGetKeywordsResponse;
    movieGetLatest(req: MovieGetLatestRequestBase): MovieGetLatestResponse;
    movieGetLists(req: MovieRequest): MovieGetListsResponse;
    movieGetMovieChangeList(req: MovieGetMovieChangeListRequestBase): PagedResponse<ChangeList>;
    movieGetNowPlaying(req: MovieGetNowPlayingRequestBase): PagedResponse<Movie>;
    movieGetRecommendations(req: MovieRequest): PagedResponse<Movie>;
    movieGetReleaseDates(req: MovieGetReleaseDatesRequestBase): MovieGetReleaseDatesResponse;
    movieGetReviews(req: MovieRequest): MovieGetReviewsResponse;
    movieGetSimilarMovies(req: MovieRequest): PagedResponse<Movie>;
    movieGetTopRated(req: MovieGetNowPlayingRequestBase): PagedResponse<Movie>;
    movieGetTranslations(req: MovieGetReleaseDatesRequestBase): MovieGetTranslationsResponse;
    movieGetUpcoming(req: MovieGetNowPlayingRequestBase): PagedResponse<Movie>;
    movieGetVideos(req: MovieGetVideosRequest): GetVideosResponse;
    movieRateMovie(req: MovieRateMovieRequest): any;

    networkGetDetails(req: NetworkGetDetailsRequest): Genre;

    personGetChanges(req: PersonGetChangesRequest): PersonGetChangesResponse;
    personGetCombinedCredits(req: PersonRequest): PersonGetCombinedCreditsResponse;
    personGetDetails(req: PersonGetDetailsRequest): Person;
    personGetExternalIDs(req: PersonRequest): PersonGetExternalIDsResponse;
    personGetImages(req: PersonGetImagesRequest): PersonGetImagesResponse;
    personGetLatest(req: MovieGetLatestRequestBase): Person;
    personGetMovieCredits(req: PersonRequest): PersonGetMovieCreditsResponse;
    personGetPersonChangeList(req: MovieGetMovieChangeListRequestBase): PagedResponse<ChangeList>;
    personGetPopular(req: PersonGetPopularRequestBase): PagedResponse<PopularPerson>;
    personGetTaggedImages(req: PersonGetTaggedImagesRequest): PersonGetTaggedImagesResponse;
    personGetTVCredits(req: PersonRequest): PersonGetTVCreditsResponse;

    reviewGetDetails(req: ReviewGetDetailsRequest): ReviewGetDetailsResponse;

    searchSearchCollections(req: SearchSearchCollectionsRequest): SearchSearchCollectionsResponse;
    searchSearchCompanies(req: SearchSearchCompaniesRequestBase): SearchSearchCompaniesResponse;
    searchSearchKeywords(req: SearchSearchCompaniesRequestBase): SearchSearchKeywordsResponse;
    searchSearchPeople(req: SearchSearchPeopleRequestBase): PagedResponse<PopularPerson>;

    timezonesGetList(req: GetApiConfigurationRequest): Unknown[];

    tvDeleteRating(req: TvDeleteRatingRequest): Response;
    tvDeleteRating2(req: TvDeleteRating2Request): Response;
    tvGetAccountStates(req: TvGetAccountStatesRequest): AccountStates;
    tvGetAccountStates2(req: TvGetAccountStates2Request): TvGetAccountStates2Response;
    tvGetAccountStates3(req: TvGetAccountStates3Request): TvGetAccountStates3Response;
    tvGetAlternativeTitles(req: TvGetImagesRequestBase): TvGetAlternativeTitlesResponse;
    tvGetChanges(req: TvGetChangesRequest): TvGetChangesResponse;
    tvGetChanges2(req: TvGetChanges2Request): TvGetChanges2Response;
    tvGetChanges3(req: TvGetChanges3Request): TvGetChanges3Response;
    tvGetContentRatings(req: TvGetImagesRequestBase): TvGetContentRatingsResponse;
    tvGetCredits(req: TvGetTVEpisodeExternalIDsRequestBase): TvGetCreditsResponse;
    tvGetCredits2(req: TvGetExternalIDsRequestBase): TvShowCreditsResponse;
    tvGetCredits3(req: TvGetImagesRequestBase): TvShowCreditsResponse;
    tvGetDetails2(req: TvGetDetails2Request): TvGetDetails2Response;
    tvGetDetails3(req: TvGetDetails3Request): TvGetDetails3Response;
    tvGetExternalIDs(req: TvGetExternalIDsRequestBase): TvGetExternalIDsResponse;
    tvGetExternalIDs2(req: TvGetImagesRequestBase): TvGetExternalIDs2Response;
    tvGetImages(req: TvGetImagesRequestBase): TvGetImagesResponse;
    tvGetImages2(req: TvGetTVEpisodeExternalIDsRequestBase): TvGetImages2Response;
    tvGetImages3(req: TvGetExternalIDsRequestBase): TvGetImages3Response;
    tvGetKeywords(req: TvGetKeywordsRequest): TvGetKeywordsResponse;
    tvGetLatest(req: MovieGetLatestRequestBase): TvGetLatestResponse;
    tvGetPopular(req: PersonGetPopularRequestBase): PagedResponse<TvShow>;
    tvGetRecommendations(req: TvGetSimilarTVShowsRequestBase): PagedResponse<TvShow>;
    tvGetSimilarTVShows(req: TvGetSimilarTVShowsRequestBase): PagedResponse<TvShow>;
    tvGetTopRated(req: PersonGetPopularRequestBase): PagedResponse<TvShow>;
    tvGetTranslations(req: TvGetImagesRequestBase): TvGetTranslationsResponse;
    tvGetTVAiringToday(req: PersonGetPopularRequestBase): PagedResponse<TvShow>;
    tvGetTVChangeList(req: MovieGetMovieChangeListRequestBase): PagedResponse<ChangeList>;
    tvGetTVEpisodeExternalIDs(req: TvGetTVEpisodeExternalIDsRequestBase): TvGetTVEpisodeExternalIDsResponse;
    tvGetTVOnTheAir(req: PersonGetPopularRequestBase): PagedResponse<TvShow>;
    tvGetVideos(req: TvGetVideosRequest): GetVideosResponse;
    tvGetVideos2(req: TvGetImagesRequestBase): GetVideosResponse;
    tvGetVideos3(req: TvGetExternalIDsRequestBase): GetVideosResponse;
    tvRateTVEpisode(req: TvRateTVEpisodeRequest): any;
    tvRateTVShow(req: TvRateTVShowRequest): any;
}

export interface TvGetChangesResponse_changes_items {
    action: string;
    id: string;
    iso_639_1: string;
    time: string;
    value: string;
}

export interface TvGetChangesResponse_changes {
    items: TvGetChangesResponse_changes_items[];
    key: string;
}

export interface TvGetChangesResponse {
    changes: TvGetChangesResponse_changes[];
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    iso_639_1: string;
    name: string;
}


export interface TvGetAccountStates2Response {
    id: number;
    rated: Object | boolean;
}

export interface TvGetImagesResponse {
    backdrops: Image[];
    id: number;
    posters: Image[];
}

export interface AuthenticationCreateSessionResponse {
    session_id: string;
    success: boolean;
}

export interface CertificationGetTVCertificationsResponse_certifications {
    AU: Certification[];
    BR: Certification[];
    CA: Certification[];
    DE: Certification[];
    FR: Certification[];
    GB: Certification[];
    KR: Certification[];
    RU: Certification[];
    TH: Certification[];
    US: Certification[];
}

export interface CertificationGetTVCertificationsResponse {
    certifications: CertificationGetTVCertificationsResponse_certifications;
}

export interface AuthenticationCreateGuestSessionResponse {
    expires_at: string;
    guest_session_id: string;
    success: boolean;
}

export interface TvGetChanges2Response_changes_items {
    action: string;
    id: string;
    time: string;
}

export interface TvGetChanges2Response_changes {
    items: TvGetChanges2Response_changes_items[];
    key: string;
}

export interface TvGetChanges2Response {
    changes: TvGetChanges2Response_changes[];
}

export interface TvGetTVEpisodeExternalIDsResponse {
    freebase_id: string;
    freebase_mid: string;
    id: number;
    imdb_id: string;
    tvdb_id: number;
    tvrage_id: number;
}

export interface PersonGetExternalIDsResponse {
    facebook_id: string;
    freebase_id: string;
    freebase_mid: string;
    id: number;
    imdb_id: string;
    tvrage_id: number;
    twitter_id: string;
}

export interface MovieGetLatestResponse {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Unknown[];
    production_countries: Unknown[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: Unknown[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface TvGetExternalIDsResponse {
    freebase_id: string;
    freebase_mid: string;
    id: number;
    tvdb_id: number;
    tvrage_id: number;
}

export interface AccountGetCreatedListsResponseItem {
    description: string;
    favorite_count: number;
    id: number;
    iso_639_1: string;
    item_count: number;
    list_type: string;
    name: string;
    poster_path: null;
}


export interface TvGetContentRatingsResponse_results {
    iso_3166_1: string;
    rating: string;
}

export interface TvGetContentRatingsResponse {
    id: number;
    results: TvGetContentRatingsResponse_results[];
}

export interface PersonGetTVCreditsResponse_cast {
    character: string;
    credit_id: string;
    episode_count: number;
    first_air_date: string;
    id: number;
    name: string;
    original_name: string;
    poster_path: string;
}

export interface PersonGetTVCreditsResponse_crew {
    credit_id: string;
    department: string;
    episode_count: number;
    first_air_date: string;
    id: number;
    job: string;
    name: string;
    original_name: string;
    poster_path: string;
}

export interface PersonGetTVCreditsResponse {
    cast: PersonGetTVCreditsResponse_cast[];
    crew: PersonGetTVCreditsResponse_crew[];
    id: number;
}

export interface FindFindbyIDResponse {
    movie_results: Movie[];
}

export interface TvGetDetailsResponse_created_by {
    id: number;
    name: string;
    profile_path: string;
}


export interface PersonGetCombinedCreditsResponse_cast {
    adult: boolean;
    character: string;
    credit_id: string;
    episode_count: number;
    first_air_date: string;
    id: number;
    media_type: string;
    name: string;
    original_name: string;
    original_title: string;
    poster_path: string;
    release_date: string;
    title: string;
}

export interface PersonGetCombinedCreditsResponse_crew {
    adult: boolean;
    credit_id: string;
    department: string;
    episode_count: number;
    first_air_date: string;
    id: number;
    job: string;
    media_type: string;
    name: string;
    original_name: string;
    original_title: string;
    poster_path: string;
    release_date: string;
    title: string;
}

export interface PersonGetCombinedCreditsResponse {
    cast: PersonGetCombinedCreditsResponse_cast[];
    crew: PersonGetCombinedCreditsResponse_crew[];
    id: number;
}

export interface TvGetCreditsResponse {
    cast: TvShowCredit[];
    crew: TvShowCrewMember[];
    guest_stars: TvShowCredit[];
    id: number;
}

export interface PersonGetMovieCreditsResponse_cast {
    adult: boolean;
    character: string;
    credit_id: string;
    id: number;
    original_title: string;
    poster_path: string;
    release_date: string;
    title: string;
}

export interface PersonGetMovieCreditsResponse_crew {
    adult: boolean;
    credit_id: string;
    department: string;
    id: number;
    job: string;
    original_title: string;
    poster_path: string;
    release_date: string;
    title: string;
}

export interface PersonGetMovieCreditsResponse {
    cast: PersonGetMovieCreditsResponse_cast[];
    crew: PersonGetMovieCreditsResponse_crew[];
    id: number;
}

export interface MovieGetImagesResponse {
    backdrops: Image[];
    id: number;
    posters: Image[];
}

export interface TvGetAccountStates3Response_results {
    episode_number: number;
    id: number;
    rated: boolean | Object;
}

export interface TvGetAccountStates3Response {
    id: number;
    results: TvGetAccountStates3Response_results[];
}

export interface MovieGetReviewsResponse_results {
    author: string;
    content: string;
    id: string;
    url: string;
}

export interface MovieGetReviewsResponse {
    id: number;
    page: number;
    results: MovieGetReviewsResponse_results[];
    total_pages: number;
    total_results: number;
}

export interface MovieGetReleaseDatesResponse_results_release_dates {
    certification: string;
    iso_639_1: string;
    note: string;
    release_date: string;
    type: number;
}

export interface MovieGetReleaseDatesResponse_results {
    iso_3166_1: string;
    release_dates: MovieGetReleaseDatesResponse_results_release_dates[];
}

export interface MovieGetReleaseDatesResponse {
    id: number;
    results: MovieGetReleaseDatesResponse_results[];
}

export interface CollectionGetDetailsResponse_parts {
    adult: boolean;
    backdrop_path: null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface CollectionGetDetailsResponse {
    backdrop_path: string;
    id: number;
    name: string;
    overview: string;
    parts: CollectionGetDetailsResponse_parts[];
    poster_path: null;
}

export interface ConfigurationGetAPIConfigurationResponse_images {
    backdrop_sizes: string[];
    base_url: string;
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    secure_base_url: string;
    still_sizes: string[];
}

export interface GetApiConfigurationResponse {
    change_keys: string[];
    images: ConfigurationGetAPIConfigurationResponse_images;
}

export interface MovieGetChangesResponse_changes_items {
    action: string;
    id: string;
    iso_639_1: string;
    original_value: string;
    time: string;
    value: string;
}

export interface MovieGetChangesResponse_changes {
    items: MovieGetChangesResponse_changes_items[];
    key: string;
}

export interface MovieGetChangesResponse {
    changes: MovieGetChangesResponse_changes[];
}

export interface ReviewGetDetailsResponse {
    author: string;
    content: string;
    id: string;
    iso_639_1: string;
    media_id: number;
    media_title: string;
    media_type: string;
    url: string;
}

export interface JobGetJobsResponse_jobs {
    department: string;
    job_list: string[];
}

export interface JobGetJobsResponse {
    jobs: JobGetJobsResponse_jobs[];
}

export interface ListDetails {
    created_by: string;
    description: string;
    favorite_count: number;
    id: string;
    items: Media[];
}

export interface CreditGetDetailsResponse_media_seasons {
    air_date: string;
    poster_path: string;
    season_number: number;
}

export interface CreditGetDetailsResponse_media {
    character: string;
    episodes: Unknown[];
    id: number;
    name: string;
    original_name: string;
    seasons: CreditGetDetailsResponse_media_seasons[];
}

export interface CreditGetDetailsResponse {
    credit_type: string;
    department: string;
    id: string;
    job: string;
    media: CreditGetDetailsResponse_media;
    media_type: string;
    person: Genre;
}

export interface TvGetDetails2Response_episodes {
    air_date: string;
    crew: TvShowCrewMember[];
    episode_number: number;
    guest_stars: Unknown[];
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
}

export interface TvGetDetails2Response {
    _id: string;
    air_date: string;
    episodes: TvGetDetails2Response_episodes[];
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
}

export interface CollectionGetImagesResponse_backdrops {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: null;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface CollectionGetImagesResponse {
    backdrops: CollectionGetImagesResponse_backdrops[];
    id: number;
    posters: Image[];
}

export interface ListCheckItemStatusResponse {
    id: string;
    item_present: boolean;
}

export interface MovieGetAlternativeTitlesResponse {
    id: number;
    titles: MovieAlternativeTitle[];
}

export interface CompanyGetDetailsResponse {
    description: string;
    headquarters: string;
    homepage: string;
    id: number;
    logo_path: null;
    name: string;
    parent_company: null;
}

export interface TvGetImages2Response {
    id: number;
    stills: Image[];
}

export interface MovieGetKeywordsResponse {
    id: number;
    keywords: Genre[];
}

export interface TvGetDetails3Response {
    air_date: string;
    crew: TvShowCrewMember[];
    episode_number: number;
    guest_stars: TvShowCredit[];
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
}

export interface CertificationGetMovieCertificationsResponse_certifications {
    AU: Certification[];
    BR: Certification[];
    CA: Certification[];
    DE: Certification[];
    FR: Certification[];
    GB: Certification[];
    IN: Certification[];
    NZ: Certification[];
    US: Certification[];
}

export interface CertificationGetMovieCertificationsResponse {
    certifications: CertificationGetMovieCertificationsResponse_certifications;
}

export interface SearchSearchCollectionsResponse_results {
    backdrop_path: string;
    id: number;
    name: string;
    poster_path: string;
}

export interface SearchSearchCollectionsResponse {
    page: number;
    results: SearchSearchCollectionsResponse_results[];
    total_pages: number;
    total_results: number;
}

export interface SearchSearchCompaniesResponse_results {
    id: number;
    logo_path: string;
    name: string;
}

export interface SearchSearchCompaniesResponse {
    page: number;
    results: SearchSearchCompaniesResponse_results[];
    total_pages: number;
    total_results: number;
}

export interface AuthenticationValidateRequestTokenResponse {
    request_token: string;
    success: boolean;
}

export interface PersonGetChangesResponse_changes_items_original_value_profile {
    file_path: string;
}

export interface PersonGetChangesResponse_changes_items_original_value {
    profile: PersonGetChangesResponse_changes_items_original_value_profile;
}

export interface PersonGetChangesResponse_changes_items {
    action: string;
    id: string;
    original_value: PersonGetChangesResponse_changes_items_original_value;
    time: string;
}

export interface PersonGetChangesResponse_changes {
    items: PersonGetChangesResponse_changes_items[];
    key: string;
}

export interface PersonGetChangesResponse {
    changes: PersonGetChangesResponse_changes[];
}


export interface TvGetImages3Response {
    id: number;
    posters: Image[];
}

export interface AuthenticationCreateRequestTokenResponse {
    expires_at: string;
    request_token: string;
    success: boolean;
}

export interface TvGetLatestResponse {
    backdrop_path: string;
    created_by: Unknown[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    name: string;
    networks: Genre[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Unknown[];
    seasons: TvShowSeason[];
    status: string;
    type: string;
    vote_average: number;
    vote_count: number;
}

export interface MovieGetCreditsResponse_cast {
    cast_id: number;
    character: string;
    credit_id: string;
    id: number;
    name: string;
    order: number;
    profile_path: string;
}

export interface MovieGetCreditsResponse {
    cast: MovieGetCreditsResponse_cast[];
    crew: TvShowCrewMember[];
    id: number;
}

export interface SearchSearchKeywordsResponse {
    page: number;
    results: Genre[];
    total_pages: number;
    total_results: number;
}

export interface SessionRatedTVEpisode {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    rating: number;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
}
export interface AccountRatedTVEpisode {
    _id: string;
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    rating: number;
    season_number: number;
    show_id: number;
    still_path: null;
    vote_average: number;
    vote_count: number;
}


export interface PersonGetImagesResponse_profiles {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: null;
    vote_average: number | number;
    vote_count: number;
    width: number;
}

export interface PersonGetImagesResponse {
    id: number;
    profiles: PersonGetImagesResponse_profiles[];
}

export interface TvGetTranslationsResponse_translations {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export interface TvGetTranslationsResponse {
    id: number;
    translations: TvGetTranslationsResponse_translations[];
}

export interface TvGetKeywordsResponse {
    id: number;
    results: Genre[];
}

export interface TvGetAlternativeTitlesResponse {
    id: number;
    results: MovieAlternativeTitle[];
}

export interface TvGetExternalIDs2Response {
    freebase_id: string;
    freebase_mid: string;
    id: number;
    imdb_id: string;
    tvrage_id: number;
}

export interface PersonGetTaggedImagesResponse_results {
    aspect_ratio: number;
    file_path: string;
    height: number;
    id: string;
    image_type: string;
    iso_639_1: string;
    media: any;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface PersonGetTaggedImagesResponse {
    id: number;
    page: number;
    results: PersonGetTaggedImagesResponse_results[];
}

export interface MovieGetListsResponse_results {
    description: string;
    favorite_count: number;
    id: number;
    iso_639_1: string;
    item_count: number;
    list_type: string;
    name: string;
    poster_path: string;
}

export interface MovieGetListsResponse {
    id: number;
    page: number;
    results: MovieGetListsResponse_results[];
    total_pages: number;
    total_results: number;
}

export interface TvGetChanges3Response_changes_items {
    action: string;
    id: string;
    iso_639_1: string;
    original_value: string;
    time: string;
    value: Object | string;
}

export interface TvGetChanges3Response_changes {
    items: TvGetChanges3Response_changes_items[];
    key: string;
}

export interface TvGetChanges3Response {
    changes: TvGetChanges3Response_changes[];
}

export interface MovieGetTranslationsResponse_translations {
    english_name: string;
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
}

export interface MovieGetTranslationsResponse {
    id: number;
    translations: MovieGetTranslationsResponse_translations[];
}

export interface AccountGetDetailsResponse_avatar_gravatar {
    hash: string;
}

export interface AccountGetDetailsResponse_avatar {
    gravatar: AccountGetDetailsResponse_avatar_gravatar;
}

export interface AccountDetails {
    avatar: AccountGetDetailsResponse_avatar;
    id: number;
    include_adult: boolean;
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
    username: string;
}

export interface TvGetChangesRequest {
    api_key?: string;
    end_date?: string;
    episode_id?: number;
    page?: number;
    start_date?: string;
}

export interface TvGetAccountStatesRequest {
    api_key?: string;
    guest_session_id?: string;
    language?: string;
    session_id?: string;
    tv_id?: number;
}

export interface MovieGetDetailsRequest {
    api_key?: string;
    append_to_response?: string;
    language?: string;
    movie_id?: number;
}

export interface TvGetAccountStates2Request {
    api_key?: string;
    episode_number?: number;
    guest_session_id?: string;
    season_number?: number;
    session_id?: string;
    tv_id?: number;
}

export interface MovieRateMovieRequest {
    api_key?: string;
    body?: any;
    "Content-Type"?: string;
    guest_session_id?: string;
    movie_id?: number;
    session_id?: string;
}

export interface MovieDeleteRatingRequest {
    api_key?: string;
    "Content-Type"?: string;
    guest_session_id?: string;
    movie_id?: number;
    session_id?: string;
}

export interface DiscoverMovieDiscoverRequest {
    api_key?: string;
    certification?: string;
    certification_country?: string;
    "certification.lte"?: string;
    include_adult?: boolean;
    include_video?: boolean;
    language?: string;
    page?: number;
    "primary_release_date.gte"?: string;
    "primary_release_date.lte"?: string;
    primary_release_year?: number;
    region?: string;
    "release_date.gte"?: string;
    "release_date.lte"?: string;
    sort_by?: string;
    "vote_average.gte"?: number;
    "vote_average.lte"?: number;
    "vote_count.gte"?: number;
    "vote_count.lte"?: number;
    with_cast?: string;
    with_companies?: string;
    with_crew?: string;
    with_genres?: string;
    with_keywords?: string;
    with_original_language?: string;
    with_people?: string;
    with_release_type?: number;
    "with_runtime.gte"?: number;
    "with_runtime.lte"?: number;
    without_genres?: string;
    year?: number;
}

export interface AuthenticationCreateSessionRequest {
    api_key?: string;
    request_token?: string;
}

export interface TvGetChanges2Request {
    api_key?: string;
    end_date?: string;
    page?: number;
    start_date?: string;
    tv_id?: number;
}

export interface AccountGetCreatedListsRequest {
    account_id?: number;
    api_key?: string;
    language?: string;
    session_id?: string;
}

export interface FindFindbyIDRequest {
    api_key?: string;
    external_id?: string;
    external_source?: string;
    language?: string;
}

export interface MovieGetVideosRequest {
    api_key?: string;
    language?: string;
    movie_id?: string;
}

export interface KeywordGetMoviesRequest {
    api_key?: string;
    include_adult?: boolean;
    keyword_id?: number;
    language?: string;
}

export interface TvGetDetailsRequest {
    api_key?: string;
    append_to_response?: string;
    language?: string;
    tv_id?: number;
}

export interface PersonGetDetailsRequest {
    api_key?: string;
    append_to_response?: string;
    language?: string;
    person_id?: number;
}

export interface TvRateTVEpisodeRequest {
    api_key?: string;
    body?: any;
    "Content-Type"?: string;
    episode_number?: number;
    guest_session_id?: string;
    season_number?: number;
    session_id?: string;
    tv_id?: number;
}

export interface TvDeleteRatingRequest {
    api_key?: string;
    "Content-Type"?: string;
    episode_number?: number;
    guest_session_id?: string;
    season_number?: number;
    session_id?: string;
    tv_id?: number;
}

export interface MovieGetAccountStatesRequest {
    api_key?: string;
    guest_session_id?: string;
    movie_id?: string;
    session_id?: string;
}

export interface MovieGetImagesRequest {
    api_key?: string;
    include_image_language?: string;
    language?: string;
    movie_id?: number;
}

export interface TvGetAccountStates3Request {
    api_key?: string;
    guest_session_id?: string;
    language?: string;
    season_number?: number;
    session_id?: string;
    tv_id?: number;
}

export interface CompanyGetMoviesRequest {
    api_key?: string;
    company_id?: number;
    language?: string;
}

export interface TvGetVideosRequest {
    api_key?: string;
    episode_number?: number;
    language?: string;
    season_number?: number;
    tv_id?: number;
}

export interface MovieGetChangesRequest {
    api_key?: string;
    end_date?: string;
    movie_id?: string;
    page?: number;
    start_date?: string;
}

export interface ReviewGetDetailsRequest {
    api_key?: string;
    review_id?: string;
}

export interface ListGetDetailsRequest {
    api_key?: string;
    language?: string;
    list_id?: string | number;
}

export interface CreditGetDetailsRequest {
    api_key?: string;
    credit_id?: string;
}

export interface PagedRequest {
    page?: number;
}
export interface SearchMoviesRequest {
    api_key?: string;
    include_adult?: boolean;
    language?: string;
    page?: number;
    primary_release_year?: number;
    query?: string;
    region?: string;
    year?: number;
}

export interface TvGetDetails2Request {
    api_key?: string;
    append_to_response?: string;
    language?: string;
    season_number?: number;
    tv_id?: number;
}

export interface SearchSearchTVShowsRequest {
    api_key?: string;
    first_air_date_year?: number;
    language?: string;
    page?: number;
    query?: string;
}

export interface NetworkGetDetailsRequest {
    api_key?: string;
    network_id?: number;
}

export interface ListCheckItemStatusRequest {
    api_key?: string;
    list_id?: string;
    movie_id?: number;
}

export interface MovieGetAlternativeTitlesRequest {
    api_key?: string;
    country?: string;
    movie_id?: number;
}

export interface CompanyGetDetailsRequest {
    api_key?: string;
    company_id?: number;
}

export interface TvGetDetails3Request {
    api_key?: string;
    append_to_response?: string;
    episode_number?: number;
    language?: string;
    season_number?: number;
    tv_id?: number;
}

export interface TvRateTVShowRequest {
    api_key?: string;
    body?: any;
    "Content-Type"?: string;
    guest_session_id?: string;
    session_id?: string;
    tv_id?: number;
}

export interface TvDeleteRating2Request {
    api_key?: string;
    "Content-Type"?: string;
    guest_session_id?: string;
    session_id?: string;
    tv_id?: number;
}

export interface SearchSearchCollectionsRequest {
    api_key?: string;
    language?: string;
    page?: number;
    query?: string;
}

export interface ListClearListRequest {
    api_key?: string;
    confirm?: boolean;
    list_id?: string;
    session_id?: string;
}

export interface GenreGetMoviesRequest {
    api_key?: string;
    genre_id?: number;
    include_adult?: boolean;
    language?: string;
    sort_by?: string;
}

export interface ListCreateListRequest {
    api_key?: string;
    body?: ListCreateListRequestBody;
    "Content-Type"?: string;
    session_id?: string;
}
export interface ListCreateListRequestBody {
    name?: string;
    description?: string;
    language?: string;
}
export interface ListCreateListResponse {
    status_message: string,
    success: boolean,
    status_code: number,
    list_id: number,
}

export interface DiscoverTVDiscoverRequest {
    "air_date.gte"?: string;
    "air_date.lte"?: string;
    api_key?: string;
    first_air_date_year?: number;
    "first_air_date.gte"?: string;
    "first_air_date.lte"?: string;
    include_null_first_air_dates?: boolean;
    language?: string;
    page?: number;
    sort_by?: string;
    timezone?: string;
    "vote_average.gte"?: number;
    "vote_count.gte"?: number;
    with_genres?: string;
    with_networks?: string;
    with_original_language?: string;
    "with_runtime.gte"?: number;
    "with_runtime.lte"?: number;
    without_genres?: string;
}

export interface AuthenticationValidateRequestTokenRequest {
    api_key?: string;
    password?: string;
    request_token?: string;
    username?: string;
}

export interface PersonGetChangesRequest {
    api_key?: string;
    end_date?: string;
    language?: string;
    page?: number;
    person_id?: number;
    start_date?: string;
}

export interface AccountGetRatedTVEpisodesRequest {
    account_id?: string;
    api_key?: string;
    language?: string;
    session_id?: string;
    sort_by?: string;
}

export interface PersonGetImagesRequest {
    api_key?: string;
    person_id?: number;
}

export interface TvGetKeywordsRequest {
    api_key?: string;
    tv_id?: number;
}

export interface PersonGetTaggedImagesRequest {
    api_key?: string;
    language?: string;
    page?: number;
    person_id?: number;
}

export interface TvGetChanges3Request {
    api_key?: string;
    end_date?: string;
    page?: number;
    season_id?: number;
    start_date?: string;
}

export interface KeywordGetDetailsRequest {
    api_key?: string;
    keyword_id?: number;
}

export interface AccountGetDetailsRequest {
    api_key?: string;
    session_id?: string;
}

export interface AccountStates {
    favorite: boolean;
    id: number;
    rated: Object | boolean;
    watchlist: boolean;
}

export interface PopularPerson {
    adult: boolean;
    id: number;
    known_for: any[];
    profile_path: string;
}


export interface Genre {
    id: number;
    name: string;
}

export interface Response {
    status_code: number;
    status_message: string;
}

export interface Image {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string;
    vote_average: number;
    vote_count: number;
    width: number;
}


export interface ChangeList {
    adult: boolean;
    id: number;
}


export interface Media {
    id: number;
    backdrop_path: string;
    genre_ids: number[];
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    original_language: string;

    /** added after response */
    poster_url?: string;
    /** added after response */
    backdrop_url?: string;
    /** added after response */
    poster?: { [key: string]: string };
    /** added after response */
    backdrop?: { [key: string]: string };
    /** Available in multisearch */
    media_type?: MediaType;
    /** TODO */
    name_or_title?: string;
}


export type MediaType = "movie" | "tv" | "person";

export interface Movie extends Media {
    title: string;

    adult: boolean;
    original_title: string;
    release_date: string;
    video: boolean;

}




export interface TvShow extends Media {
    name: string;

    first_air_date: string;
    origin_country: string[];
    original_name: string;
}
export interface TvShowDetails extends TvShow {
    /** only returned if req.append_to_response includes "account_states" */
    account_states?:AccountStates;
    created_by: TvGetDetailsResponse_created_by[];
    episode_run_time: number[];
    genres: Genre[];
    homepage: string;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    networks: Genre[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Genre[];
    seasons: TvShowSeason[];
    status: string;
    type: string;

    /** from base class **/
    //backdrop_path: string;
    //first_air_date: string;
    //id: number;
    //name: string;
    //original_language: string;
    //original_name: string;
    //vote_average: number;
    //vote_count: number;
}

export interface MovieDetails extends Movie {
    /** only returned if req.append_to_response includes "account_states" */
    account_states?:AccountStates;
    belongs_to_collection: Object;
    budget: number;

    genres: Genre[];
    homepage: string;
    imdb_id: string;
    popularity: number;
    production_companies: Genre[];
    production_countries: ProductionCountry[];
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;

    /** genre_ids is not available in details */
    genre_ids: number[];

    /** from base class: */
    //adult: boolean;
    //backdrop_path: string;
    //id: number;
    //original_language: string;
    //original_title: string;
    //overview: string;
    //poster_path: string;
    //release_date: string;
    //title: string;
    //video: boolean;
    //vote_average: number;
    //vote_count: number;
}



export interface Certification {
    certification: string;
    meaning: string;
    order: number;
}


export interface Unknown {
}

export interface Video {
    id: string;
    iso_3166_1: string;
    iso_639_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
}

export interface GetVideosResponse {
    id: number;
    results: Video[];
}

export interface KeywordGetMoviesResponseBase {
    id: number;
    page: number;
    results: Movie[];
}

export interface TvShowSeason {
    air_date: string;
    episode_count: number;
    id: number;
    poster_path: string;
    season_number: number;
}

export interface TvShowCredit {
    character: string;
    credit_id: string;
    id: number;
    name: string;
    order: number;
    profile_path: string;
}

export interface TvShowCrewMember {
    credit_id: string;
    department: string;
    id: number;
    job: string;
    name: string;
    profile_path: string;
}

export interface Person {
    adult: boolean;
    also_known_as: Unknown[];
    biography: string;
    birthday: string;
    deathday: string;
    gender: number;
    homepage: string;
    id: number;
    imdb_id: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
    /** Available in multisearch */
    media_type?: MediaType;
}


export interface GenreGetMovieListResponseBase {
    genres: Genre[];
}

export interface RatedMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    rating: number;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}


export interface MovieAlternativeTitle {
    iso_3166_1: string;
    title: string;
}


export interface TvShowCreditsResponse {
    cast: TvShowCredit[];
    crew: TvShowCrewMember[];
    id: number;
}

export interface RatedTvShow {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    name: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    rating: number;
    vote_average: number;
    vote_count: number;
}


export interface PersonGetPopularRequestBase {
    api_key?: string;
    language?: string;
    page?: number;
}

export interface TvGetImagesRequestBase {
    api_key?: string;
    language?: string;
    tv_id?: number;
}

export interface MovieGetMovieChangeListRequestBase {
    api_key?: string;
    end_date?: string;
    start_date?: string;
}

export interface GetApiConfigurationRequest {
    api_key?: string;
}

export interface AccountGetTVShowWatchlistRequestBase {
    account_id?: number;
    api_key?: string;
    language?: string;
    session_id?: string;
    sort_by?: string;
}

export interface TvGetTVEpisodeExternalIDsRequestBase {
    api_key?: string;
    episode_number?: number;
    season_number?: number;
    tv_id?: number;
}

export interface PersonRequest {
    api_key?: string;
    language?: string;
    person_id?: number;
}

export interface MovieRequest {
    api_key?: string;
    language?: string;
    movie_id?: number;
    page?: number;
}

export interface MovieGetLatestRequestBase {
    api_key?: string;
    language?: string;
}

export interface TvGetExternalIDsRequestBase {
    api_key?: string;
    language?: string;
    season_number?: number;
    tv_id?: number;
}

export interface TvGetSimilarTVShowsRequestBase {
    api_key?: string;
    language?: string;
    page?: number;
    tv_id?: number;
}

export interface MovieGetReleaseDatesRequestBase {
    api_key?: string;
    movie_id?: number;
}

export interface CollectionGetDetailsRequestBase {
    api_key?: string;
    collection_id?: number;
    language?: string;
}

export interface MovieGetNowPlayingRequestBase {
    api_key?: string;
    language?: string;
    page?: number;
    region?: string;
}

export interface ListAddMovieRequestBase {
    api_key?: string;
    "Content-Type"?: string;
    list_id?: string;
    session_id?: string;
    body?: {
        media_id: number
    }
}

export interface AccountAddtoWatchlistRequestBase {
    account_id?: number;
    api_key?: string;
    body?: any;
    "Content-Type"?: string;
    session_id?: string;
}

export interface SearchSearchCompaniesRequestBase {
    api_key?: string;
    page?: number;
    query?: string;
}

export interface SearchSearchPeopleRequestBase {
    api_key?: string;
    include_adult?: boolean;
    language?: string;
    page?: number;
    query?: string;
    region?: string;
}

export interface Guest_sessionGetRatedMoviesRequestBase {
    api_key?: string;
    guest_session_id?: string;
    language?: string;
    sort_by?: string;
}
export interface PagedResponse<T> {
    page?: number;
    results?: T[];
    total_pages?: number;
    total_results?: number;
}

export interface ApiMetadata {
    path: string;
    method: string;
}

export interface RateLimit {
    limit: number;
    remaining: number;
    reset: number;
}


export let TmdbApiMetadata: Record<keyof TmdbApi, ApiMetadata> = {
    tvGetChanges: { path: "/tv/episode/{episode_id}/changes", method: "GET" },
    tvGetAccountStates: { path: "/tv/{tv_id}/account_states", method: "GET" },
    personGetPopular: { path: "/person/popular", method: "GET" },
    movieGetDetails: { path: "/movie/{movie_id}", method: "GET" },
    tvGetAccountStates2: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/account_states", method: "GET" },
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
    tvGetTVEpisodeExternalIDs: { path: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}/external_ids", method: "GET" },
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
    tvGetDetails2: { path: "/tv/{tv_id}/season/{season_number}", method: "GET" },
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
    accountGetDetails: { path: "/account", method: "GET" }
};
