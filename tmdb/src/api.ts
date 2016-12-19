import {
    Response,

    GetAccountAccountIdListsResponse,
    InlineResponse20010,
    InlineResponse20011,
    InlineResponse20012,
    ImagePath, Body, Body1, Body2, Body3, Body4, Body5, Body6, Body7, ERRORUNKNOWN, GetAccountResponse, GetTvTvIdSeasonSeasonNumberExternalIdsResponse,
    InlineResponse20013,
    InlineResponse20014, InlineResponse20014Genres, InlineResponse20015, InlineResponse20016, InlineResponse20017, InlineResponse20018,
    InlineResponse20019, InlineResponse2001Results, GetAccountAccountIdRatedTvEpisodesResponse, InlineResponse20020,
    InlineResponse20021,
    InlineResponse20022,
    InlineResponse20023,
    GetAuthenticationGuestSessionNewResponse,
    GetAuthenticationSessionNewResponse, InlineResponse2005, InlineResponse2006, InlineResponse20024,
    InlineResponse20025, InlineResponse20026, InlineResponse20027, InlineResponse20028, InlineResponse20029,
    InlineResponse20030,
    InlineResponse20031,
    InlineResponse20032,
    InlineResponse20033,
    InlineResponse20034,
    InlineResponse20035,
    InlineResponse20036,
    InlineResponse20037,
    InlineResponse20038,
    InlineResponse20039,
    InlineResponse20040,
    InlineResponse20041,
    InlineResponse20042,
    InlineResponse20043,
    InlineResponse20045,
    InlineResponse20046,
    InlineResponse20047,
    InlineResponse20048,
    InlineResponse20049,
    InlineResponse20050,
    InlineResponse20051,
    InlineResponse20052,
    InlineResponse20053,
    InlineResponse20054,
    InlineResponse20055,
    GetTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberCreditsResponse,
    GetTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberImagesResponse,
    GetTvTvIdSeasonSeasonNumberVideosResponse,
    GetTvTvIdSeasonSeasonNumberImagesResponse,
    GetTvTvIdTranslationsResponse,
    InlineResponse20044,
    InlineResponse2007,
    InlineResponse2008,
    InlineResponse2009,
    InlineResponse201,
} from './model';

export interface TmdbApi {
    basePath: string;
    //defaultHeaders: Headers;
    apiKey: string;
    /**
     Delete Rating
     Remove your rating for a movie.A valid session or guest session ID is required. You can read more about how this works &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param movieId 
     @param apiKey 
     @param contentType 
     @param guestSessionId 
     @param sessionId 
    */
    deleteMovieMovieIdRating(req: { movieId: number, guestSessionId?: string, sessionId?: string }): Promise<Response>

    /**
     Delete Rating
     Remove your rating for a TV show.A valid session or guest session ID is required. You can read more about how this works &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param apiKey 
     @param contentType 
     @param guestSessionId 
     @param sessionId 
    */
    deleteTvTvIdRating(req: { tvId: number, guestSessionId?: string, sessionId?: string }): Promise<Response>

    /**
     Delete Rating
     Remove your rating for a TV episode.A valid session or guest session ID is required. You can read more about how this works &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
     @param contentType 
     @param guestSessionId 
     @param sessionId 
    */
    deleteTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberRating(req: { tvId: number, seasonNumber: number, episodeNumber: number, guestSessionId?: string, sessionId?: string }): Promise<Response>

    /**
     Get Details
     Get your account details.
     @param apiKey 
     @param sessionId 
    */
    getAccount(req: { sessionId: string }): Promise<GetAccountResponse>

    /**
     Get Favorite Movies
     Get the list of your favorite movies.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdFavoriteMovies(req: { accountId: number, sessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get Favorite TV Shows
     Get the list of your favorite TV shows.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdFavoriteTv(req: { accountId: number, sessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get Created Lists
     Get all of the lists created by an account. Will invlude private lists if you are the owner.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getAccountAccountIdLists(req: { accountId: number, sessionId: string, language?: string }): Promise<GetAccountAccountIdListsResponse>

    /**
     Get Rated Movies
     Get a list of all the movies you have rated.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdRatedMovies(req: { accountId: number, sessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get Rated TV Shows
     Get a list of all the TV shows you have rated.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdRatedTv(req: { accountId: number, sessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get Rated TV Episodes
     Get a list of all the TV episodes you have rated.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdRatedTvEpisodes(req: { accountId: string, sessionId: string, language?: string, sortBy?: string }): Promise<GetAccountAccountIdRatedTvEpisodesResponse>

    /**
     Get Movie Watchlist
     Get a list of all the movies you have added to your watchlist.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdWatchlistMovies(req: { accountId: number, sessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get TV Show Watchlist
     Get a list of all the TV shows you have added to your watchlist.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getAccountAccountIdWatchlistTv(req: { accountId: number, sessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Create Guest Session
     This method will let you create a new guest session. Guest sessions are a type of session that will let a user rate movies and TV shows but not require them to have a TMDb user account. More information about user authentication can be found &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.Please note, you should only generate a single guest session per user (or device) as you will be able to attach the ratings to a TMDb user account in the future. There is also IP limits in place so you should always make sure it&#39;s the end user doing the guest session actions.If a guest session is not used for the first time within 24 hours, it will be automatically deleted.
     @param apiKey 
    */
    getAuthenticationGuestSessionNew(req: { extraHttpRequestParams?: any }): Promise<GetAuthenticationGuestSessionNewResponse>

    /**
     Create Session
     You can use this method to create a fully valid session ID once a user has validated the request token. More information about how this works can be found &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param apiKey 
     @param requestToken 
    */
    getAuthenticationSessionNew(req: { requestToken: string }): Promise<GetAuthenticationSessionNewResponse>

    /**
     Create Request Token
     Create a temporary request token that can be used to validate a TMDb user login. More details about how this works can be found &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param apiKey 
    */
    getAuthenticationTokenNew(req: { extraHttpRequestParams?: any }): Promise<InlineResponse2005>

