declare module "imdb-api" {
    export class Inverter {
        private obj;
        private rev_obj;
        constructor(obj: Object);
        get(key: string): string;
    }
    export interface OmdbMovie {
        Title: string;
        Year: string;
        Rated: string;
        Released: string;
        Runtime: string;
        Genre: string;
        Director: string;
        Writer: string;
        Actors: string;
        Plot: string;
        Language: string;
        Country: string;
        Awards: string;
        Poster: string;
        Metascore: string;
        imdbRating: string;
        imdbVotes: string;
        imdbID: string;
        Type: string;
        Response: string;
    }
    export interface OmdbTvshow {
        Title: string;
        Year: string;
        Rated: string;
        Released: string;
        Runtime: string;
        Genre: string;
        Director: string;
        Writer: string;
        Actors: string;
        Plot: string;
        Language: string;
        Country: string;
        Awards: string;
        Poster: string;
        Metascore: string;
        imdbRating: string;
        imdbVotes: string;
        imdbID: string;
        Type: string;
        Response: string;
        totalSeasons: string;
    }
    export interface OmdbEpisode {
        Title: string;
        Released: string;
        Episode: string;
        imdbRating: string;
        imdbID: string;
    }
    export interface OmdbSeason {
        Title: string;
        Season: string;
        totalEpisodes: string;
        Episodes: OmdbEpisode[];
        Response: string;
    }
    export interface OmdbError {
        Response: string;
        Error: string;
    }
    export function isError(response: OmdbSeason | OmdbTvshow | OmdbMovie | OmdbError): response is OmdbError;
    export function isTvshow(response: OmdbMovie | OmdbTvshow): response is OmdbTvshow;
    export function isMovie(response: OmdbMovie | OmdbTvshow): response is OmdbTvshow;

    export interface MovieRequest {
        name?: string;
        id?: string;
        year?: number;
    }
    export class Episode {
        season: number;
        name: string;
        episode: number;
        released: Date;
        imdbid: string;
        rating: number;
        constructor(obj: OmdbEpisode, season: number);
    }
    export class Movie {
        imdbid: string;
        imdburl: string;
        genres: string;
        languages: string;
        country: string;
        votes: string;
        series: boolean;
        rating: number;
        runtime: string;
        title: string;
        year: number;
        type: string;
        poster: string;
        metascore: string;
        plot: string;
        rated: string;
        director: string;
        writer: string;
        actors: string;
        released: Date;
        private _year_data;
        constructor(obj: OmdbMovie);
    }
    export class TVShow extends Movie {
        private _episodes;
        start_year: any;
        end_year: any;
        totalseasons: any;
        constructor(object: OmdbTvshow);
        episodes(cb?: (err: Error, data: Episode[]) => any): any;
    }
    export class ImdbError {
        message: string;
        movie: MovieRequest;
        name: string;
        constructor(message: string, movie: MovieRequest);
    }
    export function getReq(req: MovieRequest, cb?: (err: Error, data: Movie) => any): Promise<Movie>;
    export function get(name: string, cb?: (err: Error, data: Movie) => any): Promise<Movie>;
    export function getById(imdbid: string, cb?: (err: Error, data: Movie) => any): Promise<Movie>;
}