declare module "tmdb-api" {

    export interface TmdbApi {
        /**
        Get API Configuration
        Get the system wide configuration information. Some elements of the API require some knowledge of this configuration data. The purpose of this is to try and keep the actual API responses as light as possible. It is recommended you cache this data within your application and check for updates every few days.This method currently holds the data relevant to building image URLs as well as the change key map.To build an image URL, you will need 3 pieces of data. The &lt;code&gt;base_url&lt;/code&gt;, &lt;code&gt;size&lt;/code&gt; and &lt;code&gt;file_path&lt;/code&gt;. Simply combine them all and you will have a fully qualified URL. Here’s an example URL:&lt;pre&gt;&lt;code&gt;https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg &lt;/code&gt;&lt;/pre&gt; The configuration method also contains the list of change keys which can be useful if you are building an app that consumes data from the change feed.
        @param apiKey 
       */
        getConfiguration(req: { extraHttpRequestParams?: any }): Promise<Configuration>

        /** Search Movies Search for movies.*/
        searchMovie(req: SearchMovieRequest): Promise<PagedResponse<MovieListResultObject>>
        /** Search TV Shows Search for a TV show.*/
        searchTv(req: SearchTvRequest): Promise<PagedResponse<MovieListResultObject>>
        /**
         Get Popular
         Get a list of the current popular movies on TMDb. This list updates daily.
         @param apiKey 
         @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
         @param page Specify which page to query.
         @param region Specify a ISO 3166-1 code to filter release dates.
        */
        getMoviePopular(req: { language?: string, page?: number, region?: string }): Promise<PagedResponse<MovieListResultObject>>
    }

    /**      
    @param query Pass a text query to search. This value should be URI encoded.
    @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    @param page Specify which page to query.
    */
    export interface SearchRequest {
        query: string,
        language?: string,
        page?: number,
    }
    /**
    @param includeAdult Choose whether to inlcude adult (pornography) content in the results.
    @param region Specify a ISO 3166-1 code to filter release dates.
    @param year 
    @param primaryReleaseYear 
    */
    export interface SearchMovieRequest extends SearchRequest {
        includeAdult?: boolean,
        region?: string,
        year?: number,
        primaryReleaseYear?: number
    }
    /**       
    @param query Pass a text query to search. This value should be URI encoded.
    @param language Pass a ISO 639-1 value to display translated data for the fields that support it.
    @param page Specify which page to query.
    @param firstAirDateYear 
    */
    export interface SearchTvRequest extends SearchRequest {
        firstAirDateYear?: number
    }

    export interface PagedResponse<T> {
        page?: number;
        results?: T[];
        totalPages?: number;
        totalResults?: number;
    }

    export interface Configuration {
        images?: ImagesConfiguration;
        changeKeys?: Array<string>;
    }
    export interface ImagesConfiguration {
        base_url?: string;
        secure_base_url?: string;
        backdrop_sizes?: Array<string>;
        logo_sizes?: Array<string>;
        poster_sizes?: Array<string>;
        profile_sizes?: Array<string>;
        still_sizes?: Array<string>;
    }

    export interface MovieListResultObject {
        poster_path?: ImagePath;
        adult?: boolean;
        overview?: string;
        releaseDate?: string;
        originalTitle?: string;
        genreIds?: Array<number>;
        id?: number;
        mediaType?: "movie";
        originalLanguage?: string;
        title?: string;
        backdrop_path?: ImagePath;
        popularity?: number;
        voteCount?: number;
        video?: boolean;
        voteAverage?: number;
    }

}

