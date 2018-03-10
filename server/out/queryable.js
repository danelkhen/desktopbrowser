"use strict";
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
function map(list, cb) {
    return __asyncGenerator(this, arguments, function* map_1() {
        let index = 0;
        try {
            for (var list_1 = __asyncValues(list), list_1_1; list_1_1 = yield __await(list_1.next()), !list_1_1.done;) {
                let item = yield __await(list_1_1.value);
                yield cb(item, index);
                index++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (list_1_1 && !list_1_1.done && (_a = list_1.return)) yield __await(_a.call(list_1));
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    });
}
exports.map = map;
function filter(list, cb) {
    return __asyncGenerator(this, arguments, function* filter_1() {
        let index = 0;
        try {
            for (var list_2 = __asyncValues(list), list_2_1; list_2_1 = yield __await(list_2.next()), !list_2_1.done;) {
                let item = yield __await(list_2_1.value);
                if (cb(item, index))
                    yield item;
                index++;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (list_2_1 && !list_2_1.done && (_a = list_2.return)) yield __await(_a.call(list_2));
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _a;
    });
}
exports.filter = filter;
function skip(list, count) {
    return __asyncGenerator(this, arguments, function* skip_1() {
        let index = 0;
        try {
            for (var list_3 = __asyncValues(list), list_3_1; list_3_1 = yield __await(list_3.next()), !list_3_1.done;) {
                let item = yield __await(list_3_1.value);
                if (index >= count)
                    yield item;
                index++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (list_3_1 && !list_3_1.done && (_a = list_3.return)) yield __await(_a.call(list_3));
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _a;
    });
}
exports.skip = skip;
function take(list, count) {
    return __asyncGenerator(this, arguments, function* take_1() {
        if (count <= 0)
            return;
        let index = 0;
        try {
            for (var list_4 = __asyncValues(list), list_4_1; list_4_1 = yield __await(list_4.next()), !list_4_1.done;) {
                let item = yield __await(list_4_1.value);
                yield item;
                index++;
                if (index >= count)
                    break;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (list_4_1 && !list_4_1.done && (_a = list_4.return)) yield __await(_a.call(list_4));
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _a;
    });
}
exports.take = take;
function toQueryable(list) {
    return new Queryable(list);
}
exports.toQueryable = toQueryable;
class Queryable {
    constructor(source) {
        this.source = source;
    }
    select(cb) {
        return new Queryable(map(this.source, cb));
    }
    where(cb) {
        return new Queryable(filter(this.source, cb));
    }
    skip(count) {
        return new Queryable(skip(this.source, count));
    }
    take(count) {
        return new Queryable(take(this.source, count));
    }
    async toArray() {
        let list = [];
        try {
            for (var _a = __asyncValues(this.source), _b; _b = await _a.next(), !_b.done;) {
                let item = await _b.value;
                list.push(item);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) await _c.call(_a);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return list;
        var e_5, _c;
    }
}
exports.Queryable = Queryable;
