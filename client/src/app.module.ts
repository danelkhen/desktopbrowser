import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserComponent } from './browser.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  //{ path: '', component: HomeComponent },
  { path: '**', component: BrowserComponent }
];

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)],
    declarations: [AppComponent, BrowserComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
