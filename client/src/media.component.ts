import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie, TmdbMedia, TmdbMovieDetails, TmdbTvShowDetails } from "./tmdb/v3/api"
import { FileService, } from "./service"
import { promiseEach, promiseMap, arrayDistinctBy } from "./utils/utils"
import { App, MediaFile } from "./app"
import { Media, Movie, TvShow } from "./media"
import { File, Config,  } from "contracts"

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
        return list.filter(t => t.type == this.filterType);
    }
    setFilter(key: string, value: string) {
    }

    movie_click(movie: MediaFile) {
        this.selectedMovie = movie;
    }

    goBack() {
        this.selectedMovie = null;
    }

    async getPopularMovies() {
        if (this.movies != null && this.movies.length > 0)
            return;
        let e = await this.app.tmdb.movieGetPopular({ language: "en" });
        this.movies = e.results.map(t => <MediaFile>{ md: {}, tmdb: t });
        console.log(this.movies);
    }
    async getAvailableMedia() {
        let list = await this.app.getLatestMediaFiles(); //.getAvailableMedia();
        let list2 = list.orderBy(t => [t.md.tmdbKey ? "1" : "2", t.md.watched ? "1" : "2", t.type, t.md.key].join("\t"));
        //console.log(list2);
        this.movies = list2.take(20);
        await this.app.loadTmdbMediaDetails(this.movies);
        console.log(this.movies);
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
    async tmdbV4Tests() {
        console.log(await this.app.tmdbV4.accountGetLists({}));
        //console.log(await this.app.tmdbV4.invoke(t => t.accountGetCreatedLists({})));
    }

    markAsWatched(mf: MediaFile) {
        return this.app.markAsWatched(mf);
        //return this.app.tmdb.markAsWatched(media.id);
    }

    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }

    async tvAiringToday() {
        let favs = await this.app.tmdb.proxy.getAllPages(t => t.accountGetFavoriteTVShows({}));
        console.log("favs", favs.map(t => t.name));
        let airingToday = await this.app.tmdb.proxy.getAllPages(t => t.tvGetTVAiringToday({})); //timezone: "Europe/Amsterdam"
        console.log("airingToday", airingToday.map(t => t.name));
        console.log(airingToday.map(t => t.name), airingToday);
        let favIds = new Set(favs.map(t => t.id));
        let favAiringToday = airingToday.filter(t => favIds.has(t.id));
        console.log("favAiringToday", favAiringToday.map(t => t.name));
        let x = await this.app.tmdb.tvGetDetails({ tv_id: favAiringToday[0].id });
        let x2 = await this.app.tmdb.tvGetSeason({ tv_id: favAiringToday[0].id, season_number: x.seasons.last().season_number });
        console.log("TV DETAILS", x, x2);

    }
    async tvOnTheAir() {
        let onTheAir = await this.app.tmdb.proxy.getAllPages(t => t.tvGetTVOnTheAir({}));
        console.log(onTheAir.map(t => t.name), onTheAir);
    }


}

