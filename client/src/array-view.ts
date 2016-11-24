import { EventEmitter } from "./event-emitter"

export class ArrayView<T> {
    constructor(source: () => T[]) {
        this.source = source;
        this.refresh();
    }
    source: () => T[];
    target: T[];
    sort: { [key: string]: ArrayViewSort<T, any> } = {};
    activeSort: string[] = [];

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
    targetChanged = new EventEmitter();

    isOrderedBy(key: string, desc?: boolean): boolean {
        if (!this.activeSort.contains(key))
            return false;
        if (desc != null)
            return this.sort[key].descending == desc;
        return true;
    }
    //orderByProp: string;
    //orderByDescending: boolean = false;
    pageSize: number = 100;
    pageIndex: number = 0;
    totalPages: number;
    targetBeforePaging: T[];
    nextPage() {
        this.pageIndex++;
        this.refresh();
    }
    prevPage() {
        this.pageIndex--;
        this.refresh();
    }

    getCreateSort(key: string): ArrayViewSort<T, any> {
        let def = this.sort[key];
        if (def != null)
            return def;
        this.sort[key] = def = { selector: t => t[key] };
        return def;
    }

    orderBy(key: string) {
        let def = this.getCreateSort(key);
        if (this.activeSort.contains(key))
            def.descending = !def.descending;
        else if (def.descendingFirst)
            def.descending = true;
        else
            this.activeSort = [key];
        this.refresh();
    }

    static comparerFunc(x, y) {
        let x1 = x == null ? x : x.valueOf();
        let y1 = y == null ? y : y.valueOf();
        let val: number;
        if (typeof (x1) == "string")
            val = x1.localeCompare(y);
        else
            val = y1 - x1;
        return val;
    }

    applyOrderBy(): void {
        if (this.activeSort.length == 0)
            return;
        let defs = this.activeSort.map(key => this.sort[key]);
        defs.where(t => t.valueComparerFunc == null).forEach(t => t.valueComparerFunc = ArrayView.comparerFunc);
        let comparerFunc = ComparerHelper.createCombined(defs);
        let list = this.target.toArray();
        list.sort(comparerFunc);
        this.target = list;
    }
    //applyOrderBy2(): void {
    //    if (this.orderByProp == null)
    //        return;
    //    let comparerFunc = ComparerHelper.create<T, any>({
    //        selector: t => t[this.orderByProp],
    //        valueComparerFunc: ArrayView.comparerFunc,
    //        descending: this.orderByDescending,
    //    });
    //    let list = this.target.toArray();
    //    list.sort(comparerFunc);
    //    this.target = list;
    //}

    applyPaging(): void {
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

    //static of<T>(list: T[]): ArrayView<T> {
    //    return new ArrayView(list);
    //}
}

interface ArrayViewSort<T, R> {
    selector: SelectorFunc<T, R>;
    descending?: boolean;
    valueComparerFunc?: ComparerFunc<R>;
    descendingFirst?: boolean;
}


