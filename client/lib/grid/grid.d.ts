interface GridCol {
    SourceCol?: GridCol;
    Name?: string;
    Def?: GridCol;
    Defs?: Array<GridCol>;
    Prop?: JsFunc1<any, any>;
    Title?: string;
    Getter?: JsFunc1<any, any>;
    Comparer?: JsFunc2<any, any, number>;
    Visible?: boolean;
    Format?: JsFunc1<any, string>;
    ClassFunc?: JsFunc1<any, string>;
    Class?: string;
    Width?: number;
    RenderCell?: JsAction3<GridCol, any, JQuery>;
    RenderHeaderCell?: JsAction2<GridCol, JQuery>;
}
interface GridCol1<T> extends GridCol {
    Prop?: JsFunc1<T, any>;
    Getter?: JsFunc1<T, any>;
    Comparer?: JsFunc2<T, T, number>;
    RenderCell?: JsAction3<GridCol1<T>, T, JQuery>;
    RenderHeaderCell?: JsAction2<GridCol1<T>, JQuery>;
}
interface GridCol2<T, V> extends GridCol1<T> {
    Prop?: JsFunc1<T, V>;
    Getter?: JsFunc1<T, V>;
    Format?: JsFunc1<V, string>;
    ClassFunc?: JsFunc1<V, string>;
}
declare class Extensions5 {
    static ToGrid<T>(list: Array<T>, j: JQuery, opts: GridOptions<T>): JQuery;
}
interface GridOptions<T> {
    Columns?: Array<GridCol1<T>>;
    Items?: Array<T>;
    FooterItem?: T;
    PageIndex?: number;
    PageSize?: number;
    Query?: string;
    OrderBy2?: JsFunc2<T, T, number>;
    OrderByDesc?: boolean;
    RowClass?: JsFunc2<T, number, string>;
    RenderFinished?: JsAction;
}
/** <summary>
/// Render
///     Verify
///         ApplyOrderBy
///         ApplyPaging
///     RenderTable
///         RenderHeaderCell
///         RenderCell
///     RenderSearch
///     RenderPager
///
/// Html Template
///     <div class="Grid">
///         <div class="Search form-inline">
///             <input class="tbSearch form-control" placeholder="Find">
///         </div>
///         <div class="Pager">
///             <div class="PagerInfo"><a class="PrevPage">Prev</a><span class="PageInfo">1 / 1</span><a class="NextPage">Next</a></div>
///         </div>
///         <table>
///             <thead>
///                 <tr>
///                     <th></th>
///                 </tr>
///             </thead>
///             <tbody>
///                 <tr>
///                     <td></td>
///                 </tr>
///             </tbody>
///             <tfoot>
///                 <tr>
///                     <th></th>
///                 </tr>
///             </tfoot>
///         </table>
///     </div>
///
/// </summary>
/// <typeparam name="T"></typeparam>
//[JsType(JsMode.Prototype, NativeOverloads = false)]
*/
declare class Grid<T> {
    constructor(el?: JQuery, opts?: GridOptions<T>);
    Init(): void;
    Options: GridOptions<T>;
    El: JQuery;
    RenderTimer: Timer;
    TotalPages: number;
    CurrentList: Array<T>;
    SearchInputEl: JQuery;
    OrderByCol: GridCol1<T>;
    OrderByColClickCount: number;
    Render(): void;
    Cols: Array<GridCol1<T>>;
    FinalizeCol(col: GridCol1<T>): GridCol1<T>;
    Verify(): void;
    ApplyOrderBy(): void;
    ApplyPaging(): void;
    ApplyQuery(): void;
    Search(): void;
    OrderBy(col: GridCol1<T>): void;
    DataRows: JQuery;
    VisibleColumns: Array<GridCol1<T>>;
    HeaderRows: JQuery;
    RenderTable(): void;
    AutoSizeColumns(): void;
    RenderRow(obj: T): void;
    RenderRow2(tr: JQuery, obj: T, index?: number): void;
    RenderHeaderCell(col: GridCol1<T>, th: JQuery): void;
    RenderCell(col: GridCol1<T>, obj: T, td: JQuery): void;
    RenderSearch(): void;
    RenderPager(): void;
    CurrentListBeforePaging: Array<T>;
    SearchEl: JQuery;
    PagerEl: JQuery;
    Table: JQuery;
    GetItem(el: JQuery): T;
    GetRow(obj: T): JQuery;
    static Get<T>(el: JQuery): Grid<T>;
}
interface JQuery {
    Grid<T>(opts: GridOptions<T>): JQuery;
}
declare type Compare<T> = JsFunc2<T, T, number>;
declare class Utils {
    static ToComparer<T, V>(getter: JsFunc1<T, V>, desc?: boolean): JsFunc2<T, T, number>;
    static ToDescendingComparer<T, V>(getter: JsFunc1<T, V>): JsFunc2<T, T, number>;
    static ToDescending<T>(comparer: JsFunc2<T, T, number>): JsFunc2<T, T, number>;
    static ThenBy2<T>(comparer: JsFunc2<T, T, number>, comparer2: JsFunc2<T, T, number>): JsFunc2<T, T, number>;
    static ThenBy<T, V>(comparer: JsFunc2<T, T, number>, getter: JsFunc1<T, V>, desc?: boolean): JsFunc2<T, T, number>;
    static Order<T>(comparer: JsFunc2<T, T, number>, list: Array<T>): T[];
    static GetDefaultComparer<T>(): JsFunc2<T, T, number>;
    static DataGetSet<T>(j: JQuery, name: string, value: T): T;
    static Prop<T>(prop: JsFunc1<T, any>): string;
    static ItemProp<T>(list: Array<T>, prop: JsFunc1<T, any>): string;
    static ItemGetter<T, V>(list: Array<T>, prop: JsFunc1<T, V>): JsFunc1<T, V>;
}
