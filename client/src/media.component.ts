import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie, TmdbMedia, TmdbMovieDetails, TmdbTvShowDetails } from "./tmdb/tmdb-api"
import { FileService, } from "./service"
import { promiseEach, promiseMap, arrayDistinctBy } from "./utils/utils"
import { App, Config, MediaFile } from "./app"
import { Media, Movie, TvShow } from "./media"
import { File } from "contracts"

@Component({
    selector: 'my-media',
    templateUrl: '/src/media.component.html',
    styleUrls: ['_res_/src/media.component.css'],
})
export class MediaComponent implements OnInit, OnChanges {
    constructor(private app: App) {

    }

    movies: MediaFile[];
    filteredMovies: MediaFile[];
    selectedMovie: MediaFile;

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
    applyFilterType(list: MediaFile[]): MediaFile[] {
        if (this.filterType == null)
            return list;
        if (this.filterType == "movie")
            return list.filter(t => t instanceof Movie);
        if (this.filterType == "tv")
            return list.filter(t => t instanceof TvShow);
        return list;
    }


    movie_click(movie: MediaFile) {
        this.selectedMovie = movie;
    }

    goBack() {
        this.selectedMovie = null;
    }

    getPopularMovies() {
        if (this.movies != null && this.movies.length > 0)
            return Promise.resolve();
        return this.app.tmdb.movieGetPopular({ language: "en" }).then(e => {
            this.movies = e.results.map(t => <MediaFile>{ md: {}, tmdb: t });//Media.fromTmdbMovie(t, this.app));
            console.log(this.movies);
        });
    }
    async getAvailableMedia() {
        let list = await this.app.getAvailableMedia();
        let list2 = list.orderBy(t => [t.md.tmdbKey ? "1" : "2", t.md.watched ? "1" : "2", t.type, t.md.key].join("\t"));
        console.log(list2);
        this.movies = list2;
        await this.app.loadTmdbMediaDetails(list.take(20));
        //if (list2.length == 0)
        //    return;
        //for (let t of list2) {
        //    await t.getTmdbDetails();
        //}
    }
    getName(mf: MediaFile): string {
        let name = mf.md.key;
        if (mf.tmdb != null)
            name = mf.tmdb.name || mf.tmdb.title;
        else if (mf.parsed != null)
            name = mf.parsed.name;
        if (mf.md.episodeKey != null)
            name += " " + mf.md.episodeKey
        return name;
    }

    async play(mf: MediaFile): Promise<any> {
        if (mf == null || mf.md == null)
            return;
        let file: File = null;
        if (mf.md.lastKnownPath != null)
            file = await this.app.fileService.GetFile({ Path: mf.md.lastKnownPath });
        if (file == null)
            file = await this.app.findFile(mf.md.key);
        if (file == null)
            return;
        await this.app.fileService.Execute({ Path: file.Path });
    }

    tmdbV4Login() {
        this.app.tmdbV4.loginToTmdb().then(e => console.log("LOGIN COMPLETE"));
    }

    markAsWatched(mf: MediaFile) {
        return this.app.markAsWatched(mf);
        //return this.app.tmdb.markAsWatched(media.id);
    }

    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }
}

