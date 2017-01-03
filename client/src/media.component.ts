import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { Movie, Media, MovieDetails, TvShowDetails } from "./tmdb/tmdb-api"
import { FileService, } from "./service"
import { promiseEach, promiseMap, arrayDistinctBy } from "./utils/utils"
import { App, Config, } from "./app"
import { Media as DsMedia, } from "./media"

@Component({
    selector: 'my-media',
    templateUrl: '/src/media.component.html',
    styleUrls: ['_res_/src/media.component.css'],
})
export class MediaComponent implements OnInit, OnChanges {
    constructor(private app: App) {

    }

    movies: DsMedia[];
    selectedMovie: DsMedia;

    ngOnInit(): void {
        this.app.init()
            .then(() => this.getMedia())
            .then(() => this.getPopularMovies())
            ;
        //this.test4();
        //this.app.tmdbV4.invoke(t=>t.accountGetCreatedLists({}));
    }
    ngOnChanges(changes: SimpleChanges): void { }


    movie_click(movie: DsMedia) {
        this.selectedMovie = movie;
    }
    goBack() {
        this.selectedMovie = null;
    }

    getPopularMovies() {
        if (this.movies != null && this.movies.length > 0)
            return Promise.resolve();
        return this.app.tmdb.movieGetPopular({ language: "en" }).then(e => {
            this.movies = e.results.map(t => DsMedia.fromTmdbMovie(t));
            console.log(this.movies);
        });
    }
    async getMedia() {
        let list = await this.app.getAvailableMedia();
        for (let t of list) {
            await t.getInfo();
        }
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

    markAsWatched(media: DsMedia) {
        return this.app.tmdb.markAsWatched(media.typeAndId);
        //return this.app.tmdb.markAsWatched(media.id);
    }

    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }
    getAvailableMedia() {
        this.app.getAvailableMedia().then(e => console.log(e));
    }
}

