"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promisify(action) {
    return new Promise((resolve, reject) => {
        let cb = (err, res) => {
            if (err != null)
                reject(err);
            else
                resolve(res);
        };
        action(cb);
    });
}
exports.promisify = promisify;
function promisifySimple(action) {
    return new Promise((resolve, reject) => action(resolve));
}
exports.promisifySimple = promisifySimple;
