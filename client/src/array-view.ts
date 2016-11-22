import { EventEmitter } from "./event-emitter"

export class ArrayView<T> {
    constructor(source: () => T[]) {
        this.source = source;
        this.refresh();
    }
    source: () => T[];
    target: T[];

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

    isOrderedBy(name: string, desc?: boolean): boolean {
        if (this.orderByProp != name)
            return false;
        if (desc != null && this.orderByDescending != desc)
            return false;
        return true;
    }
    orderByProp: string;
    orderByDescending: boolean = false;
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

    orderBy(name: string, desc?: boolean, descFirstByDefault?: boolean) {
        if (desc == null) {
            if (this.orderByProp == name)
                desc = !this.orderByDescending;
            else if (descFirstByDefault != null)
                desc = true;
            else
                desc = false;
        }
        this.orderByProp = name;
        this.orderByDescending = desc;
        this.refresh();
    }
    applyOrderBy(): void {
        if (this.orderByProp == null)
            return;
        let list = this.target.toArray();
        list.sort((a, b) => {
            let x = a[this.orderByProp];
            let y = b[this.orderByProp];
            let val: number;
            if (typeof (x) == "string")
                val = x.localeCompare(y);
            else
                val = y - x;
            if (this.orderByDescending)
                val *= -1;
            return val;
        });
        this.target = list; //this.target.orderBy(<any>this.orderByProp, this.orderByDescending);
    }

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
