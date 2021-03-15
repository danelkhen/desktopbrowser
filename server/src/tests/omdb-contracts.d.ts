declare module "omdb-contracts" {
    export interface OmdbApi {
        byTitleOrId(req: ByTitleOrId): Promise<ByTitleOrIdResponse>
        bySearch(req: BySearch): Promise<SearchResponse>
    }

    export type MovieType = "movie" | "series" | "episode"
    export interface ByTitleOrId {
        /** Optional* <empty> A valid IMDb ID (e.g. tt1285016) */
        i?: string
        /** Optional* <empty> Movie title to search for.*/
        t?: string
        /** Optional, movie, series, episode <empty> Type of result to return.*/
        type?: MovieType
        /**  Optional, <empty> Year of release.*/
        y?: string
        /**  Optional, short, full short Return short or full plot.*/
        plot?: string
        /**  Optional, json, xml json The data type to return.*/
        r?: string
        /**  Optional, true, false false Include Rotten Tomatoes ratings.*/
        tomatoes?: boolean
        /**  Optional,  <empty> JSONP callback name.*/
        callback?: string
        /**  Optional, 1 API version (reserved for future use).*Please note while both "i" and "t" are optional at least one argument is required.*/
        v?: string
    }

    export interface BySearch {
        /** Required <empty> Movie title to search for. */
        s?: string
        /**  Optional, movie, series, episode <empty> Type of result to return.*/
        type?: MovieType
        /**  Optional, <empty> Year of release. */
        y?: string
        /**  Optional, json, xml json The data type to return. */
        r?: string
        /**  New! No 1-100 1 Page number to return.*/
        page?: string
        /**  Optional, <empty> JSONP callback name.*/
        callback?: string
        /**  Optional, 1 API version (reserved for future use).*/
        v?: string
    }

    export interface OmdbMovie {
        Title: string
        Year: string
        Rated: string
        Released: string
        Runtime: string
        Genre: string
        Director: string
        Writer: string
        Actors: string
        Plot: string
        Language: string
        Country: string
        Awards: string
        Poster: string
        Metascore: string
        imdbRating: string
        imdbVotes: string
        imdbID: string
        Type: string
        Response: string
    }

    export interface OmdbTvshow {
        Title: string
        Year: string
        Rated: string
        Released: string
        Runtime: string
        Genre: string
        Director: string
        Writer: string
        Actors: string
        Plot: string
        Language: string
        Country: string
        Awards: string
        Poster: string
        Metascore: string
        imdbRating: string
        imdbVotes: string
        imdbID: string
        Type: string
        Response: string

        totalSeasons: string
    }

    export interface OmdbEpisode {
        Title: string
        Released: string
        Episode: string
        imdbRating: string
        imdbID: string
    }

    export interface OmdbSeason {
        Title: string
        Season: string
        totalEpisodes: string
        Episodes: OmdbEpisode[]
        Response: string
    }

    export interface OmdbError {
        Response: string
        Error: string
    }

    export type ByTitleOrIdResponse = OmdbSeason | OmdbTvshow | OmdbMovie | OmdbError

    export interface SearchResponse {
        Search: SearchResultItem[]
        totalResults: string
        Response: string
    }

    export interface SearchResultItem {
        Title: string
        Year: string
        imdbID: string
        Type: string
        Poster: string
    }
}
