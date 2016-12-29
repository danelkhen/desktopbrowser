export class Name {
   static of<T>(): NameFunc<T> {
        return nameof;
    }
}
export interface NameFunc<T> {
    (prop: SelectorFunc<T, any>): string
}

export function nameof<T>(prop: SelectorFunc<T, any>): string {
    let prop2: any = prop;
    let code: string;
    if (prop2.isDelegate)
        code = prop2.func.toString();
    else
        code = prop.toString();
    return code.substringBetween(".", ";");
}

export function promiseEach<T>(list: T[], handler: (obj: T, index: number) => Promise<any> | any): Promise<any> {
    return promiseMap<T, any>(list, handler);
}

export function promiseMap<T, R>(list: T[], handler: (obj: T, index: number) => Promise<R> | R): Promise<R[]> {
    let res: R[] = [];
    let promise = Promise.resolve();
    list.forEach((obj, i) => promise = promise.then(() => handler(obj, i)).then(e => { res.push(e); }));
    return promise.then(() => res);
}