"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_emitter_1 = require("./event-emitter");
var ArrayView = (function () {
    function ArrayView(source) {
        this.sort = {};
        this.activeSort = [];
        this.targetChanged = new event_emitter_1.EventEmitter();
        this.pageSize = 100;
        this.pageIndex = 0;
        this.source = source;
        this.refresh();
    }
    ArrayView.prototype.refresh = function () {
        var list = this.source();
        if (list == null) {
            this.target = null;
            return;
        }
        this.target = this.source().toArray();
        this.applyOrderBy();
        this.applyPaging();
        this.targetChanged.emit();
    };
    ArrayView.prototype.dumpActiveSort = function () {
        var _this = this;
        return this.activeSort.map(function (t) { return t + (_this.isOrderedBy(t, true) ? " desc" : ""); }).join(", ");
    };
    ArrayView.prototype.isOrderedBy = function (key, desc) {
        if (!this.activeSort.contains(key))
            return false;
        if (desc != null && this.sort[key] != null)
            return this.sort[key].descending == desc;
        return true;
    };
    ArrayView.prototype.nextPage = function () {
        this.pageIndex++;
        this.refresh();
    };
    ArrayView.prototype.prevPage = function () {
        this.pageIndex--;
        this.refresh();
    };
    ArrayView.prototype.getCreateSort = function (key) {
        var def = this.sort[key];
        if (def != null)
            return def;
        this.sort[key] = def = { selector: function (t) { return t[key]; } };
        return def;
    };
    ArrayView.prototype.orderBy = function (key, keepKeys) {
        var keep = keepKeys || [];
        keep.add(key);
        var active = this.activeSort.toArray();
        var def = this.getCreateSort(key);
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
        active.removeAll(function (key) { return !keep.contains(key); });
        this.activeSort = active;
        this.refresh();
    };
    ArrayView.comparerFunc = function (x, y) {
        var x1 = x == null ? x : x.valueOf();
        var y1 = y == null ? y : y.valueOf();
        var val;
        if (typeof (x1) == "string")
            val = x1.localeCompare(y);
        else
            val = y1 - x1;
        return val;
    };
    ArrayView.prototype.applyOrderBy = function () {
        var _this = this;
        if (this.activeSort.length == 0)
            return;
        var defs = this.activeSort.map(function (key) { return _this.getCreateSort(key); });
        defs.where(function (t) { return t.valueComparerFunc == null; }).forEach(function (t) { return t.valueComparerFunc = ArrayView.comparerFunc; });
        var comparerFunc = ComparerHelper.createCombined(defs);
        var list = this.target.toArray();
        list.sort(comparerFunc);
        this.target = list;
    };
    ArrayView.prototype.applyPaging = function () {
        this.totalPages = Math.ceil(this.target.length / this.pageSize);
        if (this.pageIndex >= this.totalPages)
            this.pageIndex = this.totalPages - 1;
        if (this.pageIndex < 0)
            this.pageIndex = 0;
        var from = this.pageIndex * this.pageSize;
        var until = from + this.pageSize;
        this.targetBeforePaging = this.target;
        this.target = this.target.slice(from, until);
    };
    return ArrayView;
}());
exports.ArrayView = ArrayView;
//# sourceMappingURL=array-view.js.map