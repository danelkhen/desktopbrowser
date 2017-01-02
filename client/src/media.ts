import { Media as TmdbMedia, Movie as TmdbMovie, TvShow as TmdbTvShow, MediaDetails, TvShowDetails, MovieDetails } from "./tmdb/tmdb-api"
import { App } from "./app"

export abstract class Media {
    static fromTmdbTypeAndId(typeAndId: string, app: App): Media {
        let tokens = typeAndId.split("|");
        let type = tokens[0] as any;
        let id = parseInt(tokens[1]);
        let x: Media;
        if (type == "tv") {
            x = new TvShow();
        }
        else if (type == "movie") {
            x = new Movie();
        }
        else
            console.warn("unknown media type", typeAndId, x.id);
        x.type = type;
        x.id = id;
        x.app = app;
        x.init();
        return x;
    }
    app: App;

    id: number;
    type: "movie" | "tv";

    abstract get isInWatchlist(): boolean;
    abstract get isRated(): boolean;
    tmdbDetails: MediaDetails;
    abstract get name(): string;

    get isWatched(): boolean { return this.app.tmdb.watched.has(this.id); }
    get isWatchedOrRated() { return this.isWatched || this.isRated; }
    init() { }

    _getTmdbDetailsPromise: Promise<MediaDetails>;
    getTmdbDetails(): Promise<MediaDetails> {
        if (this._getTmdbDetailsPromise != null)
            return this._getTmdbDetailsPromise;
        this._getTmdbDetailsPromise = this.app.tmdb.getMovieOrTvByTypeAndId(this.type + "|" + this.id).then(t => this.tmdbDetails = t);
        return this._getTmdbDetailsPromise;
    }
    get movieDetails(): MovieDetails { return this.tmdbDetails as MovieDetails; }
    get tvShowDetails(): TvShowDetails { return this.tmdbDetails as TvShowDetails; }

}

export class TvShow extends Media {
    get isInWatchlist(): boolean { return this.app.tmdb.tvShowWatchlistIds.has(this.id); }
    get isRated(): boolean { return this.app.tmdb.ratedTvShows.has(this.id); }
    get name(): string { return this.tvShowDetails && this.tvShowDetails.name; }
}

export class Movie extends Media {
    get isInWatchlist(): boolean { return this.app.tmdb.movieWatchlistIds.has(this.id); }
    get isRated(): boolean { return this.app.tmdb.ratedMovies.has(this.id); }
    get name(): string { return this.movieDetails && this.movieDetails.title; }

}
