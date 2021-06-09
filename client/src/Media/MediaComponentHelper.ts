import * as M from "../../../shared/src/media"
import { File } from "../../../shared/src/contracts"
import { App } from "../App"
import { desc, orderBy, sleep, ReusePromiseIfStillRunning, groupBy } from "../../../shared/src"
import { MediaApp } from "./MediaApp"

export class MediaComponentHelper {
    constructor(public app: MediaApp) {
        const keys = Object.getOwnPropertyNames(this.constructor.prototype)
        const _this = this as any
        for (const key of keys) {
            const value = _this[key]
            if (typeof value === "function") {
                _this[key] = value.bind(this)
            }
        }
    }

    showPosters = false

    filter: MediaFilters = {
        type: null,
        watched: null,
        groupSimilar: true,
        search: null,
        sortBy: "fsEntry.mtime desc",
    }
    allMovies: M.MediaFile[] | undefined
    movies: M.MediaFile[] | undefined
    filteredMovies: M.MediaFile[] | undefined
    selectedMovie: M.MediaFile | null = null
    onChanged: (() => void) | undefined

    async ngOnInit() {
        ;(window as any)["_page"] = this
        // await this.app.init()
        await this.getAvailableMedia()
        await this.getPopularMovies()
        await this.app.scanAllFsEntries()
    }

    applyFilter() {
        let list = this.allMovies ?? []
        list = this.applyFilterType(list)
        list = this.applyFilterSearch(list)
        list = this.applyFilterWatched(list)
        list = this.applyFilterGroupSimilar(list)
        list = this.applyFilterSortBy(list)
        this.filteredMovies = list
    }
    applyFilterSortBy(list: M.MediaFile[]): M.MediaFile[] {
        let list2 = list
        if (this.filter.sortBy == null) return list2
        let tokens = this.filter.sortBy.split(" ")
        let key = tokens[0]
        let dir = (tokens[1] || "ASC").toUpperCase()
        if (key == null || key == "") return list2
        let isDesc = dir == "DESC"
        if (key == "fsEntry.mtime") list2 = list[orderBy](desc(t => t.fsEntry.mtime, isDesc))
        else if (key == "md.episodeKey") list2 = list[orderBy](desc(t => t.md.episodeKey, isDesc))
        else if (key == "name") list2 = list[orderBy](desc(t => this.getName(t), isDesc))
        else if (key == "fsEntry.basename") list2 = list[orderBy](desc(t => t.fsEntry.basename, isDesc))
        else console.log("not implemented sortBy", key)
        return list2
    }

    getType(mf: M.MediaFile): string | null {
        if (mf.type != null) return mf.type
        if (mf.tmdb != null && mf.tmdb.media_type != null) return mf.tmdb.media_type
        if (mf.parsed != null && mf.parsed.episode != null) return "tv"
        return null
    }
    applyFilterType(list: M.MediaFile[]): M.MediaFile[] {
        if (this.filter.type == null) return list

        return list.filter(t => {
            let type = this.getType(t)
            return type == this.filter.type //type == null ||
        })
    }

    getSimilarKey(mf: M.MediaFile): string {
        return (mf.md && mf.md.tmdbKey) || (mf.parsed && mf.parsed.name) || (mf.fsEntry && mf.fsEntry.basename)
    }
    applyFilterGroupSimilar(list: M.MediaFile[]): M.MediaFile[] {
        if (!this.filter.groupSimilar) return list
        return list[groupBy](t => this.getSimilarKey(t)).map(group => {
            let list2 = group[orderBy](t => t.md && t.md.episodeKey)
            let best = list2.find(t => !this.isWatched(t))
            return best || list2[0]
        })
    }
    applyFilterSearch(list: M.MediaFile[]): M.MediaFile[] {
        if (this.filter.search == null || this.filter.search == "" || this.filter.search.trim() == "") return list
        let tokens = this.filter.search.split(" ").map(t => t.trim().toLowerCase())

        return list.filter(t => {
            if (t.fsEntry == null) return true
            let name = t.fsEntry.basename.toLowerCase()
            if (name == null) return true
            let x = tokens.every(t => name.includes(t))
            return x
        })
    }
    isWatched(mf: M.MediaFile): boolean {
        return (mf.md != null && mf.md.watched) || false
    }
    applyFilterWatched(list: M.MediaFile[]): M.MediaFile[] {
        if (this.filter.watched == null) return list
        return list.filter(t => this.filter.watched == this.isWatched(t))
    }

    setFilter(key: keyof MediaFilters, value: any) {
        ;(this.filter as any)[key] = value
        this.getAvailableMedia()
    }

    async scheduleApplyFilter() {
        await sleep(100)
        await this.getAvailableMedia()
    }

    movie_click(movie: M.MediaFile) {
        this.selectedMovie = movie
        console.log("movie_click", this.selectedMovie)
    }

    goBack() {
        this.selectedMovie = null
    }

    async getPopularMovies() {
        if (this.movies != null && this.movies.length > 0) return
        let e = await this.app.tmdbApp.tmdb.movieGetPopular({ language: "en" })
        this.movies = e.results?.map(t => <M.MediaFile>{ md: {}, tmdb: t })
        console.log(this.movies)
    }
    pageSize = 20
    skip = 0

