import { File, IEnumerable } from "../../../shared/src/contracts"
import { Stopwatch } from "../GetFileAndFoldersRequest"
import { IoFile } from "./IoFile"

let cache = {} as { [key: string]: Promise<any> }

export async function calculateFoldersSize(folders: File[]): Promise<IEnumerable<File>> {
    let list: File[] = []
    for (let file of folders) {
        try {
            //console.log("CalculateFoldersSize", file);
            if (file.IsFolder) file.Size = await CalculateFolderSize(file.Path!)
        } catch (e) {}
        list.push(file)
    }
    return list
}
export function CalculateFolderSize(path: string): Promise<number> {
    return CacheMethod(`CalculateFolderSize(${path})`, 100, 100, () => CalculateFolderSizeNoCache(path))
}

export async function CalculateFolderSizeNoCache(path: string): Promise<number> {
    var size = 0
    try {
        var list = await IoFile.getChildren(path)
        for (let item of list) {
            if (item.isFile) size += item.Length!
            else if (item.isDir) size += await CalculateFolderSize(item.FullName!)
        }
    } catch (e) {
        console.log("CalculateFolderSizeNoCache catch", path, e)
    }
    //console.log("CalculateFolderSizeNoCache", path, size);
    return size
}

/// <summary>
/// Executes the specified Func[R] with cache
/// </summary>
/// <typeparam name="R"></typeparam>
/// <param name="cacheKey"></param>
/// <param name="method"></param>
/// <returns></returns>
function CacheMethod<R>(
    cacheKey: string,
    expirationInSeconds: number,
    methodMinTimeInMs: number,
    method: () => Promise<R>
): Promise<R> {
    if (expirationInSeconds <= 0) return method()
    var cacheValue = cache[cacheKey]
    if (cacheValue !== undefined) {
        return <Promise<R>>cacheValue
    }
    var stopper = new Stopwatch()
    stopper.Start()
    var x = method()
    stopper.Stop()
    if (methodMinTimeInMs <= 0 || stopper.ElapsedMilliseconds > methodMinTimeInMs) {
        cacheValue = x
        cache[cacheKey] = cacheValue
        setTimeout(() => clearCache(), 60 * 1000)
    }
    return x
}

function clearCache() {
    cache = {}
}
