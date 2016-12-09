export class Proxy<T> {

    invoke<R>(action: (obj: T) => R | Promise<R>): Promise<R> {
        let pc = extractInstanceFunctionCall(action);
        return this.onInvoke<R>(pc);
    }

    onInvoke<R>(pc: ProxyCall): Promise<R> {
        return Promise.resolve(null);
    }
}

export interface ProxyCall {
    name: string;
    args: any[];
}

export function extractInstanceFunctionCall(func: Function): ProxyCall {
    let code = func.toString();
    let index = code.indexOf(".");
    let index2 = code.indexOf("(", index);
    let res: ProxyCall = {
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
