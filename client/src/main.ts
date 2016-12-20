import "./utils/global";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
//import {TmdbApiClient} from "../../tmdb/src/index";

//console.log({TmdbApiClient});
const platform = platformBrowserDynamic();

platform.bootstrapModule(AppModule);

//fixArray();
//$(main);

//function main() {
//    clearTextNodes();
//}




//function clearTextNodes(el?: Element) {
//    if (el == null)
//        el = document.body;
//    $(el).find("*+*").toArray().forEach(el2 => {
//        var prev = el2.previousSibling;
//        while (prev != null && prev.nodeType == 3) {
//            var tmp = prev;
//            prev = prev.previousSibling;
//            (tmp as Element).remove();
//        }
//    });
//}

//function fixArray() {
//    let ce = Array.prototype;
//    Object.keys(ce).forEach(key => {
//        Object.defineProperty(ce, key, { enumerable: false });
//    });
//}
