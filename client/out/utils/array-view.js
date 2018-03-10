"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("./event-emitter");
class ArrayView {
    constructor(source) {
        this.sort = {};
        this.activeSort = [];
        this.targetChanged = new event_emitter_1.EventEmitter();
        this.pageSize = 100;
        this.pageIndex = 0;
        this.source = source;
        this.refresh();
    }
    refresh() {
        let list = this.source();
        if (list == null) {
            this.target = null;
            return;
        }
        this.target = this.source().toArray();
        this.applyOrderBy();
        this.applyPaging();
        this.targetChanged.emit();
    }
    dumpActiveSort() {
        return this.activeSort.map(t => t + (this.isOrderedBy(t, true) ? " desc" : "")).join(", ");
    }
    isOrderedBy(key, desc) {
        if (!this.activeSort.contains(key))
            return false;
        if (desc != null && this.sort[key] != null)
            return this.sort[key].descending == desc;
        return true;
    }
    nextPage() {
        this.pageIndex++;
        this.refresh();
    }
    prevPage() {
        this.pageIndex--;
        this.refresh();
    }
    getCreateSort(key) {
        let def = this.sort[key];
        if (def != null)
            return def;
        this.sort[key] = def = { selector: t => t[key] };
        return def;
    }
    orderBy(key, keepKeys) {
        let keep = keepKeys || [];
        keep.add(key);
        let active = this.activeSort.toArray();
        let def = this.getCreateSort(key);
        if (active.contains(key)) {
            if (def.descendingFirst) {
                if (def.descending)
                    def.descending = !def.descending;
                else
                    active.remove(key);
            }
            else {
                if (!def.descending)
                    def.descending = !def.descending;
                else
                    active.remove(key);
            }
        }
        else {
            if (def.descendingFirst)
                def.descending = true;
            active.push(key);
        }
        active.removeAll(key => !keep.contains(key));
        this.activeSort = active;
        this.refresh();
    }
    static comparerFunc(x, y) {
        let x1 = x == null ? x : x.valueOf();
        let y1 = y == null ? y : y.valueOf();
        let val;
        if (typeof (x1) == "string")
            val = x1.localeCompare(y);
        else
            val = y1 - x1;
        return val;
    }
    applyOrderBy() {
        if (this.activeSort.length == 0)
            return;
        let defs = this.activeSort.map(key => this.getCreateSort(key));
        defs.where(t => t.valueComparerFunc == null).forEach(t => t.valueComparerFunc = ArrayView.comparerFunc);
        let comparerFunc = ComparerHelper.createCombined(defs);
        let list = this.target.toArray();
        list.sort(comparerFunc);
        this.target = list;
    }
    applyPaging() {
        this.totalPages = Math.ceil(this.target.length / this.pageSize);
        if (this.pageIndex >= this.totalPages)
            this.pageIndex = this.totalPages - 1;
        if (this.pageIndex < 0)
            this.pageIndex = 0;
        var from = this.pageIndex * this.pageSize;
        var until = from + this.pageSize;
        this.targetBeforePaging = this.target;
        this.target = this.target.slice(from, until);
    }
}
exports.ArrayView = ArrayView;
//# sourceMappingURL=array-view.js.map