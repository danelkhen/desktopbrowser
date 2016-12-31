export class Proxy<T> {
    constructor() {
        this.onInvoke = pc => Promise.resolve(null);
    }

    invoke<R>(action: (obj: T) => R | Promise<R>): Promise<R> {
        let pc = extractInstanceFunctionCall(action);
        return this.onInvoke(pc);
    }

    onInvoke: (pc: ProxyCall<T>) => Promise<any>;
}

export interface ProxyCall<T> {
    name: keyof T;
    args: any[];
}

export function extractInstanceFunctionCall(func: Function): ProxyCall<any> {
    let code = func.toString();
    let index = code.indexOf(".");
    let index2 = code.indexOf("(", index);
    let res: ProxyCall<any> = {
        name: code.substring(index + 1, index2),
        args: null,
    };
    let fake: any = {};
    fake[res.name] = function () {
        res.args = Array.from(arguments);
    };
    func(fake);
    if (res.args == null)
        res.args = [];
    return res;
}

//type Proxy2<T> = {
//[P in keyof T]: <X>(req: X) => Promise<T[P]>;
//}
//type Func1<T1, R> = (req: T1) => R;
//type PromisedFunc1<T1, R> = Func1<T1, Promise<R>>;

//interface XXX<T1, R> {
//    (req: T1): Promise<R>;
//}
//type Proxied = {
//    [key: string]: PromisedFunc1<T, R>
//}

//export function proxify<T>(obj: T, invoke: (pc: ProxyCall<T>) => Promise<any>): Proxy2<T> {
//    let obj2: Proxy2<T> = {} as any;
//    Object.keys(obj).forEach((key: keyof T) => {
//        obj2[key] = function () {
//            let pc: ProxyCall<T> = { name: key, args: Array.from(arguments) };
//            return invoke(pc);
//        };
//    });
//    return obj2;
//}


//export interface TmdbApi {
//    getApiConfiguration: Func1<number, string>;
//    getApiConfiguration2: Func1<string, number>;
//}

//type Proxy2<T> = {
//[P in keyof T]: PromisedFunc1<T[P]>;
//}
//let x: Proxy2<TmdbApi>

