export interface ProxyCall<T> {
    name: keyof T
    args: any[] | null
}

export function extractInstanceFunctionCall(func: Function): ProxyCall<any> {
    const code = func.toString()
    const index = code.indexOf(".")
    const index2 = code.indexOf("(", index)
    const res: ProxyCall<any> = {
        name: code.substring(index + 1, index2),
        args: null,
    }
    const fake: any = {}
    fake[res.name] = function () {
        res.args = Array.from(arguments)
    }
    func(fake)
    if (res.args == null) res.args = []
    return res
}

export function extractFunctionCall(code: string): { target: string[]; funcName: string; args: any[] } {
    const parsed = parseFunctionCall(code)
    const target = parsed.target
    const args = JSON.parse("[" + parsed.args + "]")
    const funcName = parsed.funcName
    const res = { target, funcName, args }
    return res
}

export function parseFunctionCall(code: string): { target: string[]; funcName: string; args: string } {
    const match = /^([a-zA-Z0-9_\.]+)\((.*)\)$/.exec(code)
    console.log("extractFunctionCall", code)
    if (!match) return null!
    if (match) console.log("extractFunctionCall", match[0], match[1], match[2])
    const target = match[1].split(".")
    const args = match[2]
    const funcName = target.pop()
    const res = { target: target!, funcName: funcName!, args }
    return res
}
