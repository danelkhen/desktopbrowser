import "./global";
import { DefaultPage2 } from "./page"

fixArray();
clearTextNodes();

window["_page"] = new DefaultPage2();

function clearTextNodes(el?: Element) {
    if (el == null)
        el = document.body;
    $(el).find("*+*").toArray().forEach(el2 => {
        var prev = el2.previousSibling;
        while (prev != null && prev.nodeType == 3) {
            var tmp = prev;
            prev = prev.previousSibling;
            (tmp as Element).remove();
        }
    });
}

function fixArray() {
    let ce = Array.prototype;
    Object.keys(ce).forEach(key => {
        Object.defineProperty(ce, key, { enumerable: false });
    });
}
