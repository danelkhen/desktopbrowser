export module MyModule {
    export type object = Object;
    export type integer = number;
    export interface Client {
        accountAddtoWatchlist(req: AccountAddtoWatchlistRequestBase): any;
        accountGetCreatedLists(req: AccountGetCreatedListsRequest): AccountGetCreatedListsResponse;
        accountGetDetails(req: AccountGetDetailsRequest): AccountGetDetailsResponse;
        accountGetFavoriteMovies(req: AccountGetTVShowWatchlistRequestBase): DiscoverMovieDiscoverResponseBase;
        accountGetFavoriteTVShows(req: AccountGetTVShowWatchlistRequestBase): AccountGetTVShowWatchlistResponseBase;
        accountGetMovieWatchlist(req: AccountGetTVShowWatchlistRequestBase): DiscoverMovieDiscoverResponseBase;
        accountGetRatedMovies(req: AccountGetTVShowWatchlistRequestBase): AccountGetRatedMoviesResponseBase;
        accountGetRatedTVEpisodes(req: AccountGetRatedTVEpisodesRequest): AccountGetRatedTVEpisodesResponse;
        accountGetRatedTVShows(req: AccountGetTVShowWatchlistRequestBase): Guest_sessionGetRatedTVShowsResponseBase;
        accountGetTVShowWatchlist(req: AccountGetTVShowWatchlistRequestBase): AccountGetTVShowWatchlistResponseBase;
        accountMarkasFavorite(req: AccountAddtoWatchlistRequestBase): any;
        authenticationCreateGuestSession(req: CertificationGetTVCertificationsRequestBase): AuthenticationCreateGuestSessionResponse;
        authenticationCreateRequestToken(req: CertificationGetTVCertificationsRequestBase): AuthenticationCreateRequestTokenResponse;
        authenticationCreateSession(req: AuthenticationCreateSessionRequest): AuthenticationCreateSessionResponse;
        authenticationValidateRequestToken(req: AuthenticationValidateRequestTokenRequest): AuthenticationValidateRequestTokenResponse;
        certificationGetMovieCertifications(req: CertificationGetTVCertificationsRequestBase): CertificationGetMovieCertificationsResponse;
        certificationGetTVCertifications(req: CertificationGetTVCertificationsRequestBase): CertificationGetTVCertificationsResponse;
        collectionGetDetails(req: CollectionGetDetailsRequestBase): CollectionGetDetailsResponse;
        collectionGetImages(req: CollectionGetDetailsRequestBase): CollectionGetImagesResponse;
        companyGetDetails(req: CompanyGetDetailsRequest): CompanyGetDetailsResponse;
        companyGetMovies(req: CompanyGetMoviesRequest): KeywordGetMoviesResponseBase;
        configurationGetAPIConfiguration(req: CertificationGetTVCertificationsRequestBase): ConfigurationGetAPIConfigurationResponse;
        creditGetDetails(req: CreditGetDetailsRequest): CreditGetDetailsResponse;
        discoverMovieDiscover(req: DiscoverMovieDiscoverRequest): DiscoverMovieDiscoverResponseBase;
        discoverTVDiscover(req: DiscoverTVDiscoverRequest): AccountGetTVShowWatchlistResponseBase;
        findFindbyID(req: FindFindbyIDRequest): FindFindbyIDResponse;
        genreGetMovieList(req: MovieGetLatestRequestBase): GenreGetMovieListResponseBase;
        genreGetMovies(req: GenreGetMoviesRequest): KeywordGetMoviesResponseBase;
        genreGetTVList(req: MovieGetLatestRequestBase): GenreGetMovieListResponseBase;
        guest_sessionGetRatedMovies(req: Guest_sessionGetRatedMoviesRequestBase): AccountGetRatedMoviesResponseBase;
        guest_sessionGetRatedTVEpisodes(req: Guest_sessionGetRatedMoviesRequestBase): Guest_sessionGetRatedTVEpisodesResponse;
        guest_sessionGetRatedTVShows(req: Guest_sessionGetRatedMoviesRequestBase): Guest_sessionGetRatedTVShowsResponseBase;
        jobGetJobs(req: CertificationGetTVCertificationsRequestBase): JobGetJobsResponse;
        keywordGetDetails(req: KeywordGetDetailsRequest): MovieGetDetailsResponse_genresBase;
        keywordGetMovies(req: KeywordGetMoviesRequest): KeywordGetMoviesResponseBase;
        listAddMovie(req: ListAddMovieRequestBase): any;
        listCheckItemStatus(req: ListCheckItemStatusRequest): ListCheckItemStatusResponse;
        listClearList(req: ListClearListRequest): any;
        listCreateList(req: ListCreateListRequest): any;
        listGetDetails(req: ListGetDetailsRequest): ListGetDetailsResponse;
        listRemoveMovie(req: ListAddMovieRequestBase): MovieDeleteRatingResponseBase;
        movieDeleteRating(req: MovieDeleteRatingRequest): MovieDeleteRatingResponseBase;
        movieGetAccountStates(req: MovieGetAccountStatesRequest): TvGetAccountStatesResponseBase;
        movieGetAlternativeTitles(req: MovieGetAlternativeTitlesRequest): MovieGetAlternativeTitlesResponse;
        movieGetChanges(req: MovieGetChangesRequest): MovieGetChangesResponse;
        movieGetCredits(req: MovieGetReleaseDatesRequestBase): MovieGetCreditsResponse;
        movieGetDetails(req: MovieGetDetailsRequest): MovieGetDetailsResponse;
        movieGetImages(req: MovieGetImagesRequest): MovieGetImagesResponse;
        movieGetKeywords(req: MovieGetReleaseDatesRequestBase): MovieGetKeywordsResponse;
        movieGetLatest(req: MovieGetLatestRequestBase): MovieGetLatestResponse;
        movieGetLists(req: MovieGetRecommendationsRequestBase): MovieGetListsResponse;
        movieGetMovieChangeList(req: MovieGetMovieChangeListRequestBase): MovieGetMovieChangeListResponseBase;
        movieGetNowPlaying(req: MovieGetNowPlayingRequestBase): DiscoverMovieDiscoverResponseBase;
        movieGetPopular(req: MovieGetNowPlayingRequestBase): DiscoverMovieDiscoverResponseBase;
        movieGetRecommendations(req: MovieGetRecommendationsRequestBase): MovieGetRecommendationsResponseBase;
        movieGetReleaseDates(req: MovieGetReleaseDatesRequestBase): MovieGetReleaseDatesResponse;
        movieGetReviews(req: MovieGetRecommendationsRequestBase): MovieGetReviewsResponse;
        movieGetSimilarMovies(req: MovieGetRecommendationsRequestBase): MovieGetRecommendationsResponseBase;
        movieGetTopRated(req: MovieGetNowPlayingRequestBase): DiscoverMovieDiscoverResponseBase;
        movieGetTranslations(req: MovieGetReleaseDatesRequestBase): MovieGetTranslationsResponse;
        movieGetUpcoming(req: MovieGetNowPlayingRequestBase): DiscoverMovieDiscoverResponseBase;
        movieGetVideos(req: MovieGetVideosRequest): MovieGetVideosResponseBase;
        movieRateMovie(req: MovieRateMovieRequest): any;
        networkGetDetails(req: NetworkGetDetailsRequest): MovieGetDetailsResponse_genresBase;
        personGetChanges(req: PersonGetChangesRequest): PersonGetChangesResponse;
        personGetCombinedCredits(req: PersonGetExternalIDsRequestBase): PersonGetCombinedCreditsResponse;
        personGetDetails(req: PersonGetDetailsRequest): PersonGetDetailsResponseBase;
        personGetExternalIDs(req: PersonGetExternalIDsRequestBase): PersonGetExternalIDsResponse;
        personGetImages(req: PersonGetImagesRequest): PersonGetImagesResponse;
        personGetLatest(req: MovieGetLatestRequestBase): PersonGetDetailsResponseBase;
        personGetMovieCredits(req: PersonGetExternalIDsRequestBase): PersonGetMovieCreditsResponse;
        personGetPersonChangeList(req: MovieGetMovieChangeListRequestBase): MovieGetMovieChangeListResponseBase;
        personGetPopular(req: PersonGetPopularRequestBase): PersonGetPopularResponseBase;
        personGetTaggedImages(req: PersonGetTaggedImagesRequest): PersonGetTaggedImagesResponse;
        personGetTVCredits(req: PersonGetExternalIDsRequestBase): PersonGetTVCreditsResponse;
        reviewGetDetails(req: ReviewGetDetailsRequest): ReviewGetDetailsResponse;
        searchMultiSearch(req: SearchSearchPeopleRequestBase): SearchMultiSearchResponse;
        searchSearchCollections(req: SearchSearchCollectionsRequest): SearchSearchCollectionsResponse;
        searchSearchCompanies(req: SearchSearchCompaniesRequestBase): SearchSearchCompaniesResponse;
        searchSearchKeywords(req: SearchSearchCompaniesRequestBase): SearchSearchKeywordsResponse;
        searchSearchMovies(req: SearchSearchMoviesRequest): DiscoverMovieDiscoverResponseBase;
        searchSearchPeople(req: SearchSearchPeopleRequestBase): PersonGetPopularResponseBase;
        searchSearchTVShows(req: SearchSearchTVShowsRequest): AccountGetTVShowWatchlistResponseBase;
        timezonesGetList(req: CertificationGetTVCertificationsRequestBase): MovieGetLatestResponse_production_companiesBase[];
        tvDeleteRating(req: TvDeleteRatingRequest): MovieDeleteRatingResponseBase;
        tvDeleteRating2(req: TvDeleteRating2Request): MovieDeleteRatingResponseBase;
        tvGetAccountStates(req: TvGetAccountStatesRequest): TvGetAccountStatesResponseBase;
        tvGetAccountStates2(req: TvGetAccountStates2Request): TvGetAccountStates2Response;
        tvGetAccountStates3(req: TvGetAccountStates3Request): TvGetAccountStates3Response;
        tvGetAlternativeTitles(req: TvGetImagesRequestBase): TvGetAlternativeTitlesResponse;
        tvGetChanges(req: TvGetChangesRequest): TvGetChangesResponse;
        tvGetChanges2(req: TvGetChanges2Request): TvGetChanges2Response;
        tvGetChanges3(req: TvGetChanges3Request): TvGetChanges3Response;
        tvGetContentRatings(req: TvGetImagesRequestBase): TvGetContentRatingsResponse;
        tvGetCredits(req: TvGetTVEpisodeExternalIDsRequestBase): TvGetCreditsResponse;
        tvGetCredits2(req: TvGetExternalIDsRequestBase): TvGetCredits2ResponseBase;
        tvGetCredits3(req: TvGetImagesRequestBase): TvGetCredits2ResponseBase;
        tvGetDetails(req: TvGetDetailsRequest): TvGetDetailsResponse;
        tvGetDetails2(req: TvGetDetails2Request): TvGetDetails2Response;
        tvGetDetails3(req: TvGetDetails3Request): TvGetDetails3Response;
        tvGetExternalIDs(req: TvGetExternalIDsRequestBase): TvGetExternalIDsResponse;
        tvGetExternalIDs2(req: TvGetImagesRequestBase): TvGetExternalIDs2Response;
        tvGetImages(req: TvGetImagesRequestBase): TvGetImagesResponse;
        tvGetImages2(req: TvGetTVEpisodeExternalIDsRequestBase): TvGetImages2Response;
        tvGetImages3(req: TvGetExternalIDsRequestBase): TvGetImages3Response;
        tvGetKeywords(req: TvGetKeywordsRequest): TvGetKeywordsResponse;
        tvGetLatest(req: MovieGetLatestRequestBase): TvGetLatestResponse;
        tvGetPopular(req: PersonGetPopularRequestBase): AccountGetTVShowWatchlistResponseBase;
        tvGetRecommendations(req: TvGetSimilarTVShowsRequestBase): AccountGetTVShowWatchlistResponseBase;
        tvGetSimilarTVShows(req: TvGetSimilarTVShowsRequestBase): AccountGetTVShowWatchlistResponseBase;
        tvGetTopRated(req: PersonGetPopularRequestBase): AccountGetTVShowWatchlistResponseBase;
        tvGetTranslations(req: TvGetImagesRequestBase): TvGetTranslationsResponse;
        tvGetTVAiringToday(req: PersonGetPopularRequestBase): AccountGetTVShowWatchlistResponseBase;
        tvGetTVChangeList(req: MovieGetMovieChangeListRequestBase): MovieGetMovieChangeListResponseBase;
        tvGetTVEpisodeExternalIDs(req: TvGetTVEpisodeExternalIDsRequestBase): TvGetTVEpisodeExternalIDsResponse;
        tvGetTVOnTheAir(req: PersonGetPopularRequestBase): AccountGetTVShowWatchlistResponseBase;
        tvGetVideos(req: TvGetVideosRequest): MovieGetVideosResponseBase;
        tvGetVideos2(req: TvGetImagesRequestBase): MovieGetVideosResponseBase;
        tvGetVideos3(req: TvGetExternalIDsRequestBase): MovieGetVideosResponseBase;
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

    export interface MovieGetDetailsResponse_production_countries {
        iso_3166_1: string;
        name: string;
    }

    export interface MovieGetDetailsResponse_spoken_languages {
        iso_639_1: string;
        name: string;
    }

    export interface MovieGetDetailsResponse {
        adult: boolean;
        backdrop_path: string;
        belongs_to_collection: Object;
        budget: number;
        genres: MovieGetDetailsResponse_genresBase[];
        homepage: string;
        id: number;
        imdb_id: string;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        production_companies: MovieGetDetailsResponse_genresBase[];
        production_countries: MovieGetDetailsResponse_production_countries[];
        release_date: string;
        revenue: number;
        runtime: number;
        spoken_languages: MovieGetDetailsResponse_spoken_languages[];
        status: string;
        tagline: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }

    export interface TvGetAccountStates2Response {
        id: number;
        rated: object | boolean;
    }

    export interface TvGetImagesResponse {
        backdrops: TvGetImagesResponse_backdropsBase[];
        id: number;
        posters: TvGetImagesResponse_backdropsBase[];
    }

    export interface AuthenticationCreateSessionResponse {
        session_id: string;
        success: boolean;
    }

    export interface CertificationGetTVCertificationsResponse_certifications {
        AU: CertificationGetTVCertificationsResponse_certifications_USBase[];
        BR: CertificationGetTVCertificationsResponse_certifications_USBase[];
        CA: CertificationGetTVCertificationsResponse_certifications_USBase[];
        DE: CertificationGetTVCertificationsResponse_certifications_USBase[];
        FR: CertificationGetTVCertificationsResponse_certifications_USBase[];
        GB: CertificationGetTVCertificationsResponse_certifications_USBase[];
        KR: CertificationGetTVCertificationsResponse_certifications_USBase[];
        RU: CertificationGetTVCertificationsResponse_certifications_USBase[];
        TH: CertificationGetTVCertificationsResponse_certifications_USBase[];
        US: CertificationGetTVCertificationsResponse_certifications_USBase[];
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
        genres: MovieGetDetailsResponse_genresBase[];
        homepage: string;
        id: number;
        imdb_id: string;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        production_companies: MovieGetLatestResponse_production_companiesBase[];
        production_countries: MovieGetLatestResponse_production_companiesBase[];
        release_date: string;
        revenue: number;
        runtime: number;
        spoken_languages: MovieGetLatestResponse_production_companiesBase[];
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

    export interface AccountGetCreatedListsResponse_results {
        description: string;
        favorite_count: number;
        id: number;
        iso_639_1: string;
        item_count: number;
        list_type: string;
        name: string;
        poster_path: null;
    }

    export interface AccountGetCreatedListsResponse {
        page: number;
        results: AccountGetCreatedListsResponse_results[];
        total_pages: number;
        total_results: number;
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
        movie_results: DiscoverMovieDiscoverResponse_resultsBase[];
    }

    export interface TvGetDetailsResponse_created_by {
        id: number;
        name: string;
        profile_path: string;
    }

    export interface TvGetDetailsResponse {
        backdrop_path: string;
        created_by: TvGetDetailsResponse_created_by[];
        episode_run_time: number[];
        first_air_date: string;
        genres: MovieGetDetailsResponse_genresBase[];
        homepage: string;
        id: number;
        in_production: boolean;
        languages: string[];
        last_air_date: string;
        name: string;
        networks: MovieGetDetailsResponse_genresBase[];
        number_of_episodes: number;
        number_of_seasons: number;
        origin_country: string[];
        original_language: string;
        original_name: string;
        overview: string;
        popularity: number;
        poster_path: string;
        production_companies: MovieGetDetailsResponse_genresBase[];
        seasons: TvGetDetailsResponse_seasonsBase[];
        status: string;
        type: string;
        vote_average: number;
        vote_count: number;
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
        cast: TvGetCreditsResponse_castBase[];
        crew: TvGetCreditsResponse_crewBase[];
        guest_stars: TvGetCreditsResponse_castBase[];
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
        backdrops: MovieGetImagesResponse_backdropsBase[];
        id: number;
        posters: MovieGetImagesResponse_backdropsBase[];
    }

    export interface TvGetAccountStates3Response_results {
        episode_number: number;
        id: number;
        rated: boolean | object;
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

    export interface ConfigurationGetAPIConfigurationResponse {
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

    export interface ListGetDetailsResponse {
        created_by: string;
        description: string;
        favorite_count: number;
        id: string;
        items: DiscoverMovieDiscoverResponse_resultsBase[];
    }

    export interface CreditGetDetailsResponse_media_seasons {
        air_date: string;
        poster_path: string;
        season_number: number;
    }

    export interface CreditGetDetailsResponse_media {
        character: string;
        episodes: MovieGetLatestResponse_production_companiesBase[];
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
        person: MovieGetDetailsResponse_genresBase;
    }

    export interface TvGetDetails2Response_episodes {
        air_date: string;
        crew: TvGetCreditsResponse_crewBase[];
        episode_number: number;
        guest_stars: MovieGetLatestResponse_production_companiesBase[];
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
        posters: TvGetImagesResponse_backdropsBase[];
    }

    export interface ListCheckItemStatusResponse {
        id: string;
        item_present: boolean;
    }

    export interface MovieGetAlternativeTitlesResponse {
        id: number;
        titles: MovieGetAlternativeTitlesResponse_titlesBase[];
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
        stills: TvGetImages2Response_stillsBase[];
    }

    export interface MovieGetKeywordsResponse {
        id: number;
        keywords: MovieGetDetailsResponse_genresBase[];
    }

    export interface TvGetDetails3Response {
        air_date: string;
        crew: TvGetCreditsResponse_crewBase[];
        episode_number: number;
        guest_stars: TvGetCreditsResponse_castBase[];
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
        AU: CertificationGetTVCertificationsResponse_certifications_USBase[];
        BR: CertificationGetTVCertificationsResponse_certifications_USBase[];
        CA: CertificationGetTVCertificationsResponse_certifications_USBase[];
        DE: CertificationGetTVCertificationsResponse_certifications_USBase[];
        FR: CertificationGetTVCertificationsResponse_certifications_USBase[];
        GB: CertificationGetTVCertificationsResponse_certifications_USBase[];
        IN: CertificationGetTVCertificationsResponse_certifications_USBase[];
        NZ: CertificationGetTVCertificationsResponse_certifications_USBase[];
        US: CertificationGetTVCertificationsResponse_certifications_USBase[];
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

    export interface AccountGetRatedTVEpisodesResponse_results {
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

    export interface AccountGetRatedTVEpisodesResponse {
        page: number;
        results: AccountGetRatedTVEpisodesResponse_results[];
        total_pages: number;
        total_results: number;
    }

    export interface TvGetImages3Response {
        id: number;
        posters: TvGetImages2Response_stillsBase[];
    }

    export interface AuthenticationCreateRequestTokenResponse {
        expires_at: string;
        request_token: string;
        success: boolean;
    }

    export interface TvGetLatestResponse {
        backdrop_path: string;
        created_by: MovieGetLatestResponse_production_companiesBase[];
        episode_run_time: number[];
        first_air_date: string;
        genres: MovieGetDetailsResponse_genresBase[];
        homepage: string;
        id: number;
        in_production: boolean;
        languages: string[];
        last_air_date: string;
        name: string;
        networks: MovieGetDetailsResponse_genresBase[];
        number_of_episodes: number;
        number_of_seasons: number;
        origin_country: string[];
        original_language: string;
        original_name: string;
        overview: string;
        popularity: number;
        poster_path: string;
        production_companies: MovieGetLatestResponse_production_companiesBase[];
        seasons: TvGetDetailsResponse_seasonsBase[];
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
        crew: TvGetCreditsResponse_crewBase[];
        id: number;
    }

    export interface SearchSearchKeywordsResponse {
        page: number;
        results: MovieGetDetailsResponse_genresBase[];
        total_pages: number;
        total_results: number;
    }

    export interface Guest_sessionGetRatedTVEpisodesResponse_results {
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

    export interface Guest_sessionGetRatedTVEpisodesResponse {
        page: number;
        results: Guest_sessionGetRatedTVEpisodesResponse_results[];
        total_pages: number;
        total_results: number;
    }

    export interface SearchMultiSearchResponse {
        page: number;
        results: any[];
    }

    export interface PersonGetImagesResponse_profiles {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: null;
        vote_average: integer | number;
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
        results: MovieGetDetailsResponse_genresBase[];
    }

    export interface TvGetAlternativeTitlesResponse {
        id: number;
        results: MovieGetAlternativeTitlesResponse_titlesBase[];
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
        value: object | string;
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

    export interface AccountGetDetailsResponse {
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
        list_id?: string;
    }

    export interface CreditGetDetailsRequest {
        api_key?: string;
        credit_id?: string;
    }

    export interface SearchSearchMoviesRequest {
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
        body?: any;
        "Content-Type"?: string;
        session_id?: string;
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

    export interface TvGetAccountStatesResponseBase {
        favorite: boolean;
        id: number;
        rated: object | boolean;
        watchlist: boolean;
    }

    export interface PersonGetPopularResponse_resultsBase {
        adult: boolean;
        id: number;
        known_for: any[];
        profile_path: string;
    }

    export interface PersonGetPopularResponseBase {
        page: number;
        results: PersonGetPopularResponse_resultsBase[];
    }

    export interface MovieGetDetailsResponse_genresBase {
        id: number;
        name: string;
    }

    export interface MovieDeleteRatingResponseBase {
        status_code: number;
        status_message: string;
    }

    export interface TvGetImagesResponse_backdropsBase {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: string;
        vote_average: number;
        vote_count: number;
        width: number;
    }

    export interface MovieGetMovieChangeListResponse_resultsBase {
        adult: boolean;
        id: number;
    }

    export interface MovieGetMovieChangeListResponseBase {
        page: number;
        results: MovieGetMovieChangeListResponse_resultsBase[];
        total_pages: number;
        total_results: number;
    }

    export interface DiscoverMovieDiscoverResponse_resultsBase {
        adult: boolean;
        backdrop_path: string;
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

    export interface DiscoverMovieDiscoverResponseBase {
        page: number;
        results: DiscoverMovieDiscoverResponse_resultsBase[];
    }

    export interface CertificationGetTVCertificationsResponse_certifications_USBase {
        certification: string;
        meaning: string;
        order: number;
    }

    export interface AccountGetTVShowWatchlistResponse_resultsBase {
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
        vote_average: number;
        vote_count: number;
    }

    export interface AccountGetTVShowWatchlistResponseBase {
        page: number;
        results: AccountGetTVShowWatchlistResponse_resultsBase[];
    }

    export interface MovieGetRecommendationsResponseBase {
        page: number;
        results: any[];
        total_pages: number;
        total_results: number;
    }

    export interface MovieGetLatestResponse_production_companiesBase {
    }

    export interface MovieGetVideosResponse_resultsBase {
        id: string;
        iso_3166_1: string;
        iso_639_1: string;
        key: string;
        name: string;
        site: string;
        size: number;
        type: string;
    }

    export interface MovieGetVideosResponseBase {
        id: number;
        results: MovieGetVideosResponse_resultsBase[];
    }

    export interface KeywordGetMoviesResponseBase {
        id: number;
        page: number;
        results: DiscoverMovieDiscoverResponse_resultsBase[];
    }

    export interface TvGetDetailsResponse_seasonsBase {
        air_date: string;
        episode_count: number;
        id: number;
        poster_path: string;
        season_number: number;
    }

    export interface TvGetCreditsResponse_castBase {
        character: string;
        credit_id: string;
        id: number;
        name: string;
        order: number;
        profile_path: string;
    }

    export interface TvGetCreditsResponse_crewBase {
        credit_id: string;
        department: string;
        id: number;
        job: string;
        name: string;
        profile_path: string;
    }

    export interface PersonGetDetailsResponseBase {
        adult: boolean;
        also_known_as: MovieGetLatestResponse_production_companiesBase[];
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
    }

    export interface MovieGetImagesResponse_backdropsBase {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: string;
        vote_average: number;
        vote_count: number;
        width: number;
    }

    export interface GenreGetMovieListResponseBase {
        genres: MovieGetDetailsResponse_genresBase[];
    }

    export interface AccountGetRatedMoviesResponse_resultsBase {
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

    export interface AccountGetRatedMoviesResponseBase {
        page: number;
        results: AccountGetRatedMoviesResponse_resultsBase[];
    }

    export interface MovieGetAlternativeTitlesResponse_titlesBase {
        iso_3166_1: string;
        title: string;
    }

    export interface TvGetImages2Response_stillsBase {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: string;
        vote_average: integer | number;
        vote_count: number;
        width: number;
    }

    export interface TvGetCredits2ResponseBase {
        cast: TvGetCreditsResponse_castBase[];
        crew: TvGetCreditsResponse_crewBase[];
        id: number;
    }

    export interface Guest_sessionGetRatedTVShowsResponse_resultsBase {
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

    export interface Guest_sessionGetRatedTVShowsResponseBase {
        page: number;
        results: Guest_sessionGetRatedTVShowsResponse_resultsBase[];
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

    export interface CertificationGetTVCertificationsRequestBase {
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

    export interface PersonGetExternalIDsRequestBase {
        api_key?: string;
        language?: string;
        person_id?: number;
    }

    export interface MovieGetRecommendationsRequestBase {
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
        body?: any;
        "Content-Type"?: string;
        list_id?: string;
        session_id?: string;
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

    export let Metadata = {
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
}