    /**
     Validate Request Token
     This method allows an application to validate a request token by entering a username and password.&lt;h4 id&#x3D;\&quot;caution\&quot;&gt;&lt;a target&#x3D;\&quot;_blank\&quot; href&#x3D;\&quot;#caution\&quot; class&#x3D;\&quot;Markdown-Anchor\&quot;&gt;&amp;#x1f517&lt;/a&gt; Caution&lt;/h4&gt; Please note, using this method is &lt;strong&gt;strongly discouraged&lt;/strong&gt;. The preferred method of validating a request token is to have a user authenticate the request via the TMDb website. You can read about that method &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param apiKey 
     @param username 
     @param password 
     @param requestToken 
    */
    getAuthenticationTokenValidateWithLogin(req: { username: string, password: string, requestToken: string }): Promise<InlineResponse2006>

    /**
     Get Movie Certifications
     Get an up to date list of the officially supported movie certifications on TMDb.
     @param apiKey 
    */
    getCertificationMovieList(req: { extraHttpRequestParams?: any }): Promise<InlineResponse2007>

    /**
     Get TV Certifications
     Get an up to date list of the officially supported TV show certifications on TMDb.
     @param apiKey 
    */
    getCertificationTvList(req: { extraHttpRequestParams?: any }): Promise<InlineResponse2008>

    /**
     Get Details
     Get collection details by id.
     @param collectionId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getCollectionCollectionId(req: { collectionId: number, language?: string }): Promise<InlineResponse2009>

    /**
     Get Images
     Get the images for a collection by id.
     @param collectionId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getCollectionCollectionIdImages(req: { collectionId: number, language?: string }): Promise<InlineResponse20010>

    /**
     Get Details
     Get a companies details by id.
     @param companyId 
     @param apiKey 
    */
    getCompanyCompanyId(req: { companyId: number }): Promise<InlineResponse20011>

    /**
     Get Movies
     Get the movies of a company by id.We highly recommend using &lt;a href&#x3D;\&quot;/3/discover/movie-discover\&quot; class&#x3D;\&quot;undefined\&quot;&gt;movie discover&lt;/a&gt; instead of this method as it is much more flexible.
     @param companyId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getCompanyCompanyIdMovies(req: { companyId: number, language?: string }): Promise<{}>

    /**
     Get API Configuration
     Get the system wide configuration information. Some elements of the API require some knowledge of this configuration data. The purpose of this is to try and keep the actual API responses as light as possible. It is recommended you cache this data within your application and check for updates every few days.This method currently holds the data relevant to building image URLs as well as the change key map.To build an image URL, you will need 3 pieces of data. The &lt;code&gt;base_url&lt;/code&gt;, &lt;code&gt;size&lt;/code&gt; and &lt;code&gt;file_path&lt;/code&gt;. Simply combine them all and you will have a fully qualified URL. Here’s an example URL:&lt;pre&gt;&lt;code&gt;https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg &lt;/code&gt;&lt;/pre&gt; The configuration method also contains the list of change keys which can be useful if you are building an app that consumes data from the change feed.
     @param apiKey 
    */
    getConfiguration(req: { extraHttpRequestParams?: any }): Promise<InlineResponse20012>

    /**
     Get Details
     Get a movie or TV credit details by id.
     @param creditId 
     @param apiKey 
    */
    getCreditCreditId(req: { creditId: string }): Promise<InlineResponse20013>

    /**
     Movie Discover
     Discover movies by different types of data like average rating, number of votes, genres and certifications. You can get a valid list of certifications from the /certifications method.Discover also supports a nice list of sort options. See below for all of the available options.Please note, when using &lt;code&gt;certification&lt;/code&gt; \\ &lt;code&gt;certification.lte&lt;/code&gt; you must also specify &lt;code&gt;certification_country&lt;/code&gt;. These two parameters work together in order to filter the results. You can only filter results with the countries we have added to our &lt;a href&#x3D;\&quot;/3/certifications/get-movie-certifications\&quot; class&#x3D;\&quot;undefined\&quot;&gt;certifications list&lt;/a&gt;.If you specify the &lt;code&gt;region&lt;/code&gt; parameter, the regional release date will be used instead of the primary release date. The date returned will be the first date based on your query (ie. if a &lt;code&gt;with_release_type&lt;/code&gt; is specified). It&#39;s important to note the order of the release types that are used. Specifying &amp;quot;2|3&amp;quot; would return the limited theatrical release date as opposed to &amp;quot;3|2&amp;quot; which would return the theatrical date.
     @param apiKey 
     @param language Specify a language to query translatable fields with.
     @param region Specify a ISO 3166-1 code to filter release dates.
     @param sortBy Choose from one of the many available sort options.
     @param certificationCountry Used in conjunction with the certification filter, use this to specify a country with a valid certification.
     @param certification Filter results with a valid certification from the &#39;certification_country&#39; field.
     @param certificationLte Filter and only include movies that have a certification that is less than or equal to the specified value.
     @param includeAdult A filter and include or exclude adult movies.
     @param includeVideo A filter to include or exclude videos.
     @param page Specify the page of results to query.
     @param primaryReleaseYear A filter to limit the results to a specific primary release year.
     @param primaryReleaseDateGte Filter and only include movies that have a primary release date that is greater or equal to the specified value.
     @param primaryReleaseDateLte Filter and only include movies that have a primary release date that is less than or equal to the specified value.
     @param releaseDateGte Filter and only include movies that have a release date (looking at all release dates) that is greater or equal to the specified value.
     @param releaseDateLte Filter and only include movies that have a release date (looking at all release dates) that is less than or equal to the specified value.
     @param voteCountGte Filter and only include movies that have a vote count that is greater or equal to the specified value.
     @param voteCountLte Filter and only include movies that have a vote count that is less than or equal to the specified value.
     @param voteAverageGte Filter and only include movies that have a rating that is greater or equal to the specified value.
     @param voteAverageLte Filter and only include movies that have a rating that is less than or equal to the specified value.
     @param withCast A comma separated list of person ID&#39;s. Only include movies that have one of the ID&#39;s added as an actor.
     @param withCrew A comma separated list of person ID&#39;s. Only include movies that have one of the ID&#39;s added as a crew member.
     @param withCompanies A comma separated list of production company ID&#39;s. Only include movies that have one of the ID&#39;s added as a production company.
     @param withGenres Comma separated value of genre ids that you want to include in the results.
     @param withKeywords A comma separated list of keyword ID&#39;s. Only include movies that have one of the ID&#39;s added as a keyword.
     @param withPeople A comma separated list of person ID&#39;s. Only include movies that have one of the ID&#39;s added as a either a actor or a crew member.
     @param year A filter to limit the results to a specific year (looking at all release dates).
     @param withoutGenres Comma separated value of genre ids that you want to exclude from the results.
     @param withRuntimeGte Filter and only inlcude movies that have a runtime that is greater or equal to a value.
     @param withRuntimeLte Filter and only inlcude movies that have a runtime that is less than or equal to a value.
     @param withReleaseType Specify a comma (AND) or pipe (OR) separated value to filter release types by. These release types map to the same values found on the movie release date method.
     @param withOriginalLanguage Specify an ISO 639-1 string to filter results by their original language value.
    */
    getDiscoverMovie(req: { language?: string, region?: string, sortBy?: string, certificationCountry?: string, certification?: string, certificationLte?: string, includeAdult?: boolean, includeVideo?: boolean, page?: number, primaryReleaseYear?: number, primaryReleaseDateGte?: Date, primaryReleaseDateLte?: Date, releaseDateGte?: Date, releaseDateLte?: Date, voteCountGte?: number, voteCountLte?: number, voteAverageGte?: number, voteAverageLte?: number, withCast?: string, withCrew?: string, withCompanies?: string, withGenres?: string, withKeywords?: string, withPeople?: string, year?: number, withoutGenres?: string, withRuntimeGte?: number, withRuntimeLte?: number, withReleaseType?: number, withOriginalLanguage?: string }): Promise<{}>

