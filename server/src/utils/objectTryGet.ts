export function objectTryGet(obj: any, indexers: string[] | string): any {
    if (typeof indexers == "string") indexers = indexers.split(".")
    var value = obj
    for (var i = 0; i < indexers.length; i++) {
        if (value == null) return null
        value = value[indexers[i]]
    }
    return value
}
