import React from "react"

export function Imdb() {
    const imdb: any = null
    const yourRating: any = null
    return (
        imdb && (
            <div className="imdb">
                <div className="imdburl poster">
                    <a target="_blank" href="{imdb.imdburl}">
                        <img src="{imdb.poster}" />
                    </a>
                </div>
                <h1>
                    <label className="title">{imdb.title}</label>
                </h1>
                <h4>
                    <label className="year">{imdb.year}</label>
                    <label className="rating">{imdb.rating}</label>
                    <span>Yours: </span>
                    <label className="yourRating">{yourRating}</label>
                    <label className="genres">{imdb.genres}</label>
                    <label className="rated">{imdb.rated}</label>
                </h4>
                <h5>
                    <label className="released">{imdb.released?.substr(0, 10)}</label>
                    <label className="runtime">{imdb.runtime}</label>
                    <label className="languages">{imdb.languages}</label>
                    <label className="country">{imdb.country}</label>
                    <label className="director">{imdb.director}</label>
                    <label className="writer">{imdb.writer}</label>
                    <label className="awards">{imdb.awards}</label>
                    <label className="metascore">{imdb.metascore}</label>
                    <label className="votes">{imdb.votes}</label>
                    <label className="type">{imdb.type}</label>
                    <label className="series">{imdb.series != null ? "series" : "movie"}</label>
                </h5>
                <p className="actors">{imdb.actors}</p>
                <p className="plot">{imdb.plot}</p>
            </div>
        )
    )
}