    /**
     TV Discover
     Discover TV shows by different types of data like average rating, number of votes, genres, the network they aired on and air dates.Discover also supports a nice list of sort options. See below for all of the available options.
     @param apiKey 
     @param language Specify a language to query translatable fields with.
     @param sortBy Choose from one of the many available sort options.
     @param airDateGte Filter and only include TV shows that have a air date (by looking at all episodes) that is greater or equal to the specified value.
     @param airDateLte Filter and only include TV shows that have a air date (by looking at all episodes) that is less than or equal to the specified value.
     @param firstAirDateGte Filter and only include TV shows that have a original air date that is greater or equal to the specified value. Can be used in conjunction with the \&quot;include_null_first_air_dates\&quot; filter if you want to include items with no air date.
     @param firstAirDateLte Filter and only include TV shows that have a original air date that is less than or equal to the specified value. Can be used in conjunction with the \&quot;include_null_first_air_dates\&quot; filter if you want to include items with no air date.
     @param firstAirDateYear Filter and only include TV shows that have a original air date year that equal to the specified value. Can be used in conjunction with the \&quot;include_null_first_air_dates\&quot; filter if you want to include items with no air date.
     @param page Specify the page of results to query.
     @param timezone Used in conjunction with the air_date.gte/lte filter to calculate the proper UTC offset.
     @param voteAverageGte Filter and only include movies that have a rating that is greater or equal to the specified value.
     @param voteCountGte Filter and only include movies that have a rating that is less than or equal to the specified value.
     @param withGenres Comma separated value of genre ids that you want to include in the results.
     @param withNetworks Comma separated value of network ids that you want to include in the results.
     @param withoutGenres Comma separated value of genre ids that you want to exclude from the results.
     @param withRuntimeGte Filter and only inlcude movies that have a runtime that is greater or equal to a value.
     @param withRuntimeLte Filter and only inlcude movies that have a runtime that is less than or equal to a value.
     @param includeNullFirstAirDates Use this filter to include TV shows that don&#39;t have an air date while using any of the \&quot;first_air_date\&quot; filters.
     @param withOriginalLanguage Specify an ISO 639-1 string to filter results by their original language value.
    */
    getDiscoverTv(req: { language?: string, sortBy?: string, airDateGte?: Date, airDateLte?: Date, firstAirDateGte?: Date, firstAirDateLte?: Date, firstAirDateYear?: number, page?: number, timezone?: string, voteAverageGte?: number, voteCountGte?: number, withGenres?: string, withNetworks?: string, withoutGenres?: string, withRuntimeGte?: number, withRuntimeLte?: number, includeNullFirstAirDates?: boolean, withOriginalLanguage?: string }): Promise<{}>

    /**
     Find by ID
     The find method makes it easy to search for objects in our database by an external id. For instance, an IMDB ID.This method will search all objects (movies, TV shows and people) and return the results in a single response.The supported external sources for each object are as follows.&lt;table&gt; &lt;thead&gt; &lt;tr&gt; &lt;th&gt;&lt;/th&gt; &lt;th&gt;Movies&lt;/th&gt; &lt;th&gt;TV Shows&lt;/th&gt; &lt;th&gt;TV Seasons&lt;/th&gt; &lt;th&gt;TV Episodes&lt;/th&gt; &lt;th&gt;People&lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;IMDB ID&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✗&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase MID&lt;/td&gt; &lt;td&gt;✗&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase ID&lt;/td&gt; &lt;td&gt;✗&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVDB ID&lt;/td&gt; &lt;td&gt;✗&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✗&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVRage ID&lt;/td&gt; &lt;td&gt;✗&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;td&gt;✓&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; 
     @param externalId 
     @param apiKey 
     @param externalSource 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getFindExternalId(req: { externalId: string, externalSource: string, language?: string }): Promise<{}>

    /**
     Get Movies
     Get a list of movies by genre id.We highly recommend using &lt;a href&#x3D;\&quot;/3/discover/movie-discover\&quot; class&#x3D;\&quot;undefined\&quot;&gt;movie discover&lt;/a&gt; instead of this method as it is much more flexible.
     @param genreId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param includeAdult Choose whether to inlcude adult (pornography) content in the results.
     @param sortBy Sort the results.
    */
    getGenreGenreIdMovies(req: { genreId: number, language?: string, includeAdult?: boolean, sortBy?: string }): Promise<{}>

