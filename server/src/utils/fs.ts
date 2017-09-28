import * as fs from "fs"
import { promisify, promisifySimple } from "./promisify";

export function readdir(path: string): Promise<string[]> { return promisify(cb => fs.readdir(path, cb)); }
export function exists(path: string): Promise<boolean> { return promisifySimple(cb => fs.exists(path, cb)); }
export function stat(path: string): Promise<fs.Stats> { return promisify(cb => fs.stat(path, cb)); }
export function readFile(filename: string, encoding: string): Promise<string> { return promisify(cb => fs.readFile(filename, encoding, cb)); }
export function writeFile(filename: string, data: any): Promise<any> { 
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => err ? reject(err) : resolve())
    });
    //return promisify(cb => fs.writeFile(filename, data, cb)); 
}

export type Stats = fs.Stats;

