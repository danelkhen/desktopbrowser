import React from "react"
import { TmdbApiV3 } from "../../../tmdb/src"
type TmdbMovie = TmdbApiV3.TmdbMovie

function Movie(movie: TmdbMovie) {
    return (
        <div className="tmdb">
            <div className="title">{movie.title}</div>
            <img className="poster_url" src="{movie.poster_url}" />
            <img className="backdrop_url" src="{movie.backdrop_url}" />

            <div className="overview">{movie.overview}</div>

            <div className="adult">{movie.adult}</div>
            <div className="release_date">{movie.release_date}</div>
            <div className="genre_ids">{movie.genre_ids}</div>
            <div className="id">{movie.id}</div>
            <div className="original_title">{movie.original_title}</div>
            <div className="original_language">{movie.original_language}</div>
            <div className="popularity">{movie.popularity}</div>
            <div className="vote_count">{movie.vote_count}</div>
            <div className="video">{movie.video}</div>
            <div className="vote_average">{movie.vote_average}</div>
        </div>
    )
}
