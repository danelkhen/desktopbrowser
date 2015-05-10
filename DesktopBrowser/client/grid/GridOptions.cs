using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.client.grid
{

    [JsType(JsMode.Json)]
    public class GridCol<T>
    {
        public JsString Name { get; set; }
        public JsNativeFunc<T, object> Prop { get; set; }
        public JsString Title { get; set; }
        public JsFunc<T, object> Getter { get; set; }
        public JsBoolean Visible { get; set; }
        public JsFunc<object, JsString> Format { get; set; }
        public JsFunc<object, JsString> ClassFunc { get; set; }
        public JsString Class { get; set; }
        public JsNumber Width { get; set; }
//        public CssStyleDeclaration Css { get; set; }

        public JsAction<GridCol<T>, T, jQuery> RenderCell  { get; set; }

        public JsAction<GridCol<T>, jQuery> RenderHeaderCell { get; set; }
    }
    [JsType(JsMode.Json)]
    public class GridCol<T, V> : GridCol<T>
    {
        public new JsNativeFunc<T, V> Prop { get; set; }
        public new JsFunc<T, V> Getter { get; set; }
        public new JsFunc<V, JsString> Format { get; set; }
        public new JsFunc<V, JsString> ClassFunc { get; set; }
    }


    [JsType(JsMode.Prototype, Filename = "~/res/js/grid.js")]
    public static class Extensions5
    {
        public static jQuery ToGrid<T>(this JsArray<T> list, jQuery j, GridOptions<T> opts)
        {
            opts.Items = list;
            return j.Grid(opts);
        }
    }

    [JsType(JsMode.Json)]
    public class GridOptions<T>
    {
        public JsArray<GridCol<T>> Columns { get; set; }
        public JsArray<T> Items { get; set; }
        public T FooterItem { get; set; }
        public JsNumber PageIndex { get; set; }
        public JsNumber PageSize { get; set; }
        public JsString Query { get; set; }
        public JsFunc<T, object> OrderBy { get; set; }
        public bool OrderByDesc { get; set; }
        public JsFunc<T, JsNumber, JsString> RowClass { get; set; }
    }
}