    prevPage() {
        this.skip -= this.pageSize
        if (this.skip < 0) this.skip = 0
        this.getAvailableMedia()
    }
    nextPage() {
        if (this.filteredMovies == null) return
        this.skip += this.pageSize
        if (this.skip >= this.filteredMovies.length) {
            this.skip -= this.pageSize
            ////TODO: load more
            //this.skip = this.allMovies.length - this.pageSize;
        }
        if (this.skip < 0) this.skip = 0
        this.getAvailableMedia()
    }
    isLastPage(): boolean {
        return this.skip + this.pageSize >= this.filteredMovies!.length
    }
    noMoreMoviesOnServer: boolean | undefined
    async getAvailableMedia(req?: { force?: boolean }) {
        if (this.allMovies == null || (req && req.force)) this.getAllMediaFiles()

        this.onAllMoviesChanged()
    }

    onFiltersChanged() {
        this.onAllMoviesChanged()
    }

    onAllMoviesChanged() {
        this.applyFilter()
        this.applyPaging()
    }

    //TODO: @ReusePromiseIfStillRunning()
    async getAllMediaFiles(): Promise<void> {
        this.allMovies = []
        this.onAllMoviesChanged()
        while (!this.noMoreMoviesOnServer) {
            let moreMovies = await this.app.getMediaFiles({ firstResult: this.allMovies.length, maxResults: 500 })
            if (moreMovies.length == 0) {
                this.noMoreMoviesOnServer = true
                break
            } else {
                console.log("Loading more movies")
                this.allMovies.push(...moreMovies)
                this.onAllMoviesChanged()
                await this.app.tmdbApp.loadTmdbMediaDetails(moreMovies)
                this.onAllMoviesChanged()
            }
        }
    }

    applyPaging() {
        this.movies = this.filteredMovies?.slice(this.skip).slice(0, this.pageSize)
        console.log({ allMovies: this.allMovies, movies: this.movies, filtered: this.filteredMovies })
    }

    getName(mf: M.MediaFile): string {
        let name = ""
        if (mf.tmdb != null) name = mf.tmdb.name || mf.tmdb.title
        //else if (mf.parsed != null)
        //    name = mf.parsed.name;
        else return mf.fsEntry && mf.fsEntry.basename
        if (mf.md != null && mf.md.episodeKey != null) name += " " + mf.md.episodeKey
        return name
    }

    canPlay(mf: M.MediaFile): boolean {
        return true
    }
    async play(mf: M.MediaFile): Promise<void> {
        if (mf == null) return
        let path: string | null = null
        if (path == null && mf.fsEntry != null) path = mf.fsEntry.key
        if (path == null && mf.md != null) {
            let file: File | undefined
            if (mf.md.lastKnownPath != null)
                file = await this.app.app.fileService.GetFile({ Path: mf.md.lastKnownPath })
            if (!file) {
                file = await this.app.findFile(mf.md.key)
            }
            if (file == null) return
            path = file.Path ?? null
        }
        if (path == null) return
        await this.app.app.fileService.Execute({ Path: path })
    }

    tmdbV4Login() {
        this.app.tmdbApp.tmdbV4.loginToTmdb().then(e => console.log("LOGIN COMPLETE"))
    }
    async tmdbV4Tests() {
        console.log(await this.app.tmdbApp.tmdbV4.accountGetLists({}))
        //console.log(await this.app.tmdbV4.invoke(t => t.accountGetCreatedLists({})));
    }

    markAsWatched(mf: M.MediaFile) {
        return this.app.markAsWatched(mf)
        //return this.app.tmdb.markAsWatched(media.id);
    }

    addConfigFolder() {
        this.app.config?.folders?.push({ path: "" })
    }

    async tvAiringToday() {
        let favs = await this.app.tmdbApp.tmdb.proxy.getAllPages(t => t.accountGetFavoriteTVShows({}))
        console.log(
            "favs",
            favs.map(t => t.name)
        )
        let airingToday = await this.app.tmdbApp.tmdb.proxy.getAllPages(t => t.tvGetTVAiringToday({})) //timezone: "Europe/Amsterdam"
        console.log(
            "airingToday",
            airingToday.map(t => t.name)
        )
        console.log(
            airingToday.map(t => t.name),
            airingToday
        )
        let favIds = new Set(favs.map(t => t.id))
        let favAiringToday = airingToday.filter(t => favIds.has(t.id))
        console.log(
            "favAiringToday",
            favAiringToday.map(t => t.name)
        )
        let x = await this.app.tmdbApp.tmdb.tvGetDetails({ tv_id: favAiringToday[0].id })
        let x2 = await this.app.tmdbApp.tmdb.tvGetSeason({
            tv_id: favAiringToday[0].id,
            season_number: x.seasons[x.seasons.length - 1].season_number,
        })
        console.log("TV DETAILS", x, x2)
    }
    async tvOnTheAir() {
        let onTheAir = await this.app.tmdbApp.tmdb.proxy.getAllPages(t => t.tvGetTVOnTheAir({}))
        console.log(
            onTheAir.map(t => t.name),
            onTheAir
        )
    }

    scanStatus: M.MediaScannerStatus | undefined
    async scan() {
        this.scanStatus = await this.app.appService.scanForMedia()
        await sleep(3000)
        this.getAvailableMedia({ force: true })
        while (this.scanStatus != null && this.scanStatus.finished == null) {
            this.scanStatus = await this.app.appService.scanStatus()
            await sleep(3000)
        }
    }

    async reAnalyze() {
        await this.app.analyze(this.movies!, { force: true })
    }
}

export interface MediaFilters {
    type: "movie" | "tv" | null
    watched: boolean | null
    groupSimilar: boolean
    search: string | null
    sortBy: string
}
