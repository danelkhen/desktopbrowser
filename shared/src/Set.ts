export const minus = Symbol("minus")
export const plus = Symbol("plus")
export const intersect = Symbol("intersect")
declare global {
    interface Set<T> {
        [minus](y: Set<T>): Set<T>
        [plus](y: Set<T>): Set<T>
        [intersect](y: Set<T>): Set<T>
    }
}
Set.prototype[minus] = function <T>(this: Set<T>, y: Set<T>): Set<T> {
    return setMinus(this, y)
}
Set.prototype[plus] = function <T>(this: Set<T>, y: Set<T>): Set<T> {
    return setPlus(this, y)
}
Set.prototype[intersect] = function <T>(this: Set<T>, y: Set<T>): Set<T> {
    return setIntersect(this, y)
}
function setMinus<T>(x: Set<T>, y: Set<T>): Set<T> {
    const list: T[] = []
    x.forEach(t => !y.has(t) && list.push(t))
    return new Set(list)
}
function setPlus<T>(x: Set<T>, y: Set<T>): Set<T> {
    return new Set<T>([...Array.from(x), ...Array.from(y)])
}
function setIntersect<T>(x: Set<T>, y: Set<T>): Set<T> {
    const list: T[] = []
    x.forEach(t => x.has(t) && y.has(t) && list.push(t))
    return new Set(list)
}
