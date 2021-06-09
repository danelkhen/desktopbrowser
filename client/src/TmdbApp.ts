import * as C from "../../shared/src/media"
import { plus } from "../../shared/src"
import { TmdbApiV3 } from "../../tmdb/src"
import { MediaApp } from "./Media/MediaApp"
import { TmdbClientV3Extended } from "./Media/TmdbClientV3Extended"
import { TmdbClientV4Extended } from "./Media/TmdbClientV4Extended"
type MediaDetails = TmdbApiV3.MediaDetails

export class TmdbApp {
    constructor(public app: MediaApp) {
        this.tmdb = new TmdbClientV3Extended()
        this.tmdb.base_url = "/tmdb_proxy/3"
        this.tmdb.api_key = "16a856dff4d1db46782e6132610ddb32"
        this.tmdbV4 = new TmdbClientV4Extended()
        this.tmdbV4.base_url = "/tmdb_proxy/4"
        this.tmdbV4.read_access_token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmE4NTZkZmY0ZDFkYjQ2NzgyZTYxMzI2MTBkZGIzMiIsInN1YiI6IjU4NGZlYzU1OTI1MTQxNmU0YjAwODUwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jg-T4s-kFV_FlXwG1tovDvCQhXGaw9cjMA9e669xFaE"
    }
    tmdb: TmdbClientV3Extended
    tmdbV4: TmdbClientV4Extended
    get keyValue() {
        return this.app.keyValue
    }

    async init() {
        await this.getSavedRatings()
        await this.getSavedWatchlists()
        let tmdb = this.tmdb
        let inWatchlist = tmdb.movieWatchlistIds[plus](tmdb.tvShowWatchlistIds)
        let x = {
            rated: Array.from(tmdb.rated),
            watched: Array.from(tmdb.watched),
            inWatchlist: Array.from(inWatchlist),
            movieWatchlistIds: Array.from(tmdb.movieWatchlistIds),
            tvShowWatchlistIds: Array.from(tmdb.tvShowWatchlistIds),
        }
        console.log("onInit", x)
    }

    async getSavedRatings(): Promise<void> {
        let pages = await this.keyValue.findAllWithKeyLike<TmdbRatingsPage>({ like: "tmdb_ratings_%" })
        pages.forEach(page => {
            if (page.key.includes("_tv_")) page.value.ids.forEach(id => this.tmdb.rated.add("tv|" + id))
            else if (page.key.includes("_movie_")) page.value.ids.forEach(id => this.tmdb.rated.add("movie|" + id))
        })
    }

    async getSavedWatchlists(): Promise<void> {
        let pages = await this.keyValue.findAllWithKeyLike<TmdbRatingsPage>({ like: "tmdb_watchlist_%" })
        pages.forEach(page => {
            if (page.key.includes("_tv_")) page.value.ids.forEach(id => this.tmdb.tvShowWatchlistIds.add(id))
            else if (page.key.includes("_movie_")) page.value.ids.forEach(id => this.tmdb.movieWatchlistIds.add(id))
        })
    }

    async downloadRatings() {
        await this.tmdb.proxy.getAllPages(
            t => t.accountGetRatedMovies({}),
            res =>
                res.page &&
                res.results &&
                this.savePage(
                    "ratings",
                    "movie",
                    res.page,
                    res.results.map(t => t.id)
                )
        )
        await this.tmdb.proxy.getAllPages(
            t => t.accountGetRatedTVShows({}),
            res =>
                res.page &&
                res.results &&
                this.savePage(
                    "ratings",
                    "tv",
                    res.page,
                    res.results.map(t => t.id)
                )
        )
    }
    async downloadWatchlists() {
        await this.tmdb.proxy.getAllPages(
            t => t.accountGetMovieWatchlist({}),
            res =>
                res.page &&
                res.results &&
                this.savePage(
                    "watchlist",
                    "movie",
                    res.page,
                    res.results.map(t => t.id)
                )
        )
        await this.tmdb.proxy.getAllPages(
            t => t.accountGetTVShowWatchlist({}),
            res =>
                res.page &&
                res.results &&
                this.savePage(
                    "watchlist",
                    "tv",
                    res.page,
                    res.results.map(t => t.id)
                )
        )
    }
    async getMovieOrTvByTypeAndId(tmdbKey: string): Promise<MediaDetails | null> {
        if (tmdbKey == null || tmdbKey == "" || tmdbKey.split("|").some(t => t.length == 0)) return null
        let cacheKey = "tmdb|details|" + tmdbKey
        let x = await this.keyValue.findOneById<MediaDetails>({ id: cacheKey })
        if (x != null && x.value != null) return x.value
        let x2 = await this.tmdb.getMovieOrTvByTypeAndId(tmdbKey)
        this.keyValue.persist({ key: cacheKey, value: x2 })
        return x2
    }
    async loadTmdbMediaDetails(mfs: C.MediaFile[]): Promise<C.MediaFile[]> {
        for (let mf of mfs) {
            if (mf.tmdb != null) continue
            if (!mf.md.tmdbKey) continue
            await this.app.analyze([mf])
            mf.tmdb = await this.getMovieOrTvByTypeAndId(mf.md.tmdbKey)
        }
        return mfs
    }
    async savePage(name: string, media_type: "movie" | "tv", page: number, ids: number[]) {
        await this.keyValue.persist<TmdbRatingsPage>({
            key: "tmdb_" + name + "_" + media_type + "_page_" + page,
            value: { ids: ids },
        })
    }
}

export interface TmdbMediaInfo {
    key: string
    watched?: boolean
}
export interface TmdbRatingsPage {
    ids: number[]
}
