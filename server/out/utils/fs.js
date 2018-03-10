"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const promisify_1 = require("./promisify");
function readdir(path) { return promisify_1.promisify(cb => fs.readdir(path, cb)); }
exports.readdir = readdir;
function exists(path) { return promisify_1.promisifySimple(cb => fs.exists(path, cb)); }
exports.exists = exists;
function stat(path) { return promisify_1.promisify(cb => fs.stat(path, cb)); }
exports.stat = stat;
function readFile(filename, encoding) { return promisify_1.promisify(cb => fs.readFile(filename, encoding, cb)); }
exports.readFile = readFile;
function writeFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => err ? reject(err) : resolve());
    });
    //return promisify(cb => fs.writeFile(filename, data, cb)); 
}
exports.writeFile = writeFile;
