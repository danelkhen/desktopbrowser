import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { Movie, Media } from "./tmdb/tmdb-api"
import { SiteServiceClient, } from "./service"
import { promiseEach, promiseMap, arrayDistinctBy } from "./utils/utils"
import { App, Config } from "./app"

@Component({
    selector: 'my-media',
    templateUrl: '/src/media.component.html',
    styleUrls: ['_res_/src/media.component.css'],
})
export class MediaComponent implements OnInit, OnChanges {
    constructor(private app: App) {

    }

    movies: Media[];
    selectedMovie: Media;

    ngOnInit(): void {
        this.tmdb = new TmdbClient();
        this.tmdb.init().then(() => this.test()).then(() => this.test2());
    }
    ngOnChanges(changes: SimpleChanges): void { }
    tmdb: TmdbClient;


    movie_click(movie: Media) {
        this.selectedMovie = movie;
    }
    goBack() {
        this.selectedMovie = null;
    }

    test() {
        return this.tmdb.invoke(t => t.movieGetPopular({ language: "en" })).then(e => {
            this.movies = e.results;
            console.log(this.movies);
        });
    }
    test2() {
        return this.app.server.db.byFilename.invoke(t => t.find()).then(mds => {
            let mds2 = mds.filter(t => t.tmdbTypeAndId != null);
            promiseMap(mds2, t => this.tmdb.getMovieOrTvById(t.tmdbTypeAndId)).then(list => {
                console.log({ list });
                list = arrayDistinctBy(list, t => t.id);
                if (list.length > 0)
                    this.movies = list;
            });
        });
    }

    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }
    test3() {
        console.log(this.app.tmdb.watchedList.items);
    }
}

