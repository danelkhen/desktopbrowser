//import { TmdbMedia as TmdbMedia, TmdbMovie as TmdbMovie, TvShow as TmdbTvShow, MediaDetails, TmdbTvShowDetails, TmdbMovieDetails } from "tmdb-v3"
//import { App, TmdbMediaInfo } from "./app"

//export abstract class Media {
//    static fromTmdbKey(tmdbKey: string, app: App): Media {
//        let tokens = tmdbKey.split("|");
//        let type = tokens[0] as any;
//        let id = parseInt(tokens[1]);
//        let episodeId = tokens[2];
//        let x: Media;
//        if (type == "tv") {
//            //if (episodeId != null) {
//            //    let x2 = new TvShowEpisode();
//            //    x2.episodeId = episodeId;
//            //    x2.tvShow = Media.fromTmdbKey(tokens.take(2).join("|"), app);
//            //    x = x2;
//            //}
//            //else {
//                x = new TvShow();
//            //}
//        }
//        else if (type == "movie") {
//            x = new Movie();
//        }
//        else
//            console.warn("unknown media type", tmdbKey, x.id);
//        x.type = type;
//        x.id = id;
//        x.app = app;
//        x.init();
//        return x;
//    }
//    static fromTmdbMovie(movie: TmdbMovie, app: App): Media {
//        let x = new Movie();
//        x.id = movie.id;
//        //x.type = movie.media_type;
//        x.tmdbBasic = movie;
//        return x;
//    }

//    app: App;
//    get typeAndId() { return this.type + "|" + this.id; }

//    id: number;
//    type: "movie" | "tv";

//    abstract get isInWatchlist(): boolean;
//    tmdbBasic: TmdbMedia;
//    tmdbDetails: MediaDetails;
//    get tmdb(): TmdbMovieDetails | TmdbTvShowDetails { return (this.tmdbDetails || this.tmdbBasic) as any; }

//    abstract get name(): string;

//    get isWatched(): boolean { return this.info && this.info.watched; }
//    get isWatchedOrRated() { return this.isWatched || this.isRated; }
//    init() { }

//    _getTmdbDetailsPromise: Promise<MediaDetails>;
//    getTmdbDetails(): Promise<MediaDetails> {
//        if (this.tmdbDetails != null)
//            return Promise.resolve(this.tmdbDetails);
//        if (this._getTmdbDetailsPromise != null)
//            return this._getTmdbDetailsPromise;
//        this._getTmdbDetailsPromise = this.app.tmdb.getMovieOrTvByTypeAndId(this.typeAndId).then(t => this.tmdbDetails = t);
//        return this._getTmdbDetailsPromise;
//    }

//    get info(): TmdbMediaInfo { return this.app.getMediaInfo(this.typeAndId); }

//    //_getInfoPromise: Promise<TmdbMediaInfo>;
//    //getInfo(): Promise<TmdbMediaInfo> {
//    //    if (this.info != null)
//    //        return Promise.resolve(this.info);
//    //    if (this._getInfoPromise != null)
//    //        return this._getInfoPromise;
//    //    this._getInfoPromise = this.app.getMediaInfo(this.typeAndId).then(t => this.info = t);
//    //    return this._getInfoPromise;
//    //}
//    saveInfo(): Promise<void> {
//        return this.app.updateMediaInfo(this.typeAndId, this.info);
//    }
//    get tmdbMovieDetails(): TmdbMovieDetails { return this.tmdbDetails as TmdbMovieDetails; }
//    get tmdbTvShowDetails(): TmdbTvShowDetails { return this.tmdbDetails as TmdbTvShowDetails; }
//    get tmdbMovie(): TmdbMovie { return this.tmdbBasic as TmdbMovie; }
//    get tmdbTvShow(): TmdbTvShow { return this.tmdbBasic as TmdbTvShow; }
//    get isRated(): boolean { return this.app.tmdb.rated.has(this.typeAndId); }
//    filenames: string[];
//    get canPlay(): boolean { return this.filenames == null || this.filenames.length == 0; }
//    async play(): Promise<void> {
//        if (!this.canPlay)
//            return;
//        let filename = this.filenames[0];
//        let file = await this.app.findFile(filename);
//        if (file == null)
//            return;
//        await this.app.fileService.Execute({ Path: file.Path });
//    }

//}

//export class TvShow extends Media {
//    get isInWatchlist(): boolean { return this.app.tmdb.tvShowWatchlistIds.has(this.id); }
//    get name(): string { return this.tmdbTvShowDetails && this.tmdbTvShowDetails.name; }
//}

//export class Movie extends Media {
//    get isInWatchlist(): boolean { return this.app.tmdb.movieWatchlistIds.has(this.id); }
//    get name(): string { return this.tmdbMovieDetails && this.tmdbMovieDetails.title; }

//}

////export class TvShowEpisode extends Media {
////    episodeId: string;
////    tvShow: TvShow;
////    get typeAndId() { return this.type + "|" + this.id + "|" + this.episodeId; }
////    get isInWatchlist(): boolean { return this.tvShow.isInWatchlist; }
////    get name(): string { return this.tmdbTvShow.name + " " + this.episodeId; }

////}
