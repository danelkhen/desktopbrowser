import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie, TmdbMedia, TmdbMovieDetails, TmdbTvShowDetails } from "tmdb-v3"
import { FileService, } from "./service"
import { promiseEach, promiseMap, promiseSetTimeout, ReusePromiseIfStillRunning } from "./utils/utils"
import { App } from "./app"
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

    filter: MediaFilters = {
        type: null,
        watched: null,
        groupSimilar: true,
        search: null,
        sortBy: "fsEntry.mtime desc",
    };
    allMovies: C.MediaFile[];
    movies: C.MediaFile[];
    filteredMovies: C.MediaFile[];
    selectedMovie: C.MediaFile;

    async ngOnInit() {
        window["_page"] = this;
        await this.app.init();
        await this.getAvailableMedia();
        await this.getPopularMovies();
        await this.app.scanAllFsEntries();
    }
    ngOnChanges(changes: SimpleChanges): void { }


    applyFilter() {
        let list = this.allMovies;
        list = this.applyFilterType(list);
        list = this.applyFilterSearch(list);
        list = this.applyFilterWatched(list);
        list = this.applyFilterGroupSimilar(list);
        list = this.applyFilterSortBy(list);
        this.filteredMovies = list;
    }
    applyFilterSortBy(list: C.MediaFile[]): C.MediaFile[] {
        let list2 = list;
        if (this.filter.sortBy == null)
            return list2;
        let tokens = this.filter.sortBy.split(' ');
        let key = tokens[0];
        let dir = (tokens[1] || "ASC").toUpperCase();
        if (key == null || key == "")
            return list2;
        let desc = dir == "DESC";
        if (key == "fsEntry.mtime")
            list2 = list.orderBy(t => t.fsEntry.mtime, desc);
        else if (key == "md.episodeKey")
            list2 = list.orderBy(t => t.md.episodeKey, desc);
        else 
            console.log("not implemented sortBy", key);
        return list2;
    }

    getType(mf: C.MediaFile): string {
        if (mf.type != null)
            return mf.type;
        if (mf.tmdb != null && mf.tmdb.media_type != null)
            return mf.tmdb.media_type;
        if (mf.parsed != null && mf.parsed.episode != null)
            return "tv";
        return null;
    }
    applyFilterType(list: C.MediaFile[]): C.MediaFile[] {
        if (this.filter.type == null)
            return list;

        return list.filter(t => {
            let type = this.getType(t);
            return type == this.filter.type;//type == null || 
        });
    }

    getSimilarKey(mf: C.MediaFile): string {
        return mf.md && mf.md.tmdbKey || mf.parsed && mf.parsed.name || mf.fsEntry && mf.fsEntry.basename;
    }
    applyFilterGroupSimilar(list: C.MediaFile[]): C.MediaFile[] {
        if (!this.filter.groupSimilar)
            return list;
        return list.groupBy(t => this.getSimilarKey(t)).map(group => {
            let list2 = group.orderBy(t => t.md && t.md.episodeKey);
            let best = list2.first(t => !this.isWatched(t));
            return best || list2.first();
        });
    }
    applyFilterSearch(list: C.MediaFile[]): C.MediaFile[] {
        if (this.filter.search == null || this.filter.search == "" || this.filter.search.trim() == "")
            return list;
        let tokens = this.filter.search.split(' ').map(t => t.trim().toLowerCase());

        return list.filter(t => {
            if (t.fsEntry == null)
                return true;
            let name = t.fsEntry.basename.toLowerCase();
            if (name == null)
                return true;
            let x = tokens.every(t => name.contains(t))
            return x;
        });
    }
    isWatched(mf: C.MediaFile): boolean {
        return mf.md != null && mf.md.watched || false;
    }
    applyFilterWatched(list: C.MediaFile[]): C.MediaFile[] {
        if (this.filter.watched == null)
            return list;
        return list.filter(t => this.filter.watched == this.isWatched(t));
    }

    setFilter(key: keyof(MediaFilters), value: any) {
        this.filter[key] = value;
        this.getAvailableMedia();
    }

    async scheduleApplyFilter() {
        await promiseSetTimeout(100);
        await this.getAvailableMedia();
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
        if (this.skip < 0)
            this.skip = 0;
        this.getAvailableMedia();
    }
    nextPage() {
        if (this.filteredMovies == null)
            return;
        this.skip += this.pageSize;
        if (this.skip >= this.filteredMovies.length) {
            this.skip -= this.pageSize;
            ////TODO: load more
            //this.skip = this.allMovies.length - this.pageSize;
        }
        if (this.skip < 0)
            this.skip = 0;
        this.getAvailableMedia();
    }
    isLastPage(): boolean {
        return this.skip + this.pageSize >= this.filteredMovies.length;
    }
    noMoreMoviesOnServer: boolean;
    async getAvailableMedia(req?: { force?: boolean }) {
        if (this.allMovies == null || (req && req.force))
            this.getAllMediaFiles();

        this.onAllMoviesChanged();
    }

    onFiltersChanged() {
        this.onAllMoviesChanged();
    }

    onAllMoviesChanged() {
        this.applyFilter();
        this.applyPaging();
    }

    @ReusePromiseIfStillRunning()
    async getAllMediaFiles(): Promise<any> {
        this.allMovies = [];
        this.onAllMoviesChanged();
        while (!this.noMoreMoviesOnServer) {
            let moreMovies = await this.app.getMediaFiles({ firstResult: this.allMovies.length, maxResults: 500 });
            if (moreMovies.length == 0) {
                this.noMoreMoviesOnServer = true;
                break;
            }
            else {
                console.log("Loading more movies");
                this.allMovies.push(...moreMovies);
                this.onAllMoviesChanged();
                await this.app.loadTmdbMediaDetails(moreMovies);
                this.onAllMoviesChanged();
            }
        }
    }

    applyPaging() {
        this.movies = this.filteredMovies.skip(this.skip).take(this.pageSize);
        console.log({ allMovies: this.allMovies, movies: this.movies, filtered: this.filteredMovies });
    }

    getName(mf: C.MediaFile): string {
        let name = "";
        if (mf.tmdb != null)
            name = mf.tmdb.name || mf.tmdb.title;
        else if (mf.parsed != null)
            name = mf.parsed.name;
        else
            return mf.fsEntry && mf.fsEntry.basename;
        if (mf.md != null && mf.md.episodeKey != null)
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
        this.getAvailableMedia({ force: true });
        while (this.scanStatus != null && this.scanStatus.finished == null) {
            this.scanStatus = await this.app.appService.scanStatus();
            await promiseSetTimeout(3000);
        }
    }

    async reAnalyze() {
        await this.app.analyze(this.movies, { force: true });
    }



}


export interface MediaFilters {
    type: "movie" | "tv" | null;
    watched: boolean;
    groupSimilar: boolean;
    search: string;

    sortBy: string;
}