    /**
     Get Movie List
     Get the list of official genres for movies.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getGenreMovieList(req: { language?: string }): Promise<InlineResponse20014>

    /**
     Get TV List
     Get the list of official genres for TV shows.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getGenreTvList(req: { language?: string }): Promise<InlineResponse20014>

    /**
     Get Rated Movies
     Get the rated movies for a guest session.
     @param guestSessionId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getGuestSessionGuestSessionIdRatedMovies(req: { guestSessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get Rated TV Shows
     Get the rated TV shows for a guest session.
     @param guestSessionId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getGuestSessionGuestSessionIdRatedTv(req: { guestSessionId: string, language?: string, sortBy?: string }): Promise<{}>

    /**
     Get Rated TV Episodes
     Get the rated TV episodes for a guest session.
     @param guestSessionId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param sortBy Sort the results.
    */
    getGuestSessionGuestSessionIdRatedTvEpisodes(req: { guestSessionId: string, language?: string, sortBy?: string }): Promise<InlineResponse20015>

    /**
     Get Jobs
     The the list of official jobs that are used on TMDb.
     @param apiKey 
    */
    getJobList(req: { extraHttpRequestParams?: any }): Promise<InlineResponse20016>

    /**
     Get Details
     
     @param keywordId 
     @param apiKey 
    */
    getKeywordKeywordId(req: { keywordId: number }): Promise<InlineResponse20014Genres>

    /**
     Get Movies
     Get the movies that belong to a keyword.We highly recommend using &lt;a href&#x3D;\&quot;/3/discover/movie-discover\&quot; class&#x3D;\&quot;undefined\&quot;&gt;movie discover&lt;/a&gt; instead of this method as it is much more flexible.
     @param keywordId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param includeAdult Choose whether to inlcude adult (pornography) content in the results.
    */
    getKeywordKeywordIdMovies(req: { keywordId: number, language?: string, includeAdult?: boolean }): Promise<{}>

    /**
     Get Details
     Get the details of a list.
     @param listId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getListListId(req: { listId: string, language?: string }): Promise<{}>

    /**
     Check Item Status
     You can use this method to check if a movie has already been added to the list.
     @param listId 
     @param apiKey 
     @param movieId 
    */
    getListListIdItemStatus(req: { listId: string, movieId: number }): Promise<InlineResponse20017>

    /**
     Get Movie Change List
     Get  a list of all of the movie ids that have been changed in the past 24 hours.You can query it for up to 14 days worth of changed IDs at a time with the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters. 100 items are returned per page.
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
    */
    getMovieChanges(req: { startDate?: Date, endDate?: Date }): Promise<InlineResponse20018>

    /**
     Get Latest
     Get the most newly created movie. This is a live response and will continuously change.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getMovieLatest(req: { language?: string }): Promise<InlineResponse20019>

    /**
     Get Details
     Get the primary information about a movie.Supports &lt;code&gt;append_to_response&lt;/code&gt;. Read more about this &lt;a href&#x3D;\&quot;/3/getting-started/append-to-response\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param appendToResponse Append requests within the same namespace to the response.
    */
    getMovieMovieId(req: { movieId: number, language?: string, appendToResponse?: string }): Promise<InlineResponse20020>

    /**
     Get Account States
     Grab the following account states for a session:&lt;ul&gt; &lt;li&gt;Movie rating&lt;/li&gt; &lt;li&gt;If it belongs to your watchlist&lt;/li&gt; &lt;li&gt;If it belongs to your favourite list&lt;/li&gt; &lt;/ul&gt; 
     @param movieId 
     @param apiKey 
     @param sessionId 
     @param guestSessionId 
    */
    getMovieMovieIdAccountStates(req: { movieId: string, sessionId: string, guestSessionId?: string }): Promise<InlineResponse20021>

    /**
     Get Alternative Titles
     Get all of the alternative titles for a movie.
     @param movieId 
     @param apiKey 
     @param country 
    */
    getMovieMovieIdAlternativeTitles(req: { movieId: number, country?: string }): Promise<InlineResponse20022>

    /**
     Get Changes
     Get the changes for a movie. By default only the last 24 hours are returned.You can query up to 14 days in a single query by using the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters.
     @param movieId 
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
     @param page Specify which page to query.
    */
    getMovieMovieIdChanges(req: { movieId: string, startDate?: Date, endDate?: Date, page?: number }): Promise<InlineResponse20023>

    /**
     Get Credits
     Get the cast and crew for a movie.
     @param movieId 
     @param apiKey 
    */
    getMovieMovieIdCredits(req: { movieId: number }): Promise<InlineResponse20024>

    /**
     Get Images
     Get the images that belong to a movie.Querying images with a &lt;code&gt;language&lt;/code&gt; parameter will filter the results. If you want to include a fallback language (especially useful for backdrops) you can use the &lt;code&gt;include_image_language&lt;/code&gt; parameter. This should be a comma seperated value like so: &lt;code&gt;include_image_language&#x3D;en,null&lt;/code&gt;.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param includeImageLanguage 
    */
    getMovieMovieIdImages(req: { movieId: number, language?: string, includeImageLanguage?: string }): Promise<InlineResponse20025>

    /**
     Get Keywords
     Get the keywords that have been added to a movie.
     @param movieId 
     @param apiKey 
    */
    getMovieMovieIdKeywords(req: { movieId: number }): Promise<InlineResponse20026>

