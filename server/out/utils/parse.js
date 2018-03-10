"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parse {
    static TryInt(s) {
        let x = parseInt(s);
        if (isNaN(x))
            return null;
        return x;
    }
    static TryBoolean(s) {
        if (["1", "true", "True", "TRUE"].contains(s))
            return true;
        return false;
    }
    static TryLong(s) {
        return this.TryInt(s);
    }
}
exports.Parse = Parse;
