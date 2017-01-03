import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserComponent } from './browser.component';
import { MediaComponent } from './media.component';
import { RouterModule, Routes } from '@angular/router';
import { TmdbClient } from "./tmdb-client"
import { FileService, ByFilenameService, KeyValueService } from "./service"
import { App } from "./app"

const appRoutes: Routes = [
    { path: '', component: BrowserComponent, },
    { path: 'media', component: MediaComponent }
];

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)],
    declarations: [AppComponent, BrowserComponent, MediaComponent],
    providers: [App, FileService, ByFilenameService, KeyValueService, TmdbClient],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private app: App) {
        console.log("AppModule ctor");
    }
}
