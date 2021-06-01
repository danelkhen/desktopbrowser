import * as C from "../../../../shared/src/contracts"
import { useMemo, useState } from "react"
import { App } from "../../App"
import { FilenameParser } from "../../utils/FilenameParser"
import { TmdbApiV3 } from "../../../../tmdb/src"

type TmdbMovie = TmdbApiV3.TmdbMovie

export function useTmdb() {
    const [movie, setMovie] = useState<TmdbMovie>()
    return useMemo(() => {
        async function getTmdbInfo(file: C.File) {
            const app = App.current
            const info = new FilenameParser().parse(file.Name)
            if (!info) return
            // const isTv = info.season != null
            const e = await app.tmdbApp.tmdb.searchMovies({ query: info.name, year: info.year })
            const movie = e.results?.[0]
            setMovie(movie)
            console.log(movie)
            if (movie != null) {
                const e3 = await app.tmdbApp.tmdb.movieGetDetails({ movie_id: movie.id })
                console.log({ movie: movie, details: e3 })
            }

            const e2 = await app.tmdbApp.tmdb.searchTvShows({ query: info.name })
            console.log(e2)
            const show = e2.results?.[0]
            if (show != null) {
                const e3 = await app.tmdbApp.tmdb.tvGetDetails({ tv_id: show.id })
                console.log({ show: show, details: e3 })
            }

            const e3 = await app.tmdbApp.tmdb.searchMulti({ query: info.name })
            console.log("multisearch", e3)
        }
        return { movie, getTmdbInfo }
    }, [movie])
}
