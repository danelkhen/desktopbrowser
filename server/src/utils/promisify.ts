export function promisify<T>(action: (cb: NodeCallback<T>) => void): Promise<T> {
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

export function promisifySimple<T>(action: (cb: NodeSimpleCallback<T>) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => action(resolve));
}

export type NodeCallback<T> = (err: NodeJS.ErrnoException, res: T) => any;
export type NodeSimpleCallback<T> = (res: T) => any;