    /**
     Get Lists
     Get a list of lists that this movie belongs to.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getMovieMovieIdLists(req: { movieId: number, language?: string, page?: number }): Promise<InlineResponse20027>

    /**
     Get Recommendations
     Get a list of recommended movies for a movie.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getMovieMovieIdRecommendations(req: { movieId: number, language?: string, page?: number }): Promise<InlineResponse20028>

    /**
     Get Release Dates
     Get the release date along with the certification for a movie.Release dates support different types:&lt;ol&gt; &lt;li&gt;Premiere&lt;/li&gt; &lt;li&gt;Theatrical (limited)&lt;/li&gt; &lt;li&gt;Theatrical&lt;/li&gt; &lt;li&gt;Digital&lt;/li&gt; &lt;li&gt;Physical&lt;/li&gt; &lt;li&gt;TV&lt;/li&gt; &lt;/ol&gt; 
     @param movieId 
     @param apiKey 
    */
    getMovieMovieIdReleaseDates(req: { movieId: number }): Promise<InlineResponse20029>

    /**
     Get Reviews
     Get the user reviews for a movie.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getMovieMovieIdReviews(req: { movieId: number, language?: string, page?: number }): Promise<InlineResponse20030>

    /**
     Get Similar Movies
     Get a list of similar movies. This is &lt;strong&gt;not&lt;/strong&gt; the same as the &amp;quot;Recommendation&amp;quot; system you see on the website.These items are assembled by looking at keywords and genres.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getMovieMovieIdSimilar(req: { movieId: number, language?: string, page?: number }): Promise<InlineResponse20028>

    /**
     Get Translations
     Get a list of translations that have been created for a movie.
     @param movieId 
     @param apiKey 
    */
    getMovieMovieIdTranslations(req: { movieId: number }): Promise<InlineResponse20031>

    /**
     Get Videos
     Get the videos that have been added to a movie.
     @param movieId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getMovieMovieIdVideos(req: { movieId: string, language?: string }): Promise<InlineResponse20032>

    /**
     Get Now Playing
     Get a list of movies in theatres. This is a release type query that looks for all movies that have a release type of 2 or 3 within the specified date range.You can optionally specify a &lt;code&gt;region&lt;/code&gt; prameter which will narrow the search to only look for theatrical release dates within the specified country.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param region Specify a ISO 3166-1 code to filter release dates.
    */
    getMovieNowPlaying(req: { language?: string, page?: number, region?: string }): Promise<{}>

    /**
     Get Popular
     Get a list of the current popular movies on TMDb. This list updates daily.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param region Specify a ISO 3166-1 code to filter release dates.
    */
    getMoviePopular(req: { language?: string, page?: number, region?: string }): Promise<{}>

    /**
     Get Top Rated
     Get the top rated movies on TMDb.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param region Specify a ISO 3166-1 code to filter release dates.
    */
    getMovieTopRated(req: { language?: string, page?: number, region?: string }): Promise<{}>

    /**
     Get Upcoming
     Get a list of upcoming movies in theatres. This is a release type query that looks for all movies that have a release type of 2 or 3 within the specified date range.You can optionally specify a &lt;code&gt;region&lt;/code&gt; prameter which will narrow the search to only look for theatrical release dates within the specified country.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param region Specify a ISO 3166-1 code to filter release dates.
    */
    getMovieUpcoming(req: { language?: string, page?: number, region?: string }): Promise<{}>

    /**
     Get Details
     Get the details of a network.
     @param networkId 
     @param apiKey 
    */
    getNetworkNetworkId(req: { networkId: number }): Promise<InlineResponse20014Genres>

    /**
     Get Person Change List
     Get a list of all of the person ids that have been changed in the past 24 hours.You can query it for up to 14 days worth of changed IDs at a time with the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters. 100 items are returned per page.
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
    */
    getPersonChanges(req: { startDate?: Date, endDate?: Date }): Promise<InlineResponse20018>

    /**
     Get Latest
     Get the most newly created person. This is a live response and will continuously change.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getPersonLatest(req: { language?: string }): Promise<InlineResponse20033>

    /**
     Get Details
     Get the primary person details by id.Supports &lt;code&gt;append_to_response&lt;/code&gt;. Read more about this &lt;a href&#x3D;\&quot;/3/getting-started/append-to-response\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.&lt;h4 id&#x3D;\&quot;new-as-of-november-9-2016\&quot;&gt;&lt;a target&#x3D;\&quot;_blank\&quot; href&#x3D;\&quot;#new-as-of-november-9-2016\&quot; class&#x3D;\&quot;Markdown-Anchor\&quot;&gt;&amp;#x1f517&lt;/a&gt; New as of November 9, 2016&lt;/h4&gt; Biographies are now translatable on TMDb. This means you can query person details with a language parameter.
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param appendToResponse Append requests within the same namespace to the response.
    */
    getPersonPersonId(req: { personId: number, language?: string, appendToResponse?: string }): Promise<InlineResponse20034>

    /**
     Get Changes
     Get the changes for a person. By default only the last 24 hours are returned.You can query up to 14 days in a single query by using the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters.
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
     @param page Specify which page to query.
    */
    getPersonPersonIdChanges(req: { personId: number, language?: string, startDate?: Date, endDate?: Date, page?: number }): Promise<InlineResponse20035>

    /**
     Get Combined Credits
     Get the movie and TV credits together in a single response.
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getPersonPersonIdCombinedCredits(req: { personId: number, language?: string }): Promise<InlineResponse20036>

    /**
     Get External IDs
     Get the external ids for a person. We currently support the following external sources.&lt;table&gt; &lt;thead&gt; &lt;tr&gt; &lt;th&gt;&lt;strong&gt;External Sources&lt;/strong&gt;&lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;IMDB ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Facebook&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase MID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Instagram&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVRage ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Twitter&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; 
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getPersonPersonIdExternalIds(req: { personId: number, language?: string }): Promise<InlineResponse20037>

    /**
     Get Images
     Get the images for a person.
     @param personId 
     @param apiKey 
    */
    getPersonPersonIdImages(req: { personId: number }): Promise<InlineResponse20038>

