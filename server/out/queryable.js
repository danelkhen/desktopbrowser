"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function* map(list, cb) {
    let index = 0;
    for await (let item of list) {
        yield cb(item, index);
        index++;
    }
}
exports.map = map;
async function* filter(list, cb) {
    let index = 0;
    for await (let item of list) {
        if (cb(item, index))
            yield item;
        index++;
    }
}
exports.filter = filter;
async function* skip(list, count) {
    let index = 0;
    for await (let item of list) {
        if (index >= count)
            yield item;
        index++;
    }
}
exports.skip = skip;
async function* take(list, count) {
    if (count <= 0)
        return;
    let index = 0;
    for await (let item of list) {
        yield item;
        index++;
        if (index >= count)
            break;
    }
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
        for await (let item of this.source) {
            list.push(item);
        }
        return list;
    }
}
exports.Queryable = Queryable;
