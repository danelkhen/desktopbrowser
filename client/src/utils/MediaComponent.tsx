import React, { useState, useEffect } from "react"
import cx from "classnames"
import { MediaComponentHelper } from "./MediaComponentHelper"
import { App } from "../App"

export function MediaComponent() {
    const [version, setVersion] = useState(0)
    const [helper, _] = useState(() => {
        const x = new MediaComponentHelper(App.current)
        ;(async () => {
            await x.ngOnInit()
        })()
        return x
    })
    useEffect(() => {
        helper.onChanged = () => {
            console.log("forceUpdate")
            console.log({ version })
            setVersion(version + 1)
        }
    }, [version, setVersion, helper])
    let {
        selectedMovie,
        movies,
        getName,
        goBack,
        filter,
        onFiltersChanged,
        scheduleApplyFilter,
        movie_click,
        markAsWatched,
        app,
        addConfigFolder,
        scan,
        reAnalyze,
        pageSize,
        filteredMovies,
        allMovies,
        prevPage,
        nextPage,
        tmdbV4Login,
        tmdbV4Tests,
        getAllMediaFiles,
        skip,
        tvAiringToday,
        tvOnTheAir,
        scanStatus,
        canPlay,
        play,
    } = helper

    return (
        <>
            {selectedMovie != null && (
                <div>
                    <div
                        className="selectedMovie"
                        style={{
                            background:
                                "transparent url(" + selectedMovie.tmdb?.backdrop?.original + ") top center no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        <div className="background-cover">
                            <button className="backBtn" onClick={e => goBack()}>
                                Back
                            </button>
                            <div className="cover">
                                <img src="{selectedMovie.tmdb?.poster?.w342}" />
                            </div>
                            <div className="detailsLarge">
                                <h3 className="title">{getName(selectedMovie)}</h3>
                                <div className="tag">{selectedMovie.tmdb?.tagline}</div>
                                <div className="metadata">
                                    <span className="rate">
                                        <object type="image/svg+xml" data="../img/media/rate-icon.svg"></object>
                                        {selectedMovie.tmdb?.vote_average}
                                    </span>
                                    <span>{selectedMovie.tmdb?.release_date}</span>
                                    <span>{selectedMovie.tmdb?.runtime} minutes</span>
                                    <span>{selectedMovie.tmdb?.genres?.[0]?.name}</span>
                                </div>
                                <p className="synopsis">{selectedMovie.tmdb?.overview}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {selectedMovie != null && (
                <div className="media">
                    <div className="leftpane">
                        <header className="header">
                            <a className="logo">
                                <img src="../img/media/logo.svg" />
                            </a>
                        </header>
                        <div className="filter local" onClick={e => onFiltersChanged()}>
                            <span className="title">Watchlist</span>
                            <button
                                className={cx("allmedia", filter.type == null && "selected")}
                                onClick={e => (filter.type = null)}
                            >
                                All Media
                            </button>
                            <button
                                className={cx("tv", filter.type == "tv" && "selected")}
                                onClick={e => (filter.type = "tv")}
                            >
                                TV Shows
                            </button>
                            <button
                                className={cx("movie", filter.type == "movie" && "selected")}
                                onClick={e => (filter.type = "movie")}
                            >
                                Movies
                            </button>
                            <hr />
                            <button
                                className={cx(filter.watched == null && "selected")}
                                onClick={e => (filter.watched = null)}
                            >
                                Both
                            </button>
                            <button
                                className={cx(filter.watched == true && "selected")}
                                onClick={e => (filter.watched = true)}
                            >
                                Watched
                            </button>
                            <button
                                className={cx(filter.watched == false && "selected")}
                                onClick={e => (filter.watched = false)}
                            >
                                Not Watched
                            </button>
                            <hr />
                            <button
                                className={cx(filter.groupSimilar == true && "selected")}
                                onClick={e => (filter.groupSimilar = true)}
                            >
                                Group
                            </button>
                            <button
                                className={cx(filter.groupSimilar == false && "selected")}
                                onClick={e => (filter.groupSimilar = false)}
                            >
                                Ungroup
                            </button>
                            <hr />
                            <button
                                className={cx(filter.sortBy == "fsEntry.mtime desc" && "selected")}
                                onClick={e => (filter.sortBy = "fsEntry.mtime desc")}
                            >
                                Sort1
                            </button>
                            <button
                                className={cx(filter.sortBy == "fsEntry.mtime asc" && "selected")}
                                onClick={e => (filter.sortBy = "fsEntry.mtime asc")}
                            >
                                Sort2
                            </button>
                            <button
                                className={cx(filter.sortBy == "md.episodeKey desc" && "selected")}
                                onClick={e => (filter.sortBy = "md.episodeKey desc")}
                            >
                                Sort3
                            </button>
                            <button
                                className={cx(filter.sortBy == "md.episodeKey asc" && "selected")}
                                onClick={e => (filter.sortBy = "md.episodeKey asc")}
                            >
                                Sort4
                            </button>
                        </div>
                        <div className="filter explore">
                            <span className="title">Explore</span>
                            <button className="allmedia">Most Popular</button>
                            <button className="tv">Your Feed</button>
                            <button className="movie">Recommended</button>
                        </div>
                    </div>
                    <div className="rightpane">
                        <div className="gridtop">
                            <div className="search">
                                <input
                                    type="text"
                                    placeholder="Quick Search"
                                    value="filter.search"
                                    onInput={e => scheduleApplyFilter()}
                                />
                            </div>
                        </div>
                        <ul className="pool">
                            {movies?.map(movie => (
                                <li className={cx("media", movie.tmdb?.poster?.w342 && "selected")}>
                                    <div className="poster">
                                        {movie.tmdb?.poster?.w342 && <img src={movie.tmdb?.poster?.w342} />}
                                    </div>
                                    <div className="details">
                                        <h5 className="title">{getName(movie)}</h5>
                                        <span className="playtime">{movie.tmdb?.release_date}</span>
                                        <div className="rating">{movie.tmdb?.vote_average}</div>
                                        <a className="icon playicon" onClick={e => movie_click(movie)}>
                                            <img src="../img/media/play-icon.svg" />
                                        </a>
                                        <button className="status">View</button>
                                        <button className="status" onClick={e => markAsWatched(movie)}>
                                            mark as watched
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <div style={{ color: "white" }}>
                {app.config && (
                    <div>
                        <h3>Folders</h3>
                        {app.config.folders?.map(folder => (
                            <div>
                                <input value={folder.path} />
                            </div>
                        ))}
                        <button onClick={e => addConfigFolder()}>+</button>
                        <button onClick={e => app.saveConfig()}>save</button>
                        <button onClick={e => scan()}>scan</button>
                        <button onClick={e => reAnalyze()}>re-analyze</button>
                        <label>
                            {skip}-{skip + pageSize} / {filteredMovies?.length} (total: {allMovies?.length})
                        </label>
                        <button onClick={e => prevPage()}>Prev Page</button>
                        <button onClick={e => nextPage()}>Next Page</button>
                        <button onClick={e => app.tmdbApp.tmdb.loginToTmdb()}>tmdb login</button>
                        <button onClick={e => tmdbV4Login()}>tmdb v4 login</button>
                        <button onClick={e => tmdbV4Tests()}>tmdb v4 tests</button>
                        <button onClick={e => getAllMediaFiles()}>Refresh</button>
                        <button onClick={e => app.tmdbApp.tmdb.markAllRatedAsWatched()}>
                            Mark all rated as watched
                        </button>
                        <button onClick={e => app.tmdbApp.downloadRatings()}>Download Ratings</button>
                        <button onClick={e => app.tmdbApp.downloadWatchlists()}>downloadWatchlists</button>
                        <button onClick={e => app.tmdbApp.getSavedRatings()}>getSavedRatings</button>
                        <button onClick={e => tvAiringToday()}>airing today</button>
                        <button onClick={e => tvOnTheAir()}>on the air</button>
                    </div>
                )}
                <div>
                    <pre>{JSON.stringify(scanStatus)}</pre>
                </div>
                <div>
                    {movies?.map(media => (
                        <div>
                            <span>{getName(media)}</span> - <span>{media.fsEntry?.mtime}</span>
                            <button onClick={e => markAsWatched(media)}>mark as watched</button>
                            <label>watched={media.md?.watched}</label>
                            <button className={cx(canPlay(media) && "disabled")} onClick={e => play(media)}>
                                Play
                            </button>
                        </div>
                    ))}
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        </>
    )
}
