"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.listeners = [];
    }
    on(listener) {
        this.listeners.push(listener);
    }
    off(listener) {
        this.listeners.remove(listener);
    }
    emit(arg) {
        let list = this.listeners.toArray();
        list.forEach(func => func(arg));
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event-emitter.js.map