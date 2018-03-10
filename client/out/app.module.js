"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const platform_browser_1 = require("@angular/platform-browser");
const app_component_1 = require("./app.component");
const browser_component_1 = require("./browser.component");
const media_component_1 = require("./media.component");
const media2_component_1 = require("./media2.component");
const router_1 = require("@angular/router");
const tmdb_client_1 = require("./tmdb-client");
const service_1 = require("./service");
const app_1 = require("./app");
const appRoutes = [
    { path: '', component: browser_component_1.BrowserComponent, },
    { path: 'media', component: media_component_1.MediaComponent },
    { path: 'media2', component: media2_component_1.Media2Component },
];
let AppModule = class AppModule {
    constructor(app) {
        this.app = app;
        console.log("AppModule ctor");
    }
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, router_1.RouterModule.forRoot(appRoutes)],
        declarations: [app_component_1.AppComponent, browser_component_1.BrowserComponent, media_component_1.MediaComponent, media2_component_1.Media2Component],
        providers: [app_1.App, service_1.FileService, service_1.ByFilenameService, service_1.KeyValueService, tmdb_client_1.TmdbClient],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [app_1.App])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map