    /**
     Get Movie Credits
     Get the movie credits for a person.
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getPersonPersonIdMovieCredits(req: { personId: number, language?: string }): Promise<InlineResponse20039>

    /**
     Get Tagged Images
     Get the images that this person has been tagged in.
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getPersonPersonIdTaggedImages(req: { personId: number, language?: string, page?: number }): Promise<{}>

    /**
     Get TV Credits
     Get the TV show credits for a person.You can query for some extra details about the credit with the &lt;a href&#x3D;\&quot;/3/credits/get-credit-details\&quot; class&#x3D;\&quot;undefined\&quot;&gt;credit method&lt;/a&gt;.
     @param personId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getPersonPersonIdTvCredits(req: { personId: number, language?: string }): Promise<InlineResponse20040>

    /**
     Get Popular
     Get the list of popular people on TMDb. This list updates daily.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getPersonPopular(req: { language?: string, page?: number }): Promise<{}>

    /**
     Get Details
     
     @param reviewId 
     @param apiKey 
    */
    getReviewReviewId(req: { reviewId: string }): Promise<InlineResponse20041>

    /**
     Search Collections
     Search for collections.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getSearchCollection(req: { query: string, language?: string, page?: number }): Promise<InlineResponse20042>

    /**
     Search Companies
     Search for companies.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param page Specify which page to query.
    */
    getSearchCompany(req: { query: string, page?: number }): Promise<InlineResponse20042>

    /**
     Search Keywords
     Search for keywords.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param page Specify which page to query.
    */
    getSearchKeyword(req: { query: string, page?: number }): Promise<InlineResponse20042>

    /**
     Search Movies
     Search for movies.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param includeAdult Choose whether to inlcude adult (pornography) content in the results.
     @param region Specify a ISO 3166-1 code to filter release dates.
     @param year 
     @param primaryReleaseYear 
    */
    getSearchMovie(req: { query: string, language?: string, page?: number, includeAdult?: boolean, region?: string, year?: number, primaryReleaseYear?: number }): Promise<{}>

    /**
     Multi Search
     Search multiple models in a single request. Multi search currently supports searching for movies, tv shows and people in a single request.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param includeAdult Choose whether to inlcude adult (pornography) content in the results.
     @param region Specify a ISO 3166-1 code to filter release dates.
    */
    getSearchMulti(req: { query: string, language?: string, page?: number, includeAdult?: boolean, region?: string }): Promise<{}>

    /**
     Search People
     Search for people.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param includeAdult Choose whether to inlcude adult (pornography) content in the results.
     @param region Specify a ISO 3166-1 code to filter release dates.
    */
    getSearchPerson(req: { query: string, language?: string, page?: number, includeAdult?: boolean, region?: string }): Promise<{}>

    /**
     Search TV Shows
     Search for a TV show.
     @param apiKey 
     @param query Pass a text query to search. This value should be URI encoded.
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
     @param firstAirDateYear 
    */
    getSearchTv(req: { query: string, language?: string, page?: number, firstAirDateYear?: number }): Promise<{}>

    /**
     Get List
     Get the list of supported timezones on TMDb.
     @param apiKey 
    */
    getTimezonesList(req: { extraHttpRequestParams?: any }): Promise<Array<any>>

    /**
     Get TV Airing Today
     Get a list of TV shows that are airing today. This query is purely day based as we do not currently support airing times.You can specify a &lt;a target&#x3D;\&quot;_blank\&quot; href&#x3D;\&quot;endpoint:KQ4CDdEoWKJYLkrhS\&quot; class&#x3D;\&quot;undefined\&quot;&gt;timezone&lt;/a&gt; to offset the day calculation. Without a specified timezone, this query defaults to EST (Eastern Time UTC-05:00).
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getTvAiringToday(req: { language?: string, page?: number }): Promise<{}>

    /**
     Get TV Change List
     Get a list of all of the TV show ids that have been changed in the past 24 hours.You can query it for up to 14 days worth of changed IDs at a time with the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters. 100 items are returned per page.
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
    */
    getTvChanges(req: { startDate?: Date, endDate?: Date }): Promise<InlineResponse20018>

    /**
     Get Changes
     Get the changes for a TV episode. By default only the last 24 hours are returned.You can query up to 14 days in a single query by using the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters.
     @param episodeId 
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
     @param page Specify which page to query.
    */
    getTvEpisodeEpisodeIdChanges(req: { episodeId: number, startDate?: Date, endDate?: Date, page?: number }): Promise<InlineResponse20043>

    /**
     Get Latest
     Get the most newly created TV show. This is a live response and will continuously change.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvLatest(req: { language?: string }): Promise<InlineResponse20044>

    /**
     Get TV On The Air
     Get a list of shows that are currently on the air.This query looks for any TV show that has an episode with an air date in the next 7 days.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getTvOnTheAir(req: { language?: string, page?: number }): Promise<{}>

    /**
     Get Popular
     Get a list of the current popular TV shows on TMDb. This list updates daily.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getTvPopular(req: { language?: string, page?: number }): Promise<{}>

    /**
     Get  Changes
     Get the changes for a TV season. By default only the last 24 hours are returned.You can query up to 14 days in a single query by using the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters.
     @param seasonId 
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
     @param page Specify which page to query.
    */
    getTvSeasonSeasonIdChanges(req: { seasonId: number, startDate?: Date, endDate?: Date, page?: number }): Promise<InlineResponse20045>

    /**
     Get Top Rated
     Get a list of the top rated TV shows on TMDb.
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getTvTopRated(req: { language?: string, page?: number }): Promise<{}>

    /**
     Get Details
     Get the primary TV show details by id.Supports &lt;code&gt;append_to_response&lt;/code&gt;. Read more about this &lt;a href&#x3D;\&quot;/3/getting-started/append-to-response\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param appendToResponse Append requests within the same namespace to the response.
    */
    getTvTvId(req: { tvId: number, language?: string, appendToResponse?: string }): Promise<InlineResponse20046>

