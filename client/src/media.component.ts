import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie } from "./tmdb/tmdb-api"

@Component({
    selector: 'my-media',
    templateUrl: '/src/media.component.html',
    styleUrls: ['_res_/src/media.component.css'],
})
export class MediaComponent implements OnInit, OnChanges {
    movies: TmdbMovie[];
    ngOnInit(): void {
        this.test();
    }
    ngOnChanges(changes: SimpleChanges): void { }

    tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w600_and_h900_bestv2";

    test() {
        let x = new TmdbClient();
        x.init().then(() => x.invoke(t => t.movieGetPopular({ language: "en" })).then(e => {
            this.movies = e.results;
            console.log(this.movies);
        }));
    }


    getImageUrl(movie: TmdbMovie, prop: keyof TmdbMovie, size?: string): string {
        let c = tmdbConfig.images;
        if (size == null) {
            if (prop == "backdrop_path") {
                size = c.backdrop_sizes[0];
            }
            else if (prop == "poster_path") {
                size = c.poster_sizes[0];
            }
            else {
                console.warn("getImageUrl2 not implemented for prop", prop);
                return null;
            }
        }
        return `${c.base_url}${size}/${movie[prop]}`;
    }

}

export interface TmdbMovie {
    title: string;
    backdrop_path: string;
    poster_path: string;
}

let tmdbConfig: TmdbConfig = {
    "images": {
        "base_url": "http://image.tmdb.org/t/p/",
        "secure_base_url": "https://image.tmdb.org/t/p/",
        "backdrop_sizes": [
            "w300",
            "w780",
            "w1280",
            "original"
        ],
        "logo_sizes": [
            "w45",
            "w92",
            "w154",
            "w185",
            "w300",
            "w500",
            "original"
        ],
        "poster_sizes": [
            "w92",
            "w154",
            "w185",
            "w342",
            "w500",
            "w780",
            "original"
        ],
        "profile_sizes": [
            "w45",
            "w185",
            "h632",
            "original"
        ],
        "still_sizes": [
            "w92",
            "w185",
            "w300",
            "original"
        ]
    },
    "change_keys": [
        "adult",
        "air_date",
        "also_known_as",
        "alternative_titles",
        "biography",
        "birthday",
        "budget",
        "cast",
        "certifications",
        "character_names",
        "created_by",
        "crew",
        "deathday",
        "episode",
        "episode_number",
        "episode_run_time",
        "freebase_id",
        "freebase_mid",
        "general",
        "genres",
        "guest_stars",
        "homepage",
        "images",
        "imdb_id",
        "languages",
        "name",
        "network",
        "origin_country",
        "original_name",
        "original_title",
        "overview",
        "parts",
        "place_of_birth",
        "plot_keywords",
        "production_code",
        "production_companies",
        "production_countries",
        "releases",
        "revenue",
        "runtime",
        "season",
        "season_number",
        "season_regular",
        "spoken_languages",
        "status",
        "tagline",
        "title",
        "translations",
        "tvdb_id",
        "tvrage_id",
        "type",
        "video",
        "videos"
    ]
}



export interface ImdbConfig_Images {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
}

export interface TmdbConfig {
    images: ImdbConfig_Images;
    change_keys: string[];
}


    //getPosterUrl(movie: TmdbMovie): string { return this.getImageUrl(movie.poster_path, tmdbConfig.images.poster_sizes[0]); }
    //getBackdropUrl(movie: TmdbMovie): string { return this.getImageUrl(movie.backdrop_path, tmdbConfig.images.backdrop_sizes[0]); }
    //getImageUrl(path: string, size: string): string {
    //    let c = tmdbConfig.images;
    //    return `${c.base_url}${size}/${path}`;
    //}
