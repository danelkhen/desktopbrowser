/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
export interface EventMutator<T> {
    (handler: (e: T) => void): void
}
export async function* iterateEvent<T>(on: EventMutator<T>, off: EventMutator<T>): AsyncIterableIterator<T> {
    const queue: Promise<T>[] = []
    let pResolve: Function
    let p = new Promise<T>(resolve => (pResolve = resolve))
    queue.push(p)
    const handler = (e: T) => {
        pResolve(e)
        p = new Promise(resolve => (pResolve = resolve))
        queue.push(p)
    }
    on(handler)
    try {
        while (queue.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const p = queue.shift()!
            const item = await p
            yield item
        }
    } finally {
        off(handler)
    }
}

export function iterateDomEvent<T>(target: EventTarget, name: string): AsyncIterableIterator<T> {
    return iterateEvent(
        handler => target.addEventListener(name, handler as any),
        handler => target.removeEventListener(name, handler as any)
    )
}
