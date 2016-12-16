import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserComponent } from './browser.component';
import { MediaComponent } from './media.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: BrowserComponent,  },
  { path: 'media', component: MediaComponent }
];

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)],
    declarations: [AppComponent, BrowserComponent, MediaComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
