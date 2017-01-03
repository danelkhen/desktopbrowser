import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie, TmdbMedia, TmdbMovieDetails, TmdbTvShowDetails } from "./tmdb/tmdb-api"
import { FileService, } from "./service"
import { promiseEach, promiseMap, arrayDistinctBy } from "./utils/utils"
import { App, Config, } from "./app"
import { Media, Movie, TvShow } from "./media"

@Component({
    selector: 'my-media',
    templateUrl: '/src/media.component.html',
    styleUrls: ['_res_/src/media.component.css'],
})
export class MediaComponent implements OnInit, OnChanges {
    constructor(private app: App) {

    }

    movies: Media[];
    filteredMovies: Media[];
    selectedMovie: Media;

    ngOnInit(): void {
        this.app.init()
            .then(() => this.getAvailableMedia())
            .then(() => this.getPopularMovies())
            ;
        //this.test4();
        //this.app.tmdbV4.invoke(t=>t.accountGetCreatedLists({}));
    }
    ngOnChanges(changes: SimpleChanges): void { }

    filterType: "movie" | "tv" | null;

    applyFilter() {
        let list = this.movies;

        list = this.applyFilterType(list);

        this.filteredMovies = list;
    }
    applyFilterType(list: Media[]): Media[] {
        if (this.filterType == null)
            return list;
        if (this.filterType == "movie")
            return list.filter(t => t instanceof Movie);
        if (this.filterType == "tv")
            return list.filter(t => t instanceof TvShow);
        return list;
    }


    movie_click(movie: Media) {
        this.selectedMovie = movie;
    }
    goBack() {
        this.selectedMovie = null;
    }

    getPopularMovies() {
        if (this.movies != null && this.movies.length > 0)
            return Promise.resolve();
        return this.app.tmdb.movieGetPopular({ language: "en" }).then(e => {
            this.movies = e.results.map(t => Media.fromTmdbMovie(t, this.app));
            console.log(this.movies);
        });
    }
    async getAvailableMedia() {
        let list = await this.app.getAvailableMedia();

        let list2 = list.filter(t => !t.isWatchedOrRated).orderBy(t => t.type + " " + t.name).take(20);
        if (list2.length == 0)
            return;
        for (let t of list2) {
            await t.getTmdbDetails();
        }
        this.movies = list2;
    }

    tmdbV4Login() {
        this.app.tmdbV4.loginToTmdb().then(e => console.log("LOGIN COMPLETE"));
    }

    markAsWatched(media: Media) {
        return this.app.tmdb.markAsWatched(media.typeAndId);
        //return this.app.tmdb.markAsWatched(media.id);
    }

    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }
}

