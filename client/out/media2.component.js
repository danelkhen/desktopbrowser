"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var core_1 = require("@angular/core");
var app_1 = require("./app");
var media_component_1 = require("./media.component");
var Media2Component = (function (_super) {
    __extends(Media2Component, _super);
    function Media2Component(app) {
        var _this = _super.call(this, app) || this;
        _this.app = app;
        _this.showPosters = false;
        return _this;
    }
    Media2Component = __decorate([
        core_1.Component({
            selector: 'my-media2',
            templateUrl: '/src/media2.component.html',
            styleUrls: ['src/media2.component.css'],
        }),
        __metadata("design:paramtypes", [app_1.App])
    ], Media2Component);
    return Media2Component;
}(media_component_1.MediaComponent));
exports.Media2Component = Media2Component;
//# sourceMappingURL=media2.component.js.map