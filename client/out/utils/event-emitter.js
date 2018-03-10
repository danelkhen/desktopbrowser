"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = [];
    }
    EventEmitter.prototype.on = function (listener) {
        this.listeners.push(listener);
    };
    EventEmitter.prototype.off = function (listener) {
        this.listeners.remove(listener);
    };
    EventEmitter.prototype.emit = function (arg) {
        var list = this.listeners.toArray();
        list.forEach(function (func) { return func(arg); });
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event-emitter.js.map