    /**
     Get Account States
     Grab the following account states for a session:&lt;ul&gt; &lt;li&gt;TV show rating&lt;/li&gt; &lt;li&gt;If it belongs to your watchlist&lt;/li&gt; &lt;li&gt;If it belongs to your favourite list&lt;/li&gt; &lt;/ul&gt; 
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param guestSessionId 
     @param sessionId 
    */
    getTvTvIdAccountStates(req: { tvId: number, language?: string, guestSessionId?: string, sessionId?: string }): Promise<InlineResponse20021>

    /**
     Get Alternative Titles
     Returns all of the alternative titles for a TV show.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdAlternativeTitles(req: { tvId: number, language?: string }): Promise<InlineResponse20047>

    /**
     Get Changes
     Get the changes for a TV show. By default only the last 24 hours are returned.You can query up to 14 days in a single query by using the &lt;code&gt;start_date&lt;/code&gt; and &lt;code&gt;end_date&lt;/code&gt; query parameters.TV show changes are different than movie changes in that there are some edits on seasons and episodes that will create a change entry at the show level. These can be found under the season and episode keys. These keys will contain a &lt;code&gt;series_id&lt;/code&gt; and &lt;code&gt;episode_id&lt;/code&gt;. You can use the &lt;a href&#x3D;\&quot;/3/tv-seasons/get-tv-season-changes\&quot; class&#x3D;\&quot;undefined\&quot;&gt;season changes&lt;/a&gt; and &lt;a href&#x3D;\&quot;/3/tv-episodes/get-tv-episode-changes\&quot; class&#x3D;\&quot;undefined\&quot;&gt;episode changes&lt;/a&gt; methods to look these up individually.
     @param tvId 
     @param apiKey 
     @param startDate Filter the results with a start date.
     @param endDate Filter the results with a end date.
     @param page Specify which page to query.
    */
    getTvTvIdChanges(req: { tvId: number, startDate?: Date, endDate?: Date, page?: number }): Promise<InlineResponse20048>

    /**
     Get Content Ratings
     Get the list of content ratings (certifications) that have been added to a TV show.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdContentRatings(req: { tvId: number, language?: string }): Promise<InlineResponse20049>

    /**
     Get Credits
     Get the credits (cast and crew) that have been added to a TV show.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdCredits(req: { tvId: number, language?: string }): Promise<InlineResponse20050>

    /**
     Get External IDs
     Get the external ids for a TV show. We currently support the following external sources.&lt;table&gt; &lt;thead&gt; &lt;tr&gt; &lt;th&gt;&lt;strong&gt;External Sources&lt;/strong&gt;&lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;IMDB ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase MID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVDB ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVRage ID&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; 
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdExternalIds(req: { tvId: number, language?: string }): Promise<InlineResponse20037>

    /**
     Get Images
     Get the images that belong to a TV show.Querying images with a &lt;code&gt;language&lt;/code&gt; parameter will filter the results. If you want to include a fallback language (especially useful for backdrops) you can use the &lt;code&gt;include_image_language&lt;/code&gt; parameter. This should be a comma seperated value like so: &lt;code&gt;include_image_language&#x3D;en,null&lt;/code&gt;.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdImages(req: { tvId: number, language?: string }): Promise<InlineResponse20051>

    /**
     Get Keywords
     Get the keywords that have been added to a TV show.
     @param tvId 
     @param apiKey 
    */
    getTvTvIdKeywords(req: { tvId: number }): Promise<InlineResponse20052>

    /**
     Get Recommendations
     Get the list of TV show recommendations for this item.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getTvTvIdRecommendations(req: { tvId: number, language?: string, page?: number }): Promise<{}>

    /**
     Get Details
     Get the TV season details by id.Supports &lt;code&gt;append_to_response&lt;/code&gt;. Read more about this &lt;a href&#x3D;\&quot;/3/getting-started/append-to-response\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param seasonNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param appendToResponse Append requests within the same namespace to the response.
    */
    getTvTvIdSeasonSeasonNumber(req: { tvId: number, seasonNumber: number, language?: string, appendToResponse?: string }): Promise<InlineResponse20053>

    /**
     Get Account States
     Returns all of the user ratings for the season&#39;s episodes.
     @param tvId 
     @param seasonNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param guestSessionId 
     @param sessionId 
    */
    getTvTvIdSeasonSeasonNumberAccountStates(req: { tvId: number, seasonNumber: number, language?: string, guestSessionId?: string, sessionId?: string }): Promise<InlineResponse20054>

    /**
     Get Credits
     Get the credits for TV season.
     @param tvId 
     @param seasonNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdSeasonSeasonNumberCredits(req: { tvId: number, seasonNumber: number, language?: string }): Promise<InlineResponse20050>

    /**
     Get Details
     Get the TV episode details by id.Supports &lt;code&gt;append_to_response&lt;/code&gt;. Read more about this &lt;a href&#x3D;\&quot;/3/getting-started/append-to-response\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param appendToResponse Append requests within the same namespace to the response.
    */
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumber(req: { tvId: number, seasonNumber: number, episodeNumber: number, language?: string, appendToResponse?: string }): Promise<InlineResponse20055>

    /**
     Get Account States
     Get your rating for a episode.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
     @param guestSessionId 
     @param sessionId 
    */
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberAccountStates(req: { tvId: number, seasonNumber: number, episodeNumber: number, guestSessionId?: string, sessionId?: string }): Promise<GetTvTvIdSeasonSeasonNumberExternalIdsResponse>

    /**
     Get Credits
     Get the credits (cast, crew and guest stars) for a TV episode.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
    */
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberCredits(req: { tvId: number, seasonNumber: number, episodeNumber: number }): Promise<GetTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberCreditsResponse>

    /**
     Get TV Episode External IDs
     Get the external ids for a TV episode. We currently support the following external sources.&lt;table&gt; &lt;thead&gt; &lt;tr&gt; &lt;th&gt;&lt;strong&gt;External Sources&lt;/strong&gt;&lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;IMDB ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase MID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVDB ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVRage ID&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; 
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
    */
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberExternalIds(req: { tvId: number, seasonNumber: number, episodeNumber: number }): Promise<GetTvTvIdSeasonSeasonNumberExternalIdsResponse>

