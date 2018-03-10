"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const utils_1 = require("./utils/utils");
const app_1 = require("./app");
let MediaComponent = class MediaComponent {
    constructor(app) {
        this.app = app;
        this.filter = {
            type: null,
            watched: null,
            groupSimilar: true,
            search: null,
            sortBy: "fsEntry.mtime desc",
        };
        this.pageSize = 20;
        this.skip = 0;
    }
    async ngOnInit() {
        window["_page"] = this;
        await this.app.init();
        await this.getAvailableMedia();
        await this.getPopularMovies();
        await this.app.scanAllFsEntries();
    }
    ngOnChanges(changes) { }
    applyFilter() {
        let list = this.allMovies;
        list = this.applyFilterType(list);
        list = this.applyFilterSearch(list);
        list = this.applyFilterWatched(list);
        list = this.applyFilterGroupSimilar(list);
        list = this.applyFilterSortBy(list);
        this.filteredMovies = list;
    }
    applyFilterSortBy(list) {
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
        else if (key == "name")
            list2 = list.orderBy(t => this.getName(t), desc);
        else if (key == "fsEntry.basename")
            list2 = list.orderBy(t => t.fsEntry.basename, desc);
        else
            console.log("not implemented sortBy", key);
        return list2;
    }
    getType(mf) {
        if (mf.type != null)
            return mf.type;
        if (mf.tmdb != null && mf.tmdb.media_type != null)
            return mf.tmdb.media_type;
        if (mf.parsed != null && mf.parsed.episode != null)
            return "tv";
        return null;
    }
    applyFilterType(list) {
        if (this.filter.type == null)
            return list;
        return list.filter(t => {
            let type = this.getType(t);
            return type == this.filter.type;
        });
    }
    getSimilarKey(mf) {
        return mf.md && mf.md.tmdbKey || mf.parsed && mf.parsed.name || mf.fsEntry && mf.fsEntry.basename;
    }
    applyFilterGroupSimilar(list) {
        if (!this.filter.groupSimilar)
            return list;
        return list.groupBy(t => this.getSimilarKey(t)).map(group => {
            let list2 = group.orderBy(t => t.md && t.md.episodeKey);
            let best = list2.first(t => !this.isWatched(t));
            return best || list2.first();
        });
    }
    applyFilterSearch(list) {
        if (this.filter.search == null || this.filter.search == "" || this.filter.search.trim() == "")
            return list;
        let tokens = this.filter.search.split(' ').map(t => t.trim().toLowerCase());
        return list.filter(t => {
            if (t.fsEntry == null)
                return true;
            let name = t.fsEntry.basename.toLowerCase();
            if (name == null)
                return true;
            let x = tokens.every(t => name.contains(t));
            return x;
        });
    }
    isWatched(mf) {
        return mf.md != null && mf.md.watched || false;
    }
    applyFilterWatched(list) {
        if (this.filter.watched == null)
            return list;
        return list.filter(t => this.filter.watched == this.isWatched(t));
    }
    setFilter(key, value) {
        this.filter[key] = value;
        this.getAvailableMedia();
    }
    async scheduleApplyFilter() {
        await utils_1.promiseSetTimeout(100);
        await this.getAvailableMedia();
    }
    movie_click(movie) {
        this.selectedMovie = movie;
        console.log("movie_click", this.selectedMovie);
    }
    goBack() {
        this.selectedMovie = null;
    }
    async getPopularMovies() {
        if (this.movies != null && this.movies.length > 0)
            return;
        let e = await this.app.tmdb.movieGetPopular({ language: "en" });
        this.movies = e.results.map(t => ({ md: {}, tmdb: t }));
        console.log(this.movies);
    }
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
        }
        if (this.skip < 0)
            this.skip = 0;
        this.getAvailableMedia();
    }
    isLastPage() {
        return this.skip + this.pageSize >= this.filteredMovies.length;
    }
    async getAvailableMedia(req) {
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
    async getAllMediaFiles() {
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
    getName(mf) {
        let name = "";
        if (mf.tmdb != null)
            name = mf.tmdb.name || mf.tmdb.title;
        else
            return mf.fsEntry && mf.fsEntry.basename;
        if (mf.md != null && mf.md.episodeKey != null)
            name += " " + mf.md.episodeKey;
        return name;
    }
    canPlay(mf) {
        return true;
    }
    async play(mf) {
        if (mf == null)
            return;
        let path = null;
        if (path == null && mf.fsEntry != null)
            path = mf.fsEntry.key;
        if (path == null && mf.md != null) {
            let file = null;
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
    }
    markAsWatched(mf) {
        return this.app.markAsWatched(mf);
    }
    addConfigFolder() {
        this.app.config.folders.push({ path: null });
    }
    async tvAiringToday() {
        let favs = await this.app.tmdb.proxy.getAllPages(t => t.accountGetFavoriteTVShows({}));
        console.log("favs", favs.map(t => t.name));
        let airingToday = await this.app.tmdb.proxy.getAllPages(t => t.tvGetTVAiringToday({}));
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
    async scan() {
        this.scanStatus = await this.app.appService.scanForMedia();
        await utils_1.promiseSetTimeout(3000);
        this.getAvailableMedia({ force: true });
        while (this.scanStatus != null && this.scanStatus.finished == null) {
            this.scanStatus = await this.app.appService.scanStatus();
            await utils_1.promiseSetTimeout(3000);
        }
    }
    async reAnalyze() {
        await this.app.analyze(this.movies, { force: true });
    }
};
__decorate([
    utils_1.ReusePromiseIfStillRunning(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaComponent.prototype, "getAllMediaFiles", null);
MediaComponent = __decorate([
    core_1.Component({
        selector: 'my-media',
        templateUrl: '/src/media.component.html',
        styleUrls: ['_res_/src/media.component.css'],
    }),
    __metadata("design:paramtypes", [app_1.App])
], MediaComponent);
exports.MediaComponent = MediaComponent;
//# sourceMappingURL=media.component.js.map