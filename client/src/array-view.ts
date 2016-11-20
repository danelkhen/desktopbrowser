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
    }

    _orderBy: string | Function;
    _orderByDescending: boolean;
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

    orderBy(name: string, desc?: boolean) {
        if (desc == null) {
            if (this._orderBy == name)
                desc = !this._orderByDescending;
        }
        this._orderBy = name;
        this._orderByDescending = desc;
        this.refresh();
    }
    applyOrderBy(): void {
        if (this._orderBy == null)
            return;
        this.target = this.target.orderBy(<any>this._orderBy, this._orderByDescending);
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
