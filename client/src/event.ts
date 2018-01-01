export interface EventMutator<T> {
    (handler: (e: T) => void): void
}
export async function* iterateEvent<T>(on: EventMutator<T>, off: EventMutator<T>): AsyncIterableIterator<T> {
    let queue: Promise<T>[] = [];
    let pResolve: Function;
    let p = new Promise<T>((resolve, reject) => pResolve = resolve);
    queue.push(p);
    let handler = (e: T) => {
        pResolve(e);
        p = new Promise((resolve, reject) => pResolve = resolve);
        queue.push(p);
    };
    on(handler);
    try {
        while (queue.length > 0) {
            let p = queue.shift();
            let item = await p;
            yield item;
        }
    }
    finally {
        off(handler);
    }
}

export function iterateDomEvent<T>(target: EventTarget, name: string): AsyncIterableIterator<T> {
    return iterateEvent(
        handler => target.addEventListener(name, handler as any),
        handler => target.removeEventListener(name, handler as any)
    );
}



