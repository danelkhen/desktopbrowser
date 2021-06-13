/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectTryGet(obj: any, indexers: string[] | string): any {
    if (typeof indexers == "string") indexers = indexers.split(".")
    let value = obj
    for (let i = 0; i < indexers.length; i++) {
        if (value == null) return null
        value = value[indexers[i]]
    }
    return value
}
