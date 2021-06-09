import React, { useState, useEffect } from "react"
import cx from "classnames"
import { MediaComponentHelper } from "./MediaComponentHelper"
import { App } from "../App"
import { MediaApp } from "./MediaApp"

export function Media2Component() {
    const [version, setVersion] = useState(0)
    const [helper, _] = useState(() => {
        const x = new MediaComponentHelper(new MediaApp(App.current))
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
        getAvailableMedia,
        showPosters,
    } = helper

    return (
        <>
            <nav>
                <section className="flex">
                    <button onClick={e => scan()}>scan</button>
                    <button onClick={e => reAnalyze()}>re-analyze</button>
                    <button onClick={e => app.tmdbApp.tmdb.loginToTmdb()}>tmdb login</button>
                    <button onClick={e => tmdbV4Login()}>tmdb v4 login</button>
                    <button onClick={e => tmdbV4Tests()}>tmdb v4 tests</button>
                    <button onClick={e => getAllMediaFiles()}>Refresh</button>
                    <button onClick={e => app.tmdbApp.tmdb.markAllRatedAsWatched()}>Mark all rated as watched</button>
                    <button onClick={e => app.tmdbApp.downloadRatings()}>Download Ratings</button>
                    <button onClick={e => app.tmdbApp.downloadWatchlists()}>downloadWatchlists</button>
                    <button onClick={e => app.tmdbApp.getSavedRatings()}>getSavedRatings</button>
                    <button onClick={e => tvAiringToday()}>airing today</button>
                    <button onClick={e => tvOnTheAir()}>on the air</button>
                </section>

                {app.config && (
                    <section>
                        <h3>Folders</h3>
                        <button onClick={e => addConfigFolder()}>+</button>
                        {app.config.folders?.map(folder => (
                            <div>
                                <input value="folder.path" />
                            </div>
                        ))}
                        <button onClick={e => app.saveConfig()}>save</button>
                    </section>
                )}
                <section>
                    <pre>{JSON.stringify(scanStatus)}</pre>
                </section>

                <section className="flex" onClick={e => onFiltersChanged()}>
                    <button
                        className={cx("allmedia", filter.type == null && "selected")}
                        onClick={e => (filter.type = null)}
                    >
                        All Media
                    </button>
                    <button className={cx("tv", filter.type == "tv" && "selected")} onClick={e => (filter.type = "tv")}>
                        TV Shows
                    </button>
                    <button
                        className={cx("movie", filter.type == "movie" && "selected")}
                        onClick={e => (filter.type = "movie")}
                    >
                        Movies
                    </button>
                    <button className={cx(filter.watched == null && "selected")} onClick={e => (filter.watched = null)}>
                        Both
                    </button>
                    <button className={cx(filter.watched == true && "selected")} onClick={e => (filter.watched = true)}>
                        Watched
                    </button>
                    <button
                        className={cx(filter.watched == false && "selected")}
                        onClick={e => (filter.watched = false)}
                    >
                        Not Watched
                    </button>
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
                </section>

                <section className="flex">
                    <span className="title">Explore</span>
                    <button className="allmedia">Most Popular</button>
                    <button className="tv">Your Feed</button>
                    <button className="movie">Recommended</button>
                </section>
                <section className="search">
                    <input
                        type="text"
                        placeholder="Quick Search"
                        value="filter.search"
                        onInput={e => scheduleApplyFilter()}
                    />
                </section>
            </nav>

            <section className="flex">
                <button onClick={e => prevPage()}>Prev Page</button>
                <button onClick={e => nextPage()}>Next Page</button>
                <label>
                    {skip}-{skip + pageSize} / {filteredMovies?.length} (total: {allMovies?.length})
                </label>
            </section>
            <table className="medias">
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            name
                            <button
                                className={cx(filter.sortBy == "fsEntry.basename desc" && "selected")}
                                onClick={e => {
                                    filter.sortBy = "fsEntry.basename desc"
                                    getAvailableMedia()
                                }}
                            >
                                desc
                            </button>
                            <button
                                className={cx(filter.sortBy == "fsEntry.basename asc" && "selected")}
                                onClick={e => {
                                    filter.sortBy = "fsEntry.basename asc"
                                    getAvailableMedia()
                                }}
                            >
                                asc
                            </button>
                        </th>
                        <th>released</th>
                        <th>vote</th>
                        <th>
                            fsEntry.mtime
                            <button
                                className={cx(filter.sortBy == "fsEntry.mtime desc" && "selected")}
                                onClick={e => {
                                    filter.sortBy = "fsEntry.mtime desc"
                                    getAvailableMedia()
                                }}
                            >
                                desc
                            </button>
                            <button
                                className={cx(filter.sortBy == "fsEntry.mtime asc" && "selected")}
                                onClick={e => {
                                    filter.sortBy = "fsEntry.mtime asc"
                                    getAvailableMedia()
                                }}
                            >
                                asc
                            </button>
                        </th>
                        <th>
                            md.watched
                            <button
                                className={cx(filter.sortBy == "md.episodeKey desc" && "selected")}
                                onClick={e => {
                                    filter.sortBy = "md.episodeKey desc"
                                    getAvailableMedia()
                                }}
                            >
                                desc
                            </button>
                            <button
                                className={cx(filter.sortBy == "md.episodeKey asc" && "selected")}
                                onClick={e => {
                                    filter.sortBy = "md.episodeKey asc"
                                    getAvailableMedia()
                                }}
                            >
                                asc
                            </button>
                        </th>
                        <th>md.episodeKey</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {movies?.map(media => (
                        <tr className={cx("media", showPosters && media.tmdb?.poster?.w342 && "has-poster")}>
                            <td>{showPosters && media.tmdb?.poster?.w342 && <img src={media.tmdb?.poster?.w342} />}</td>
                            <td>{media.fsEntry?.basename}</td>
                            <td>{media.tmdb?.release_date}</td>
                            <td>{media.tmdb?.vote_average}</td>
                            <td>{media.fsEntry?.mtime}</td>
                            <td>{media.md?.watched}</td>
                            <td>{media.md?.episodeKey}</td>
                            <td>
                                <button onClick={e => movie_click(media)}>open</button>
                            </td>
                            <td>
                                <button onClick={e => markAsWatched(media)}>watched</button>
                            </td>
                            <td>
                                <button className={cx(canPlay(media) && "disabled")} onClick={e => play(media)}>
                                    Play
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedMovie && (
                <div>
                    <div
                        className="selectedMovie"
                        style={
                            showPosters
                                ? {
                                      background:
                                          "transparent url(" +
                                          selectedMovie.tmdb?.backdrop?.original +
                                          ") top center no-repeat",
                                      backgroundSize: "cover",
                                  }
                                : {}
                        }
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
                                        <img src="/img/media/rate-icon.svg" />
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
        </>
    )
}
