"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_service2_1 = require("../file-service2");
async function main() {
    let x = new file_service2_1.FileService2();
    let res = x.GetFiles({ Path: "C:\\" });
    let list = [];
    try {
        for (var res_1 = __asyncValues(res), res_1_1; res_1_1 = await res_1.next(), !res_1_1.done;) {
            let item = await res_1_1.value;
            list.push(item);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (res_1_1 && !res_1_1.done && (_a = res_1.return)) await _a.call(res_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    console.log(list);
    var e_1, _a;
}
main();
