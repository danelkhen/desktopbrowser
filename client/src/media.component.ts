import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie, TmdbMedia, TmdbMovieDetails, TmdbTvShowDetails } from "tmdb-v3"
import { FileService, } from "./service"
import { promiseEach, promiseMap, arrayDistinctBy, promiseWhile, promiseSetTimeout } from "./utils/utils"
import { App } from "./app"
//import { Media, Movie, TvShow } from "./media"
import { File, Config, } from "contracts"
import * as C from "contracts"


@Component({
    selector: 'my-media',
    templateUrl: '/src/media.component.html',
    styleUrls: ['_res_/src/media.component.css'],
})
export class MediaComponent implements OnInit, OnChanges {
    constructor(private app: App) {

    }

    allMovies: C.MediaFile[];
    movies: C.MediaFile[];
    filteredMovies: C.MediaFile[];
    selectedMovie: C.MediaFile;

    async ngOnInit() {
        await this.app.init();
        await this.getAvailableMedia();
        await this.getPopularMovies();
        await this.app.scanAllFsEntries();
    }
    ngOnChanges(changes: SimpleChanges): void { }

    filterType: "movie" | "tv" | null;

    applyFilter() {
        let list = this.movies;
        list = this.applyFilterType(list);
        this.filteredMovies = list;
    }

    applyFilterType(list: C.MediaFile[]): C.MediaFile[] {
        if (this.filterType == null)
            return list;
        return list.filter(t => t.type == this.filterType);
    }
    setFilter(key: string, value: string) {
    }

    movie_click(movie: C.MediaFile) {
        this.selectedMovie = movie;
    }

    goBack() {
        this.selectedMovie = null;
    }

    async getPopularMovies() {
        if (this.movies != null && this.movies.length > 0)
            return;
        let e = await this.app.tmdb.movieGetPopular({ language: "en" });
        this.movies = e.results.map(t => <C.MediaFile>{ md: {}, tmdb: t });
        console.log(this.movies);
    }
    pageSize = 20;
    skip = 0;

    prevPage() {
        this.skip -= this.pageSize;
        this.getAvailableMedia();
    }
    nextPage() {
        this.skip += this.pageSize;
        this.getAvailableMedia();
    }
    async getAvailableMedia() {
        if (this.allMovies == null) {
            this.allMovies = await this.app.getMediaFiles();
            this.app.analyzeIfNeeded(this.allMovies);
        }
        //let list2 = list.orderBy(t => [t.md.tmdbKey ? "1" : "2", t.md.watched ? "1" : "2", t.type, t.md.key].join("\t"));
        //console.log(list2);
        this.movies = this.allMovies.skip(this.skip).take(this.pageSize);
        console.log({ allMovies: this.allMovies, movies: this.movies });
        await this.app.loadTmdbMediaDetails(this.movies);
        console.log(this.movies);
    }

    getName(mf: C.MediaFile): string {
        let name = mf.md.key;
        if (mf.tmdb != null)
            name = mf.tmdb.name || mf.tmdb.title;
        else if (mf.parsed != null)
            name = mf.parsed.name;
        if (mf.md.episodeKey != null)
            name += " " + mf.md.episodeKey
        return name;
    }

    canPlay(mf: C.MediaFile): boolean {
        return true;
    }
    async play(mf: C.MediaFile): Promise<any> {
        if (mf == null)
            return;
        let path: string = null;
        if (path == null && mf.fsEntry != null)
            path = mf.fsEntry.key;
        if (path == null && mf.md != null) {
            let file: File = null;
            if (mf.md.lastKnownPath != null)
                file = await this.app.fileService.GetFile({ Path: mf.md.lastKnownPath });
            if (file == null)
                file = await this.app.findFile(mf.md.key);
            if (file == null)
                return;
            path = file.Path;
        }
        if (path == null)
            return;
        await this.app.fileService.Execute({ Path: path });
    }

    tmdbV4Login() {
        this.app.tmdbV4.loginToTmdb().then(e => console.log("LOGIN COMPLETE"));
    }
    async tmdbV4Tests() {
        console.log(await this.app.tmdbV4.accountGetLists({}));
        //console.log(await this.app.tmdbV4.invoke(t => t.accountGetCreatedLists({})));
    }

    markAsWatched(mf: C.MediaFile) {
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

    scanStatus: C.MediaScannerStatus;
    async scan() {
        this.scanStatus = await this.app.appService.scanForMedia();
        await promiseSetTimeout(3000);
        this.getAvailableMedia();
        while (this.scanStatus != null && this.scanStatus.finished == null) {
            this.scanStatus = await this.app.appService.scanStatus();
            await promiseSetTimeout(3000);
        }
    }


}

