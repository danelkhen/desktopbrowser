declare module "tmdb-api" {

    export interface TmdbApiAll {
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

    export interface Response {
        statusCode?: number;
        statusMessage?: string;
    }



    export interface Body {
        mediaType?: "movie" | "tv";
        mediaId?: number;
        favorite?: boolean;
    }
    export interface Body1 {
        mediaType?: "movie" | "tv";
        mediaId?: number;
        watchlist?: boolean;
    }
    export interface Body2 {
        name?: string;
        description?: string;
        language?: string;
    }
    export interface Body3 {
        mediaId?: number;
    }
    export interface Body4 {
        mediaId?: number;
    }
    export interface Body5 {
        /**
         * This is the value of the rating you want to submit. The value is expected to be between 0.5 and 10.0.
         */
        value?: number;
    }
    export interface Body6 {
        value?: number;
    }
    export interface Body7 {
        value?: number;
    }
    export interface GetAccountResponse {
        avatar?: InlineResponse200Avatar;
        id?: number;
        iso6391?: string;
        iso31661?: string;
        name?: string;
        includeAdult?: boolean;
        username?: string;
    }

    export interface GetAccountAccountIdListsResponse {
        page?: number;
        results?: Array<InlineResponse2001Results>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20010 {
        id?: number;
        backdrops?: Array<InlineResponse20010Backdrops>;
        posters?: Array<InlineResponse20010Posters>;
    }
    export interface InlineResponse20010Backdrops {
        aspectRatio?: number;
        filePath?: string;
        height?: number;
        voteAverage?: number;
        voteCount?: number;
        width?: number;
    }
    export interface InlineResponse20010Posters {
        aspectRatio?: number;
        filePath?: string;
        height?: number;
        iso6391?: string;
        voteAverage?: number;
        voteCount?: number;
        width?: number;
    }
    export interface InlineResponse20011 {
        headquarters?: string;
        homepage?: string;
        id?: number;
        name?: string;
    }
    export interface InlineResponse20013 {
        creditType?: string;
        department?: string;
        job?: string;
        media?: InlineResponse20013Media;
        mediaType?: string;
        id?: string;
        person?: InlineResponse20013Person;
    }
    export interface InlineResponse20013Media {
        id?: number;
        name?: string;
        originalName?: string;
        character?: string;
        episodes?: Array<any>;
        seasons?: Array<InlineResponse20013MediaSeasons>;
    }
    export interface InlineResponse20013MediaSeasons {
        airDate?: string;
        posterPath?: string;
        seasonNumber?: number;
    }
    export interface InlineResponse20013Person {
        name?: string;
        id?: number;
    }
    export interface InlineResponse20014 {
        genres?: Array<InlineResponse20014Genres>;
    }
    export interface InlineResponse20014Genres {
        id?: number;
        name?: string;
    }
    export interface InlineResponse20015 {
        page?: number;
        results?: Array<InlineResponse20015Results>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20015Results {
        airDate?: string;
        episodeNumber?: number;
        name?: string;
        id?: number;
        seasonNumber?: number;
        stillPath?: string;
        showId?: number;
        voteAverage?: number;
        voteCount?: number;
        rating?: number;
    }
    export interface InlineResponse20016 {
        jobs?: Array<InlineResponse20016Jobs>;
    }
    export interface InlineResponse20016Jobs {
        department?: string;
        jobList?: Array<string>;
    }
    export interface InlineResponse20017 {
        id?: string;
        itemPresent?: boolean;
    }
    export interface InlineResponse20018 {
        results?: Array<GetTvTvIdSeasonSeasonNumberExternalIdsResponse>;
        page?: number;
        totalPages?: number;
        totalResults?: number;
    }
    export interface GetTvTvIdSeasonSeasonNumberExternalIdsResponse {
        id?: number;
    }
    export interface InlineResponse20019 {
        adult?: boolean;
        budget?: number;
        genres?: Array<InlineResponse20014Genres>;
        homepage?: string;
        id?: number;
        imdbId?: string;
        originalLanguage?: string;
        originalTitle?: string;
        overview?: string;
        popularity?: number;
        productionCompanies?: Array<any>;
        productionCountries?: Array<any>;
        releaseDate?: string;
        revenue?: number;
        runtime?: number;
        spokenLanguages?: Array<any>;
        status?: string;
        tagline?: string;
        title?: string;
        video?: boolean;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse2001Results {
        description?: string;
        favoriteCount?: number;
        id?: number;
        itemCount?: number;
        iso6391?: string;
        listType?: string;
        name?: string;
    }
    export interface GetAccountAccountIdRatedTvEpisodesResponse {
        page?: number;
        results?: Array<InlineResponse2002Results>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20020 {
        adult?: boolean;
        budget?: number;
        genres?: Array<InlineResponse20014Genres>;
        homepage?: string;
        id?: number;
        imdbId?: string;
        originalLanguage?: string;
        originalTitle?: string;
        overview?: string;
        popularity?: number;
        productionCompanies?: Array<InlineResponse20013Person>;
        productionCountries?: Array<InlineResponse20020ProductionCountries>;
        releaseDate?: Date;
        revenue?: number;
        runtime?: number;
        spokenLanguages?: Array<InlineResponse20020SpokenLanguages>;
        status?: string;
        tagline?: string;
        title?: string;
        video?: boolean;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse20020ProductionCountries {
        iso31661?: string;
        name?: string;
    }
    export interface InlineResponse20020SpokenLanguages {
        iso6391?: string;
        name?: string;
    }
    export interface InlineResponse20021 {
        id?: number;
        favorite?: boolean;
        watchlist?: boolean;
    }
    export interface InlineResponse20022 {
        id?: number;
        titles?: Array<InlineResponse20022Titles>;
    }
    export interface InlineResponse20022Titles {
        iso31661?: string;
        title?: string;
    }
    export interface InlineResponse20023 {
        changes?: Array<InlineResponse20023Changes>;
    }
    export interface InlineResponse20023Changes {
        key?: string;
        items?: Array<InlineResponse20023Items>;
    }
    export interface InlineResponse20023Items {
        id?: string;
        action?: string;
        time?: string;
        iso6391?: string;
        value?: string;
        originalValue?: string;
    }
    export interface InlineResponse20024 {
        id?: number;
        cast?: Array<InlineResponse20024Cast>;
        crew?: Array<InlineResponse20024Crew>;
    }
    export interface InlineResponse20024Cast {
        castId?: number;
        character?: string;
        creditId?: string;
        id?: number;
        name?: string;
        order?: number;
    }
    export interface InlineResponse20024Crew {
        creditId?: string;
        department?: string;
        id?: number;
        job?: string;
        name?: string;
    }
    export interface InlineResponse20025 {
        id?: number;
        backdrops?: Array<InlineResponse20025Backdrops>;
        posters?: Array<InlineResponse20025Backdrops>;
    }
    export interface InlineResponse20025Backdrops {
        aspectRatio?: number;
        filePath?: string;
        height?: number;
        voteAverage?: number;
        voteCount?: number;
        width?: number;
    }
    export interface InlineResponse20026 {
        id?: number;
        keywords?: Array<InlineResponse20014Genres>;
    }
    export interface InlineResponse20027 {
        id?: number;
        page?: number;
        results?: Array<InlineResponse2001Results>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20028 {
        page?: number;
        results?: Array<MovieListResultObject>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20029 {
        id?: number;
        results?: Array<InlineResponse20029Results>;
    }
    export interface InlineResponse20029ReleaseDates {
        certification?: string;
        iso6391?: string;
        note?: string;
        releaseDate?: string;
        type?: number;
    }
    export interface InlineResponse20029Results {
        iso31661?: string;
        releaseDates?: Array<InlineResponse20029ReleaseDates>;
    }
    export interface InlineResponse2002Results {
        id?: string;
        airDate?: string;
        episodeNumber?: number;
        name?: string;
        seasonNumber?: number;
        showId?: number;
        voteAverage?: number;
        voteCount?: number;
        rating?: number;
    }
    export interface GetAuthenticationGuestSessionNewResponse {
        success?: boolean;
        guestSessionId?: string;
        expiresAt?: string;
    }
    export interface InlineResponse20030 {
        id?: number;
        page?: number;
        results?: Array<InlineResponse20030Results>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20030Results {
        id?: string;
        author?: string;
        content?: string;
        url?: string;
    }
    export interface InlineResponse20031 {
        id?: number;
        translations?: Array<InlineResponse20031Translations>;
    }
    export interface InlineResponse20031Translations {
        iso6391?: string;
        iso31661?: string;
        name?: string;
        englishName?: string;
    }
    export interface InlineResponse20032 {
        id?: number;
        results?: Array<InlineResponse20032Results>;
    }
    export interface InlineResponse20032Results {
        id?: string;
        iso6391?: string;
        iso31661?: string;
        key?: string;
        name?: string;
        site?: string;
        size?: number;
        type?: "Trailer" | "Teaser" | "Clip" | "Featurette";
    }
    export interface InlineResponse20033 {
        adult?: boolean;
        alsoKnownAs?: Array<any>;
        gender?: number;
        id?: number;
        name?: string;
        popularity?: number;
    }
    export interface InlineResponse20034 {
        adult?: boolean;
        alsoKnownAs?: Array<any>;
        biography?: string;
        birthday?: string;
        deathday?: string;
        gender?: number;
        homepage?: string;
        id?: number;
        imdbId?: string;
        name?: string;
        placeOfBirth?: string;
        popularity?: number;
    }
    export interface InlineResponse20035 {
        changes?: Array<InlineResponse20035Changes>;
    }
    export interface InlineResponse20035Changes {
        key?: string;
        items?: Array<InlineResponse20035Items>;
    }
    export interface InlineResponse20035Items {
        id?: string;
        action?: string;
        time?: string;
        originalValue?: InlineResponse20035OriginalValue;
    }
    export interface InlineResponse20035OriginalValue {
        profile?: InlineResponse20035OriginalValueProfile;
    }
    export interface InlineResponse20035OriginalValueProfile {
        filePath?: string;
    }
    export interface InlineResponse20036 {
        cast?: Array<InlineResponse20036Cast>;
        crew?: Array<InlineResponse20036Crew>;
        id?: number;
    }
    export interface InlineResponse20036Cast {
        adult?: boolean;
        character?: string;
        creditId?: string;
        id?: number;
        originalTitle?: string;
        releaseDate?: string;
        title?: string;
        mediaType?: string;
        episodeCount?: number;
        firstAirDate?: string;
        name?: string;
        originalName?: string;
    }
    export interface InlineResponse20036Crew {
        adult?: boolean;
        creditId?: string;
        department?: string;
        id?: number;
        job?: string;
        originalTitle?: string;
        releaseDate?: string;
        title?: string;
        mediaType?: string;
        episodeCount?: number;
        name?: string;
        originalName?: string;
    }
    export interface InlineResponse20037 {
        id?: number;
    }
    export interface InlineResponse20038 {
        id?: number;
        profiles?: Array<InlineResponse20038Profiles>;
    }
    export interface InlineResponse20038Profiles {
        aspectRatio?: number;
        filePath?: string;
        height?: number;
        voteCount?: number;
        width?: number;
    }
    export interface InlineResponse20039 {
        cast?: Array<InlineResponse20039Cast>;
        crew?: Array<InlineResponse20039Crew>;
        id?: number;
    }
    export interface InlineResponse20039Cast {
        adult?: boolean;
        character?: string;
        creditId?: string;
        id?: number;
        originalTitle?: string;
        title?: string;
    }
    export interface InlineResponse20039Crew {
        adult?: boolean;
        creditId?: string;
        department?: string;
        id?: number;
        job?: string;
        originalTitle?: string;
        title?: string;
    }
    export interface GetAuthenticationSessionNewResponse {
        success?: boolean;
        sessionId?: string;
    }
    export interface InlineResponse20040 {
        cast?: Array<InlineResponse20040Cast>;
        crew?: Array<InlineResponse20040Crew>;
        id?: number;
    }
    export interface InlineResponse20040Cast {
        character?: string;
        creditId?: string;
        episodeCount?: number;
        firstAirDate?: string;
        id?: number;
        name?: string;
        originalName?: string;
    }
    export interface InlineResponse20040Crew {
        creditId?: string;
        department?: string;
        episodeCount?: number;
        id?: number;
        job?: string;
        name?: string;
        originalName?: string;
    }
    export interface InlineResponse20041 {
        id?: string;
        author?: string;
        content?: string;
        iso6391?: string;
        mediaId?: number;
        mediaTitle?: string;
        mediaType?: string;
        url?: string;
    }
    export interface InlineResponse20042 {
        page?: number;
        results?: Array<InlineResponse20014Genres>;
        totalPages?: number;
        totalResults?: number;
    }
    export interface InlineResponse20043 {
        changes?: Array<InlineResponse20043Changes>;
    }
    export interface InlineResponse20043Changes {
        key?: string;
        items?: Array<InlineResponse20043Items>;
    }
    export interface InlineResponse20043Items {
        id?: string;
        action?: string;
        time?: string;
        value?: string;
        iso6391?: string;
    }
    export interface InlineResponse20044 {
        createdBy?: Array<any>;
        episodeRunTime?: Array<number>;
        firstAirDate?: string;
        genres?: Array<InlineResponse20014Genres>;
        homepage?: string;
        id?: number;
        inProduction?: boolean;
        languages?: Array<string>;
        lastAirDate?: string;
        name?: string;
        networks?: Array<InlineResponse20014Genres>;
        numberOfEpisodes?: number;
        numberOfSeasons?: number;
        originCountry?: Array<string>;
        originalLanguage?: string;
        originalName?: string;
        popularity?: number;
        productionCompanies?: Array<any>;
        seasons?: Array<InlineResponse20044Seasons>;
        status?: string;
        type?: string;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse20044Seasons {
        airDate?: string;
        episodeCount?: number;
        id?: number;
        seasonNumber?: number;
    }
    export interface InlineResponse20045 {
        changes?: Array<InlineResponse20045Changes>;
    }
    export interface InlineResponse20045Changes {
        key?: string;
        items?: Array<InlineResponse20045Items>;
    }
    export interface InlineResponse20045Items {
        id?: string;
        action?: string;
        time?: string;
        value?: InlineResponse20045Value;
        iso6391?: string;
        originalValue?: string;
    }
    export interface InlineResponse20045Value {
        episodeId?: number;
        episodeNumber?: number;
    }
    export interface InlineResponse20046 {
        createdBy?: Array<InlineResponse20014Genres>;
        episodeRunTime?: Array<number>;
        firstAirDate?: string;
        genres?: Array<InlineResponse20014Genres>;
        homepage?: string;
        id?: number;
        inProduction?: boolean;
        languages?: Array<string>;
        lastAirDate?: string;
        name?: string;
        networks?: Array<InlineResponse20014Genres>;
        numberOfEpisodes?: number;
        numberOfSeasons?: number;
        originCountry?: Array<string>;
        originalLanguage?: string;
        originalName?: string;
        overview?: string;
        popularity?: number;
        productionCompanies?: Array<InlineResponse20013Person>;
        seasons?: Array<InlineResponse20046Seasons>;
        status?: string;
        type?: string;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse20046Seasons {
        airDate?: string;
        episodeCount?: number;
        id?: number;
        posterPath?: string;
        seasonNumber?: number;
    }
    export interface InlineResponse20047 {
        id?: number;
        results?: Array<InlineResponse20047Results>;
    }
    export interface InlineResponse20047Results {
        title?: string;
        iso31661?: string;
    }
    export interface InlineResponse20048 {
        changes?: Array<InlineResponse20048Changes>;
    }
    export interface InlineResponse20048Changes {
        key?: string;
        items?: Array<InlineResponse20048Items>;
    }
    export interface InlineResponse20048Items {
        id?: string;
        action?: string;
        time?: string;
    }
    export interface InlineResponse20049 {
        results?: Array<InlineResponse20049Results>;
        id?: number;
    }
    export interface InlineResponse20049Results {
        iso31661?: string;
        rating?: string;
    }
    export interface InlineResponse2005 {
        success?: boolean;
        expiresAt?: string;
        requestToken?: string;
    }
    export interface InlineResponse20050 {
        cast?: Array<InlineResponse20050Cast>;
        crew?: Array<InlineResponse20050Crew>;
        id?: number;
    }
    export interface InlineResponse20050Cast {
        character?: string;
        creditId?: string;
        id?: number;
        name?: string;
        order?: number;
    }
    export interface InlineResponse20050Crew {
        creditId?: string;
        department?: string;
        id?: number;
        name?: string;
        job?: string;
    }
    export interface InlineResponse20051 {
        backdrops?: Array<InlineResponse20010Backdrops>;
        id?: number;
        posters?: Array<InlineResponse20010Backdrops>;
    }
    export interface InlineResponse20052 {
        id?: number;
        results?: Array<InlineResponse20014Genres>;
    }
    export interface InlineResponse20053 {
        id?: string;
        airDate?: string;
        episodes?: Array<InlineResponse20053Episodes>;
        name?: string;
        overview?: string;
        seasonNumber?: number;
    }
    export interface InlineResponse20053Crew {
        id?: number;
        creditId?: string;
        name?: string;
        department?: string;
        job?: string;
    }
    export interface InlineResponse20053Episodes {
        airDate?: string;
        crew?: Array<InlineResponse20053Crew>;
        episodeNumber?: number;
        guestStars?: Array<any>;
        name?: string;
        overview?: string;
        id?: number;
        seasonNumber?: number;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse20054 {
        id?: number;
        results?: Array<InlineResponse20054Results>;
    }
    export interface InlineResponse20054Rated {
        value?: number;
    }
    export interface InlineResponse20054Results {
        id?: number;
        episodeNumber?: number;
        rated?: InlineResponse20054Rated;
    }
    export interface InlineResponse20055 {
        airDate?: Date;
        crew?: Array<InlineResponse20053Crew>;
        episodeNumber?: number;
        guestStars?: Array<InlineResponse20055GuestStars>;
        name?: string;
        overview?: string;
        id?: number;
        productionCode?: string;
        seasonNumber?: number;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse20055GuestStars {
        id?: number;
        name?: string;
        creditId?: string;
        character?: string;
        order?: number;
    }
    export interface GetTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberCreditsResponse {
        cast?: Array<InlineResponse20050Cast>;
        crew?: Array<InlineResponse20053Crew>;
        guestStars?: Array<InlineResponse20055GuestStars>;
        id?: number;
    }
    export interface GetTvTvIdSeasonSeasonNumberEpisodeEpisodeNumberImagesResponse {
        id?: number;
        stills?: Array<InlineResponse20038Profiles>;
    }
    export interface GetTvTvIdSeasonSeasonNumberVideosResponse {
        id?: number;
        results?: Array<InlineResponse20058Results>;
    }
    export interface InlineResponse20058Results {
        id?: string;
        iso6391?: string;
        iso31661?: string;
        key?: string;
        name?: string;
        site?: string;
        size?: number;
        type?: "Trailer" | "Teaser" | "Clip" | "Featurette";
    }
    export interface GetTvTvIdSeasonSeasonNumberImagesResponse {
        id?: number;
        posters?: Array<InlineResponse20059Posters>;
    }
    export interface InlineResponse20059Posters {
        aspectRatio?: number;
        filePath?: string;
        height?: number;
        iso6391?: string;
        voteCount?: number;
        width?: number;
    }
    export interface InlineResponse2006 {
        success?: boolean;
        requestToken?: string;
    }
    export interface GetTvTvIdTranslationsResponse {
        id?: number;
        translations?: Array<InlineResponse20060Translations>;
    }
    export interface InlineResponse20060Translations {
        iso6391?: string;
        name?: string;
        englishName?: string;
    }
    export interface InlineResponse2007 {
        certifications?: InlineResponse2007Certifications;
    }
    export interface InlineResponse2007Certifications {
        uS?: Array<InlineResponse2007CertificationsUS>;
        cA?: Array<InlineResponse2007CertificationsUS>;
        dE?: Array<InlineResponse2007CertificationsUS>;
        gB?: Array<InlineResponse2007CertificationsUS>;
        aU?: Array<InlineResponse2007CertificationsUS>;
        bR?: Array<InlineResponse2007CertificationsUS>;
        fR?: Array<InlineResponse2007CertificationsUS>;
        nZ?: Array<InlineResponse2007CertificationsUS>;
        iN?: Array<InlineResponse2007CertificationsUS>;
    }
    export interface InlineResponse2007CertificationsUS {
        certification?: string;
        meaning?: string;
        order?: number;
    }
    export interface InlineResponse2008 {
        certifications?: InlineResponse2008Certifications;
    }
    export interface InlineResponse2008Certifications {
        uS?: Array<InlineResponse2007CertificationsUS>;
        cA?: Array<InlineResponse2007CertificationsUS>;
        aU?: Array<InlineResponse2007CertificationsUS>;
        fR?: Array<InlineResponse2007CertificationsUS>;
        rU?: Array<InlineResponse2007CertificationsUS>;
        dE?: Array<InlineResponse2007CertificationsUS>;
        tH?: Array<InlineResponse2007CertificationsUS>;
        kR?: Array<InlineResponse2007CertificationsUS>;
        gB?: Array<InlineResponse2007CertificationsUS>;
        bR?: Array<InlineResponse2007CertificationsUS>;
    }
    export interface InlineResponse2009 {
        id?: number;
        name?: string;
        overview?: string;
        backdropPath?: string;
        parts?: Array<InlineResponse2009Parts>;
    }
    export interface InlineResponse2009Parts {
        adult?: boolean;
        genreIds?: Array<number>;
        id?: number;
        originalLanguage?: string;
        originalTitle?: string;
        overview?: string;
        releaseDate?: string;
        posterPath?: string;
        popularity?: number;
        title?: string;
        video?: boolean;
        voteAverage?: number;
        voteCount?: number;
    }
    export interface InlineResponse200Avatar {
        gravatar?: InlineResponse200AvatarGravatar;
    }
    export interface InlineResponse200AvatarGravatar {
        hash?: string;
    }
    export interface InlineResponse201 {
        statusMessage?: string;
        success?: boolean;
        statusCode?: number;
        listId?: number;
    }
    export interface InlineResponse404 {
        statusMessage?: string;
        statusCode?: number;
    }
    export interface MovieListObject {
        posterPath?: ImagePath;
        adult?: boolean;
        overview?: string;
        releaseDate?: string;
        genreIds?: Array<number>;
        id?: number;
        originalTitle?: string;
        originalLanguage?: string;
        title?: string;
        backdropPath?: ImagePath;
        popularity?: number;
        voteCount?: number;
        video?: boolean;
        voteAverage?: number;
    }
    export interface MovieListResultWithRatingObject {
        adult?: boolean;
        backdropPath?: ImagePath;
        genreIds?: Array<number>;
        id?: number;
        originalLanguage?: string;
        originalTitle?: string;
        overview?: string;
        releaseDate?: string;
        posterPath?: ImagePath;
        popularity?: number;
        title?: string;
        video?: boolean;
        voteAverage?: number;
        voteCount?: number;
        rating?: number;
    }
    export interface MovieListResultsObjectWithMediaType {
        posterPath?: ImagePath;
        adult?: boolean;
        overview?: string;
        releaseDate?: string;
        originalTitle?: string;
        genreIds?: Array<number>;
        id?: number;
        mediaType?: "movie";
        originalLanguage?: string;
        title?: string;
        backdropPath?: ImagePath;
        popularity?: number;
        voteCount?: number;
        video?: boolean;
        voteAverage?: number;
    }
    export interface PersonListResultObjectWithMediaType {
        profilePath?: ImagePath;
        adult?: boolean;
        id?: number;
        mediaType?: "person";
        knownFor?: Array<ERRORUNKNOWN>;
        name?: string;
        popularity?: number;
    }
    export interface PersonListResultsObject {
        profilePath?: ImagePath;
        adult?: boolean;
        id?: number;
        knownFor?: Array<ERRORUNKNOWN>;
        name?: string;
        popularity?: number;
    }
    export interface TvListResultObject {
        posterPath?: ImagePath;
        popularity?: number;
        id?: number;
        backdropPath?: ImagePath;
        voteAverage?: number;
        overview?: string;
        firstAirDate?: string;
        originCountry?: Array<string>;
        genreIds?: Array<number>;
        originalLanguage?: string;
        voteCount?: number;
        name?: string;
        originalName?: string;
    }
    export type ImagePath = string;
    export interface ERRORUNKNOWN {
    }
    export interface TvListResultWithRatingObject {
        backdropPath?: ImagePath;
        firstAirDate?: string;
        genreIds?: Array<number>;
        id?: number;
        originalLanguage?: string;
        originalName?: string;
        overview?: string;
        originCountry?: Array<string>;
        posterPath?: ImagePath;
        popularity?: number;
        name?: string;
        voteAverage?: number;
        voteCount?: number;
        rating?: number;
    }
    export interface TvListResultsObjectWithMediaType {
        posterPath?: ImagePath;
        popularity?: number;
        id?: number;
        overview?: string;
        backdropPath?: ImagePath;
        voteAverage?: number;
        mediaType?: "tv";
        firstAirDate?: string;
        originCountry?: Array<string>;
        genreIds?: Array<number>;
        originalLanguage?: string;
        voteCount?: number;
        name?: string;
        originalName?: string;
    }

}

