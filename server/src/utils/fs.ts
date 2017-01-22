import * as fs from "fs"

export function readdir(path: string): Promise<string[]> { return p(cb => fs.readdir(path, cb)); }
export function exists(path: string): Promise<boolean> { return p2(cb => fs.exists(path, cb)); }
export function stat(path: string): Promise<fs.Stats> { return p(cb => fs.stat(path, cb)); }
export function readFile(filename: string, encoding: string): Promise<string> { return p(cb => fs.readFile(filename, encoding, cb)); }
export function writeFile(filename: string, data: any): Promise<any> { return p(cb => fs.writeFile(filename, data, cb)); }

export type Stats = fs.Stats;
export type NodeCallback< T > = (err: NodeJS.ErrnoException, res: T) => any;
export type NodeSimpleCallback< T > = (res: T) => any;

function p<T>(action: (cb: NodeCallback<T>) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let cb: NodeCallback<T> = (err, res) => {
            if (err != null)
                reject(err);
            else
                resolve(res);
        };
        action(cb);
    });
}
function p2<T>(action: (cb: NodeSimpleCallback<T>) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => action(resolve));
}

