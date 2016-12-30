import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgSwitch, NgSwitchCase, } from '@angular/common';
import { App } from "./app"

@Component({
    selector: 'my-app',
    templateUrl: '/src/app.component.html',
    //    directives: [NgSwitch, NgSwitchCase,]
})
export class AppComponent implements OnInit {
    constructor(private app: App) {
        console.log("AppComponent ctor");
    }
    ngOnInit() {
        this.app.init().then(e => console.log("app inited"));
    }
}
