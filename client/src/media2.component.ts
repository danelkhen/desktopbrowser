import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TmdbClient } from "./tmdb-client"
import { TmdbMovie, TmdbMedia, TmdbMovieDetails, TmdbTvShowDetails } from "tmdb-v3"
import { FileService, } from "./service"
import { promiseEach, promiseMap, promiseSetTimeout, ReusePromiseIfStillRunning } from "./utils/utils"
import { App } from "./app"
import { File, Config, } from "contracts"
import * as C from "contracts"
import { MediaComponent } from "./media.component"



@Component({
    selector: 'my-media2',
    templateUrl: '/src/media2.component.html',
})
export class Media2Component extends MediaComponent {
    constructor(public app: App) {
        super(app);
    }

    showPosters = false;


}


