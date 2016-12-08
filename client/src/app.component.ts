import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, } from '@angular/core';
import { Movie, MovieRequest } from 'imdb-api';
import { SiteRequest, ListFilesRequest, ListFilesResponse, PathRequest, FileRelativesInfo, File } from "./model"
import { Selection, SelectionChangedEventArgs } from "./selection"
import parseTorrentName = require('parse-torrent-name');
import * as imdb from "../typings2/imdb-rss"
import { ArrayView } from "./array-view";

@Component({
    selector: 'my-app',
    templateUrl: '/src/app.component.html',
})
export class AppComponent {
}
