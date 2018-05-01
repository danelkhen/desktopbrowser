"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_sass_1 = require("node-sass");
const fse = require("fs-extra");
let files = [
    ["client/scss/main.scss", "client/css/main.css"],
    ["client/src/media.component.scss", "client/src/media.component.css"],
];
async function main() {
    for (let file of files) {
        console.log(file[0], file[1]);
        await execSass(file[0], file[1]);
    }
}
exports.main = main;
async function execSass(inFile, outFile) {
    let res = await _execSass(inFile, outFile);
    await fse.writeFile(outFile, res.css);
    return res;
}
exports.execSass = execSass;
function _execSass(inFile, outFile) {
    return new Promise((resolve, reject) => {
        node_sass_1.render({
            file: inFile,
            outputStyle: 'nested',
            outFile: outFile,
            sourceMap: false,
        }, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}
exports._execSass = _execSass;