    /**
     Get Images
     Get the images that belong to a TV episode.Querying images with a &lt;code&gt;language&lt;/code&gt; parameter will filter the results. If you want to include a fallback language (especially useful for backdrops) you can use the &lt;code&gt;include_image_language&lt;/code&gt; parameter. This should be a comma seperated value like so: &lt;code&gt;include_image_language&#x3D;en,null&lt;/code&gt;.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
    */
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberImages(req: { tvId: number, seasonNumber: number, episodeNumber: number }): Promise<GetTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberImagesResponse>

    /**
     Get  Videos
     Get the videos that have been added to a TV episode.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberVideos(req: { tvId: number, seasonNumber: number, episodeNumber: number, language?: string }): Promise<GetTvTvIdSeasonSeasonNumberVideosResponse>

    /**
     Get External IDs
     Get the external ids for a TV season. We currently support the following external sources.&lt;table&gt; &lt;thead&gt; &lt;tr&gt; &lt;th&gt;&lt;strong&gt;External Sources&lt;/strong&gt;&lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;Freebase MID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Freebase ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVDB ID&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;TVRage ID&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; 
     @param tvId 
     @param seasonNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdSeasonSeasonNumberExternalIds(req: { tvId: number, seasonNumber: number, language?: string }): Promise<GetTvTvIdSeasonSeasonNumberExternalIdsResponse>

    /**
     Get Images
     Get the images that belong to a TV season.Querying images with a &lt;code&gt;language&lt;/code&gt; parameter will filter the results. If you want to include a fallback language (especially useful for backdrops) you can use the &lt;code&gt;include_image_language&lt;/code&gt; parameter. This should be a comma seperated value like so: &lt;code&gt;include_image_language&#x3D;en,null&lt;/code&gt;.
     @param tvId 
     @param seasonNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdSeasonSeasonNumberImages(req: { tvId: number, seasonNumber: number, language?: string }): Promise<GetTvTvIdSeasonSeasonNumberImagesResponse>

    /**
     Get Videos
     Get the videos that have been added to a TV season.
     @param tvId 
     @param seasonNumber 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdSeasonSeasonNumberVideos(req: { tvId: number, seasonNumber: number, language?: string }): Promise<GetTvTvIdSeasonSeasonNumberVideosResponse>

    /**
     Get Similar TV Shows
     Get a list of similar TV shows. These items are assembled by looking at keywords and genres.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
     @param page Specify which page to query.
    */
    getTvTvIdSimilar(req: { tvId: number, language?: string, page?: number }): Promise<{}>

    /**
     Get Translations
     Get a list of the translations that exist for a TV show.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdTranslations(req: { tvId: number, language?: string }): Promise<GetTvTvIdTranslationsResponse>

    /**
     Get Videos
     Get the videos that have been added to a TV show.
     @param tvId 
     @param apiKey 
     @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    */
    getTvTvIdVideos(req: { tvId: number, language?: string }): Promise<GetTvTvIdSeasonSeasonNumberVideosResponse>

    /**
     Mark as Favorite
     This method allows you to mark a movie or TV show as a favorite item.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param contentType 
     @param body 
    */
    postAccountAccountIdFavorite(req: { accountId: number, sessionId: string, body?: Body }): Promise<Response>

    /**
     Add to Watchlist
     Add a movie or TV show to your watchlist.
     @param accountId 
     @param apiKey 
     @param sessionId 
     @param contentType 
     @param body 
    */
    postAccountAccountIdWatchlist(req: { accountId: number, sessionId: string, body?: Body1 }): Promise<Response>

    /**
     Create List
     Create a list.
     @param apiKey 
     @param sessionId 
     @param contentType 
     @param body 
    */
    postList(req: { sessionId: string, body?: Body2 }): Promise<InlineResponse201>


    /**
     Add Movie
     Add a movie to a list.
     @param listId 
     @param apiKey 
     @param sessionId 
     @param contentType 
     @param body 
    */
    postListListIdAddItem(req: { listId: string, sessionId: string, body?: Body3 }): Promise<Response>

    /**
     Clear List
     Clear all of the items from a list.
     @param listId 
     @param apiKey 
     @param sessionId 
     @param confirm 
    */
    postListListIdClear(req: { listId: string, sessionId: string, confirm: boolean }): Promise<Response>

    /**
     Remove Movie
     Remove a movie from a list.
     @param listId 
     @param apiKey 
     @param sessionId 
     @param contentType 
     @param body 
    */
    postListListIdRemoveItem(req: { listId: string, sessionId: string, body?: Body4 }): Promise<Response>

    /**
     Rate Movie
     Rate a movie.A valid session or guest session ID is required. You can read more about how this works &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param movieId 
     @param apiKey 
     @param contentType 
     @param guestSessionId 
     @param sessionId 
     @param body 
    */
    postMovieMovieIdRating(req: { movieId: number, guestSessionId?: string, sessionId?: string, body?: Body5 }): Promise<Response>

    /**
     Rate TV Show
     Rate a TV show.A valid session or guest session ID is required. You can read more about how this works &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param apiKey 
     @param contentType 
     @param guestSessionId 
     @param sessionId 
     @param body 
    */
    postTvTvIdRating(req: { tvId: number, guestSessionId?: string, sessionId?: string, body?: Body6 }): Promise<Response>

    /**
     Rate TV Episode
     Rate a TV episode.A valid session or guest session ID is required. You can read more about how this works &lt;a href&#x3D;\&quot;/3/authentication/how-do-i-generate-a-session-id\&quot; class&#x3D;\&quot;undefined\&quot;&gt;here&lt;/a&gt;.
     @param tvId 
     @param seasonNumber 
     @param episodeNumber 
     @param apiKey 
     @param contentType 
     @param guestSessionId 
     @param sessionId 
     @param body 
    */
    postTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberRating(req: { tvId: number, seasonNumber: number, episodeNumber: number, guestSessionId?: string, sessionId?: string, body?: Body7 }): Promise<Response>

}

export let TmdbApiPaths: { [key: string]: string } = {
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