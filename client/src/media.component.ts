import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { Movie, Media, MovieDetails, TvShowDetails } from "./tmdb/tmdb-api"
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
        this.app.init()
            .then(() => this.test())
            .then(() => this.getMedia());
        //this.test4();
    }
    ngOnChanges(changes: SimpleChanges): void { }


    movie_click(movie: Media) {
        this.selectedMovie = movie;
    }
    goBack() {
        this.selectedMovie = null;
    }

    test() {
        return this.app.tmdb.movieGetPopular({ language: "en" }).then(e => {
            this.movies = e.results;
            console.log(this.movies);
        });
    }
    getMedia() {
        return this.app.getAvailableMedia().then(list => {
            let list2 = list.filter(t => !t.isWatchedOrRated).orderBy(t => t.type + " " + t.name).take(20);
            if (list2.length == 0)
                return Promise.resolve(null);
            return promiseEach(list2, t => t.getTmdbDetails()).then(() => this.movies = list2.map(t => t.tmdbDetails)).then(()=>console.log(this.movies));
        });
        //return this.app.server.db.byFilename.invoke(t => t.find()).then(mds => {
        //    let mds2 = mds.filter(t => t.tmdbTypeAndId != null).filter(t => {
        //        let id = t.tmdbTypeAndId.split("|")[1];
        //        return !this.app.tmdb.isWatchedOrRated(id);
        //    });
        //    return promiseMap(mds2.take(20), t => this.app.tmdb.getMovieOrTvByTypeAndId(t.tmdbTypeAndId)).then(list => {
        //        console.log({ list });
        //        list = arrayDistinctBy(list, t => t.id);
        //        if (list.length > 0)
        //            this.movies = list;
        //    });
        //});
    }

    test4() {
        this.app.tmdbV4.loginToTmdb().then(e => console.log("LOGIN COMPLETE"));
    }

    isWatched(media: TvShowDetails | MovieDetails): boolean {
        if (media.account_states != null && media.account_states.rated)
            return true;
        return this.app.tmdb.isWatchedOrRated(media.id);
    }
    markAsWatched(media: Media) {
        return this.app.tmdb.markAsWatched(media.id);
    }

    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }
    getAvailableMedia() {
        this.app.getAvailableMedia().then(e => console.log(e));
    }
}

