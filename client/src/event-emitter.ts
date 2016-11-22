export class EventEmitter<T> {

    listeners: EventListener<T>[] = [];
    on(listener: EventListener<T>) {
        this.listeners.push(listener);
    }
    off(listener: EventListener<T>) {
        this.listeners.remove(listener);
    }
    emit(arg?: T) {
        let list = this.listeners.toArray();
        list.forEach(func => func(arg));
    }
}

export interface EventListener<T> {
    (arg?: T): void;
}
