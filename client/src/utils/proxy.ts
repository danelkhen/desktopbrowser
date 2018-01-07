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
    target?: string[];
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




export function extractInstanceFunctionCall2(func: Function): { target: string[], funcName: string, args: any[] } {
    let code = func.toString();
    code = code.replace(/^\s*([a-zA-Z0-9_]+)\s*\=\>\s*\1\s*\.\s*/, "");
    let parsed = parseFunctionCall(code);
    let index = code.indexOf(".");
    let index2 = code.indexOf("(", index);
    let res: { target: string[], funcName: string, args: any[] } = {
        funcName: parsed.funcName,
        target: parsed.target,
        args: null,
    };
    let fake: any = {};
    let lastTarget = fake;
    for (let target of parsed.target) {
        lastTarget = {};
        fake[target] = lastTarget;
    }
    lastTarget[parsed.funcName] = function () {
        res.args = Array.from(arguments);
    };
    func(fake);
    if (res.args == null)
        res.args = [];
    return res;
}


export function parseFunctionCall(code: string): { target: string[], funcName: string, args: string } {
    let match = /^([a-zA-Z0-9_\.]+)\((.*)\)$/.exec(code);
    console.log("extractFunctionCall", code);
    if (match != null)
        console.log("extractFunctionCall", match[0], match[1], match[2]);
    let target = match[1].split(".");
    let args = match[2];
    let funcName = target.pop();
    let res = { target, funcName, args };
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

