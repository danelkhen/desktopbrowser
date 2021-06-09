export interface ProxyCall<T> {
    name: keyof T
    args: any[] | null
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
    fake[res.name] = function () {
        res.args = Array.from(arguments)
    }
    func(fake)
    if (res.args == null) res.args = []
    return res
}

export function extractFunctionCall(code: string): { target: string[]; funcName: string; args: any[] } {
    let parsed = parseFunctionCall(code)
    let target = parsed.target
    let args = JSON.parse("[" + parsed.args + "]")
    let funcName = parsed.funcName
    let res = { target, funcName, args }
    return res
}

export function parseFunctionCall(code: string): { target: string[]; funcName: string; args: string } {
    let match = /^([a-zA-Z0-9_\.]+)\((.*)\)$/.exec(code)
    console.log("extractFunctionCall", code)
    if (!match) return null!
    if (match) console.log("extractFunctionCall", match[0], match[1], match[2])
    let target = match[1].split(".")
    let args = match[2]
    let funcName = target.pop()
    let res = { target: target!, funcName: funcName!, args }
    return res
}
