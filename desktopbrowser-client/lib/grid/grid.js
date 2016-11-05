var Extensions5 = (function () {
    function Extensions5() {
    }
    Extensions5.ToGrid = function (list, j, opts) {
        opts.Items = list;
        return j.Grid(opts);
    };
    return Extensions5;
}());
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
var Grid = (function () {
    function Grid(el, opts) {
        this.El = el;
        this.Options = opts;
        this.Init();
    }
    Grid.prototype.Init = function () {
        var _this = this;
        this.RenderTimer = new Timer(function () { return _this.Render(); });
    };
    Grid.prototype.Render = function () {
        this.Verify();
        this.RenderSearch();
        this.RenderPager();
        this.RenderTable();
        if (this.Options.RenderFinished != null)
            this.Options.RenderFinished();
    };
    Grid.prototype.FinalizeCol = function (col) {
        var _this = this;
        var final = Q.copy(col);
        final.SourceCol = col;
        var defs = new Array();
        if (col.Def != null)
            defs.push(col.Def);
        if (col.Defs != null)
            defs.addRange(col.Defs);
        if (defs.length == 0)
            return final;
        defs.forEach(function (def) { return Q.copy(_this.FinalizeCol(def), final); });
        return final;
    };
    Grid.prototype.Verify = function () {
        var _this = this;
        if (this.Options.Columns == null)
            this.Options.Columns = new Array();
        if (this.Options.PageIndex == null)
            this.Options.PageIndex = 0;
        if (this.Options.PageSize == null)
            this.Options.PageSize = 20;
        if (this.Options.Items == null)
            this.Options.Items = new Array();
        this.Cols = this.Options.Columns.select(function (t) { return _this.FinalizeCol(t); });
        this.Cols.forEach(function (col) {
            if (col.Name == null && col.Prop != null)
                col.Name = Utils.ItemProp(_this.Options.Items, col.Prop);
            if (col.Getter == null && col.Prop != null)
                col.Getter = col.Prop;
            if (col.Getter == null && col.Name != null)
                col.Getter = function (t) { return t[col.Name]; };
            if (col.Comparer == null && col.Getter != null)
                col.Comparer = Utils.ToComparer(col.Getter);
            if (col.Title == null && col.Name != null)
                col.Title = col.Name;
            if (col.Visible == null)
                col.Visible = true;
        });
        this.CurrentList = this.Options.Items;
        this.ApplyQuery();
        this.ApplyOrderBy();
        this.ApplyPaging();
    };
    Grid.prototype.ApplyOrderBy = function () {
        if (this.Options.OrderBy2 == null)
            return;
        if (this.Options.OrderByDesc)
            this.CurrentList = Utils.Order(Utils.ToDescending(this.Options.OrderBy2), this.CurrentList); //.orderByDescending(Options.OrderBy);
        else
            this.CurrentList = Utils.Order(this.Options.OrderBy2, this.CurrentList);
    };
    Grid.prototype.ApplyPaging = function () {
        this.TotalPages = Math.ceil(this.CurrentList.length / this.Options.PageSize);
        if (this.Options.PageIndex >= this.TotalPages)
            this.Options.PageIndex = this.TotalPages - 1;
        if (this.Options.PageIndex < 0)
            this.Options.PageIndex = 0;
        var from = this.Options.PageIndex * this.Options.PageSize;
        var until = from + this.Options.PageSize;
        this.CurrentListBeforePaging = this.CurrentList;
        this.CurrentList = this.CurrentList.slice(from, until);
    };
    Grid.prototype.ApplyQuery = function () {
        var _this = this;
        if (Q.isNullOrEmpty(this.Options.Query))
            return;
        var tokens = this.Options.Query.toLowerCase().split(' ');
        this.CurrentList = this.CurrentList.where(function (obj) {
            var line = _this.Cols.select(function (col) { return col.Getter(obj); }).join(" ").toLocaleLowerCase();
            var match = tokens.all(function (token) { return line.contains(token); });
            return match;
        });
    };
    Grid.prototype.Search = function () {
        this.RenderTimer.set(100);
    };
    Grid.prototype.OrderBy = function (col) {
        if (this.OrderByCol == null) {
            this.OrderByColClickCount = 1;
            this.OrderByCol = col;
            //Options.OrderBy = t => OrderByCol.Getter(t);
            this.Options.OrderByDesc = false;
            this.Options.OrderBy2 = this.OrderByCol.Comparer; //.Getter.ToComparer();
        }
        else {
            this.OrderByColClickCount++;
            if (this.OrderByColClickCount == 2) {
                this.Options.OrderByDesc = true;
            }
            else if (this.OrderByColClickCount == 3) {
                this.Options.OrderBy2 = null;
                this.OrderByCol = null;
                this.OrderByColClickCount = null;
            }
        }
        this.Render();
    };
    Grid.prototype.RenderTable = function () {
        var _this = this;
        this.Table = this.El.getAppend("table");
        var thead = this.Table.getAppend("thead");
        var tbody = this.Table.getAppend("tbody");
        var tfoot = this.Table.getAppendRemove("tfoot", this.Options.FooterItem != null ? 1 : 0);
        this.VisibleColumns = this.Cols.where(function (t) { return t.Visible == true; });
        this.HeaderRows = thead.getAppend("tr").bindChildrenToList("th", this.VisibleColumns, function (th, col) {
            _this.RenderHeaderCell(col, th);
        });
        var list = this.CurrentList;
        this.DataRows = tbody.bindChildrenToList("tr", list, function (tr, obj, i) {
            _this.RenderRow2(tr, obj, i);
        });
        if (this.Options.FooterItem != null) {
            tfoot.getAppend("tr").bindChildrenToList("th", this.VisibleColumns, function (th, col) { return _this.RenderCell(col, _this.Options.FooterItem, th); });
        }
        //TODO: works ok when table width=100%, with overflow ellipsis, disabling for now:
        //AutoSizeColumns();
    };
    Grid.prototype.AutoSizeColumns = function () {
        var _this = this;
        if (this.VisibleColumns.first(function (t) { return t.Width != null; }) == null)
            return;
        this.Table.css("width", "");
        this.HeaderRows.css("width", "");
        var widths = this.VisibleColumns.select(function (col, i) {
            var th = _this.HeaderRows[i];
            if (col.Width == null)
                return th.offsetWidth;
            return col.Width;
        });
        this.VisibleColumns.forEach(function (col, i) {
            var th = _this.HeaderRows[i];
            if (col.Width == null)
                th.style.width = th.offsetWidth + "px";
            else
                th.style.width = col.Width + "px";
        });
        var totalWidth = widths.sum();
        this.Table.css("width", totalWidth + "px");
    };
    Grid.prototype.RenderRow = function (obj) {
        if (this.DataRows == null)
            return;
        var index = this.CurrentList.indexOf(obj);
        if (index < 0)
            return;
        var tr = $(this.DataRows[index]);
        this.RenderRow2(tr, obj, index);
    };
    Grid.prototype.RenderRow2 = function (tr, obj, index) {
        var _this = this;
        var trClass = "";
        if (this.Options.RowClass != null)
            trClass = this.Options.RowClass(obj, index);
        if (tr[0].className != trClass)
            tr[0].className = trClass;
        tr.bindChildrenToList("td", this.VisibleColumns, function (td, col) {
            _this.RenderCell(col, obj, td);
        });
    };
    Grid.prototype.RenderHeaderCell = function (col, th) {
        var _this = this;
        if (col.RenderHeaderCell != null) {
            col.RenderHeaderCell(col, th);
            return;
        }
        var span = th.getAppend("button");
        span.off();
        span.mousedown(function (e) {
            if (e.which != 1)
                return;
            e.preventDefault();
            _this.OrderBy(col);
        });
        span.text(col.Title != null ? col.Title : col.Name);
        var classes = new Array();
        if (col.Class != null)
            classes.push(col.Class);
        if (this.OrderByCol != null && this.OrderByCol.SourceCol == col.SourceCol) {
            classes.push("OrderBy");
            if (!this.Options.OrderByDesc)
                classes.push("Asc");
            if (this.Options.OrderByDesc)
                classes.push("Desc");
        }
        th[0].className = classes.join(" ");
        if (col.Width != null)
            th.css("width", col.Width + "px");
    };
    Grid.prototype.RenderCell = function (col, obj, td) {
        if (col.RenderCell != null) {
            col.RenderCell(col, obj, td);
            return;
        }
        var value = obj;
        if (col.Getter != null)
            value = col.Getter(obj);
        var sValue = value;
        if (col.Format != null && value != null)
            sValue = col.Format(value);
        if (sValue == null)
            sValue = "";
        td.text(sValue).attr("title", sValue);
        var classes = new Array();
        if (col.Class != null)
            classes.push(col.Class);
        if (col.ClassFunc != null)
            classes.push(col.ClassFunc(value));
        var cn = classes.join(" ");
        if (td[0].className != cn)
            td[0].className = cn;
    };
    Grid.prototype.RenderSearch = function () {
        var _this = this;
        if (this.SearchEl == null && this.SearchInputEl == null)
            this.SearchEl = this.El.getAppend(".Search").addClass("form-inline");
        if (this.SearchInputEl == null)
            this.SearchInputEl = this.SearchEl.getAppend("input.tbSearch").addClass("form-control").attr("placeholder", "Find");
        if (Utils.DataGetSet(this.SearchInputEl, "GridSearchInputEventAttached", true))
            return;
        this.SearchInputEl.on("input", function (e) {
            _this.Options.Query = _this.SearchInputEl.val();
            _this.Search();
        });
    };
    Grid.prototype.RenderPager = function () {
        var _this = this;
        //if (TotalPages <= 1)
        //{
        //    El.getAppendRemove(".Pager", 0);
        //    return;
        //}
        this.El.toggleClass("HasNoPages", this.TotalPages == 0);
        this.El.toggleClass("HasOnePage", this.TotalPages == 1);
        this.El.toggleClass("HasManyPages", this.TotalPages > 1);
        this.El.toggleClass("HasPrevPage", this.Options.PageIndex > 0);
        this.El.toggleClass("HasNextPage", this.Options.PageIndex < this.TotalPages - 1);
        var pages = Array.generateNumbers(0, this.TotalPages);
        if (this.PagerEl == null)
            this.PagerEl = this.El.getAppend(".Pager").addClass("btn-group");
        this.PagerEl.getAppend("a.btn.btn-default.PrevPage").getAppend("span.glyphicon.glyphicon-backward").parent().off().mousedown(function (e) {
            e.preventDefault();
            _this.Options.PageIndex--;
            _this.Render();
        });
        var info = this.PagerEl.getAppend("a.btn.btn-default.PagerInfo");
        info.text(this.Options.PageIndex + 1 + " / " + this.TotalPages + " (Total: " + this.CurrentListBeforePaging.length + ")");
        this.PagerEl.getAppend("a.btn.btn-default.NextPage").getAppend("span.glyphicon.glyphicon-forward").parent().off().mousedown(function (e) {
            e.preventDefault();
            _this.Options.PageIndex++;
            _this.Render();
        });
        //return;
        //var links = pager.getAppend(".Pages").bindChildrenToList("a.Page", pages, (link, page) =>
        //{
        //    var link2 = new jQuery(link);
        //    var displayPage = (page + 1).ToString();
        //    link2.off().text(displayPage).mousedown(e =>
        //    {
        //        Options.PageIndex = page;
        //        Render();
        //    });
        //});
    };
    Grid.prototype.GetItem = function (el) {
        return el.closest("tr").dataItem();
    };
    Grid.prototype.GetRow = function (obj) {
        if (this.DataRows == null)
            return $();
        var index = this.CurrentList.indexOf(obj);
        if (index != null)
            return $(this.DataRows[index]);
        return $();
    };
    Grid.Get = function (el) {
        return el.data("Grid");
    };
    return Grid;
}());
$.fn.Grid = function (opts) {
    this.toArray().forEach(function (el) {
        var el2 = $(el);
        var grid = el2.data("Grid");
        if (grid != null) {
            grid.Options = opts;
            grid.El = $(el);
            grid.Render();
        }
        else {
            grid = new Grid(el2, opts);
            el2.data("Grid", grid);
            grid.Render();
        }
    });
    return this;
};
var Utils = (function () {
    function Utils() {
    }
    Utils.ToComparer = function (getter, desc) {
        if (desc)
            return Utils.ToDescendingComparer(getter);
        var valueComparer = this.GetDefaultComparer();
        var comparer = (function (x, y) { return valueComparer(getter(x), getter(y)); });
        return comparer;
    };
    Utils.ToDescendingComparer = function (getter) {
        var valueComparer = this.GetDefaultComparer();
        var comparer = (function (x, y) { return valueComparer(getter(x), getter(y)) * -1; });
        return comparer;
    };
    Utils.ToDescending = function (comparer) {
        return function (x, y) { return comparer(x, y) * -1; };
    };
    Utils.ThenBy2 = function (comparer, comparer2) {
        return (function (x, y) {
            var diff = comparer(x, y);
            if (diff == 0)
                diff = comparer2(x, y);
            return diff;
        });
    };
    Utils.ThenBy = function (comparer, getter, desc) {
        return Utils.ThenBy2(comparer, Utils.ToComparer(getter, desc));
        //return comparer.ThenBy(getter.ToComparer(desc));
    };
    Utils.Order = function (comparer, list) {
        var list2 = list.toArray();
        list2.sort(comparer);
        return list2;
    };
    Utils.GetDefaultComparer = function () {
        var comparer = (Comparer._default.compare);
        return comparer;
    };
    Utils.DataGetSet = function (j, name, value) {
        var val = value;
        var value2 = j.data(name);
        if (value2 == val)
            return value2;
        j.data(name, val);
        return value2;
    };
    Utils.Prop = function (prop) {
        var prop2 = prop;
        var code;
        if (prop2.isDelegate)
            code = prop2.func.toString();
        else
            code = prop.toString();
        return code.substringBetween(".", ";");
    };
    Utils.ItemProp = function (list, prop) {
        return Utils.Prop(prop);
    };
    Utils.ItemGetter = function (list, prop) {
        return prop;
    };
    return Utils;
}());
//class Comparer<T>
//{
//    compare(x: T, y: T): number { return null; }
//    static _default: Comparer<T>;
//}
