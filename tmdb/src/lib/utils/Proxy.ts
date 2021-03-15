type Method<T> = Extract<T, (...args: any[]) => any>
type Promisify<T> = T extends Promise<any> ? T : Promise<T>
export type Invoker2<T> = <K extends keyof T & string>(
    method: K,
    prms?: Parameters<Method<T[K]>>
) => Promisify<ReturnType<Method<T[K]>>>

export type Invocation<T, K extends keyof T & string> = {
    method: K
    prms?: Parameters<Method<T[K]>>
}

export type Invoker<T> = <K extends keyof T & string>(
    invocation: Invocation<T, K>
) => Promisify<ReturnType<Method<T[K]>>>

export class Proxy<T> {
    constructor(public onInvoke: (pc: ProxyCall<T>) => Promise<any> = pc => Promise.resolve(null)) {}

    invoke<R>(action: (obj: T) => R | Promise<R>): Promise<R> {
        let pc = extractInstanceFunctionCall(action)
        return this.onInvoke(pc)
    }
}

export interface ProxyCall<T> {
    name: keyof T & string
    args: any[] | null
    target?: string[]
}

export function extractInstanceFunctionCall(func: Function): ProxyCall<any> {
    let code = func.toString()
    let index = code.indexOf(".")
    let index2 = code.indexOf("(", index)
    let res: ProxyCall<any> = {
        name: code.substring(index + 1, index2),
        args: null,
    }
    let fake: any = {}
    fake[res.name] = function() {
        res.args = Array.from(arguments)
    }
    func(fake)
    if (res.args == null) res.args = []
    return res
}

export function extractInstanceFunctionCall2(
    func: Function
): { target: string[]; funcName: string | null; args: any[] | null } | null {
    let code = func.toString()
    code = code.replace(/^\s*([a-zA-Z0-9_]+)\s*\=\>\s*\1\s*\.\s*/, "")
    let parsed = parseFunctionCall(code)
    if (!parsed || !parsed.funcName) return null
    // let index = code.indexOf(".")
    // let index2 = code.indexOf("(", index)
    let res: { target: string[]; funcName: string | null; args: any[] | null } = {
        funcName: parsed.funcName,
        target: parsed.target,
        args: null,
    }
    let fake: any = {}
    let lastTarget = fake
    for (let target of parsed.target) {
        lastTarget = {}
        fake[target] = lastTarget
    }
    lastTarget[parsed.funcName] = function() {
        res.args = Array.from(arguments)
    }
    func(fake)
    if (res.args == null) res.args = []
    return res
}

export function parseFunctionCall(code: string): { target: string[]; funcName: string | null; args: string } | null {
    let match = /^.*return\s*(.*)\;.*$/.exec(code)
    if (match) code = match[1]
    match = /^([a-zA-Z0-9_\.]+)\((.*)\)$/.exec(code)
    console.log("extractFunctionCall", code)
    if (!match) return null
    console.log("extractFunctionCall", match[0], match[1], match[2])
    let target = match[1].split(".") //.slice(1);
    let args = match[2]
    let funcName = target.pop() ?? null
    let res = { target, funcName, args }
    return res
}
