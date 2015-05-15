using DesktopBrowser.client.utils;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.client.grid
{

    /// <summary>
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
    [JsType(JsMode.Prototype, Filename = "~/res/js/grid.js")]
    public class Grid<T>
    {

        public Grid(jQuery el, GridOptions<T> opts)
        {
            El = el;
            Options = opts;
            SearchTimer = new Timer(Search);
            Render();
        }

        public GridOptions<T> Options { get; set; }

        public jQuery El { get; set; }

        Timer SearchTimer;
        JsNumber TotalPages;
        JsArray<T> CurrentList;
        jQuery tbSearch;
        GridCol<T> OrderByCol;
        JsNumber OrderByColClickCount;

        public void Render()
        {
            Verify();
            RenderSearch();
            RenderPager();
            RenderTable();
        }

        void Verify()
        {
            if (Options.Columns == null)
                Options.Columns = new JsArray<GridCol<T>>();
            if (Options.PageIndex == null)
                Options.PageIndex = 0;
            if (Options.PageSize == null)
                Options.PageSize = 20;
            if (Options.Items == null)
                Options.Items = new JsArray<T>();

            Options.Columns.forEach(col =>
            {
                if (col.Name == null && col.Prop != null)
                    col.Name = Options.Items.ItemProp(col.Prop);
                if (col.Getter == null && col.Prop != null)
                    col.Getter = col.Prop.As<JsFunc<T, object>>();
                if (col.Getter == null && col.Name != null)
                    col.Getter = t => t.As<JsObject>()[col.Name].As<JsString>();
                if (col.Title == null && col.Name != null)
                    col.Title = col.Name;
                if (col.Visible == null)
                    col.Visible = true;
            });

            CurrentList = Options.Items;
            ApplyQuery();
            ApplyOrderBy();
            ApplyPaging();
        }

        void ApplyOrderBy()
        {
            if (Options.OrderBy == null)
                return;
            if (Options.OrderByDesc)
                CurrentList = CurrentList.orderByDescending(Options.OrderBy);
            else
                CurrentList = CurrentList.orderBy(Options.OrderBy);
        }

        void ApplyPaging()
        {
            TotalPages = JsMath.ceil(CurrentList.length / Options.PageSize);
            if (Options.PageIndex >= TotalPages)
                Options.PageIndex = TotalPages - 1;
            if (Options.PageIndex < 0)
                Options.PageIndex = 0;
            var from = Options.PageIndex * Options.PageSize;
            var until = from + Options.PageSize;
            CurrentListBeforePaging = CurrentList;
            CurrentList = CurrentList.slice(from, until);
        }

        void ApplyQuery()
        {
            if (Options.Query.isNullOrEmpty())
                return;
            var tokens = Options.Query.toLowerCase().split(' ');
            CurrentList = CurrentList.where(obj =>
            {
                var line = Options.Columns.select(col => col.Getter(obj)).join(" ").toLocaleLowerCase();
                var match = tokens.all(token => line.contains(token));
                return match;
            });
        }
        void Search()
        {
            Render();
        }

        void OrderBy(GridCol<T> col)
        {
            if (OrderByCol != col)
            {
                OrderByColClickCount = 1;
                OrderByCol = col;
                Options.OrderBy = t => OrderByCol.Getter(t);
                Options.OrderByDesc = false;
            }
            else
            {
                OrderByColClickCount++;
                if (OrderByColClickCount == 2)
                {
                    Options.OrderByDesc = true;
                }
                else if (OrderByColClickCount == 3)
                {
                    Options.OrderBy = null;
                    OrderByCol = null;
                    OrderByColClickCount = null;
                }
            }
            Render();
        }

        void RenderTable()
        {
            var table = El.getAppend("table");
            var thead = table.getAppend("thead");
            var tbody = table.getAppend("tbody");
            var tfoot = table.getAppendRemove("tfoot", Options.FooterItem != null ? 1 : 0);

            var visibleColumns = Options.Columns.where(t => t.Visible == true);
            var ths = thead.getAppend("tr").bindChildrenToList("th", visibleColumns, (th, col) =>
            {
                RenderHeaderCell(col, th);
            });
            var list = CurrentList;
            tbody.bindChildrenToList("tr", list, (tr, obj, i) =>
            {
                var trClass = "";
                if (Options.RowClass != null)
                    trClass = Options.RowClass(obj, i);
                if (tr[0].className != trClass)
                    tr[0].className = trClass;
                tr.bindChildrenToList("td", visibleColumns, (td, col) =>
                {
                    RenderCell(col, obj, td);
                });
            });
            if (Options.FooterItem != null)
            {
                tfoot.getAppend("tr").bindChildrenToList("th", visibleColumns, (th, col) => RenderCell(col, Options.FooterItem, th));
            }
            if (visibleColumns.first(t => t.Width != null) != null)
            {
                table.css("width", "");
                var widths = visibleColumns.select((col, i) =>
                {
                    var th = ths[i];
                    if (col.Width == null)
                        return th.offsetWidth.As<JsNumber>();
                    return col.Width;
                });
                visibleColumns.forEach((col, i) =>
                {
                    var th = ths[i];
                    if (col.Width == null)
                        th.style.width = th.offsetWidth + "px";
                    //else
                    //    th.style.width = col.Width;
                });

                var totalWidth = widths.sum();
                table.css("width", totalWidth + "px");
            }
        }

        void RenderHeaderCell(GridCol<T> col, jQuery th)
        {
            if (col.RenderHeaderCell != null)
            {
                col.RenderHeaderCell(col, th);
                return;
            }
            th.off();
            th.mousedown(e =>
            {
                if (e.which != 1)
                    return;
                e.preventDefault();
                OrderBy(col);
            });
            th.text(col.Title ?? col.Name);
            var classes = new JsArray<JsString>();
            if (col.Class != null)
                classes.push(col.Class);
            if (col == OrderByCol)
            {
                classes.push("OrderBy");
                if (!Options.OrderByDesc)
                    classes.push("Asc");
                if (Options.OrderByDesc)
                    classes.push("Desc");
            }
            th[0].className = classes.join(" ");
            if (col.Width != null)
                th.css("width", col.Width + "px");
        }

        void RenderCell(GridCol<T> col, T item, jQuery td)
        {
            if (col.RenderCell != null)
            {
                col.RenderCell(col, item, td);
                return;
            }

            object value = item;
            if (col.Getter != null)
                value = col.Getter(item);
            JsString sValue = value.As<JsString>();
            if (col.Format != null && value != null)
                sValue = col.Format(value);
            if (sValue == null)
                sValue = "";
            td.text(sValue).attr("title", sValue);
            var classes = new JsArray<JsString>();
            if (col.Class != null)
                classes.push(col.Class);
            if (col.ClassFunc != null)
                classes.push(col.ClassFunc(value));
            var cn = classes.join(" ");
            if (td[0].className != cn)
                td[0].className = cn;
        }
        void RenderSearch()
        {
            var searchEl = El.getAppend(".Search").addClass("form-inline");
            tbSearch = searchEl.getAppend("input.tbSearch").addClass("form-control").attr("placeholder", "Find");
            if (tbSearch.data("x") == null)
            {
                tbSearch.data("x", true);
                tbSearch.on("input", e =>
                {
                    Options.Query = tbSearch.valString();
                    SearchTimer.set(1);
                });
            }
        }
        void RenderPager()
        {
            //if (TotalPages <= 1)
            //{
            //    El.getAppendRemove(".Pager", 0);
            //    return;
            //}
            El.toggleClass("HasNoPages", TotalPages == 0);
            El.toggleClass("HasOnePage", TotalPages == 1);
            El.toggleClass("HasManyPages", TotalPages > 1);
            El.toggleClass("HasPrevPage", Options.PageIndex > 0);
            El.toggleClass("HasNextPage", Options.PageIndex < TotalPages - 1);
            var pages = JsArrayEx.generateNumbers(0, TotalPages);
            var pager = El.getAppend(".Pager");
            pager.getAppend("a.PrevPage").text("Prev").off().mousedown(e =>
            {
                e.preventDefault();
                Options.PageIndex--;
                Render();
            });
            var info = pager.getAppend(".PagerInfo");
            info.text(Options.PageIndex + 1 + " / " + TotalPages + " (Total: "+CurrentListBeforePaging.length+")");
            pager.getAppend("a.NextPage").text("Next").off().mousedown(e =>
            {
                e.preventDefault();
                Options.PageIndex++;
                Render();
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
        }




        public JsArray<T> CurrentListBeforePaging { get; set; }

        public T GetItem(jQuery el)
        {
            return el.closest("tr").DataItem<T>();
        }
        public static Grid<T> Get(jQuery el)
        {
            return el.data("Grid").As<Grid<T>>();
        }
    }
}



