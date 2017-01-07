import * as fs from "fs"

export function readdir(path: string): Promise<string[]> { return p(cb => fs.readdir(path, cb)); }
export function stat(path: string): Promise<fs.Stats> { return p(cb => fs.stat(path, cb)); }
export type Stats = fs.Stats;

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

type NodeCallback<T> = (err: NodeJS.ErrnoException, res: T) => any
