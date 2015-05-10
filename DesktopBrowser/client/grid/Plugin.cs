using DesktopBrowser.client.grid;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharpKit.jQuery
{

    [JsType(JsMode.Prototype, Name = "jQuery", PrototypeName = "fn", OmitDefaultConstructor = true, Filename = "~/res/grid.js")]
    public class jQueryGridPlugin : jQuery
    {
        public jQuery Grid<T>(GridOptions<T> opts)
        {
            this.toArray().forEach(el =>
            {
                var el2 = new jQuery(el);
                var grid = el2.data("Grid").As<Grid<T>>();
                if (grid != null)
                {
                    grid.Options = opts;
                    grid.El = new jQuery(el);
                    grid.Render();
                }
                else
                {
                    grid = new Grid<T>(el2, opts);
                    el2.data("Grid", grid);
                    grid.Render();
                }
            });
            return this;
        }

    }

    [JsType(JsMode.Prototype, Name = "$", Export = false, Filename = "~/res/js/grid.js")]
    public static class Extensions4
    {
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery Grid<T>(this jQuery j, GridOptions<T> opts)
        {
            return null;
        }
    }
}