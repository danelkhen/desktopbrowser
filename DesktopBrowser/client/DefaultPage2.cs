using DesktopBrowser.client;
using DesktopBrowser.client.grid;
using DesktopBrowser.client.utils;
using DesktopBrowser.Server;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.client
{

    [JsType(JsMode.Prototype, Filename = "~/res/js/default2.js")]
    public class DefaultPage2
    {
        public DefaultPage2()
        {
            new jQuery(OnDomReady);
            Service = new SiteServiceClient();
            Path = @"C:\Temp";
        }

        public JsString Path { get; set; }
        public SiteServiceClient Service { get; set; }
        ListFilesResponse ListFilesResponse;

        private void OnDomReady()
        {
            ListFiles(RenderGrid);
        }

        void ListFiles(JsAction cb)
        {
            Service.ListFiles(new ListFilesRequest { Path = Path }, res =>
               {
                   ListFilesResponse = res;
                   cb.Trigger();
               });
        }

        void RenderGrid()
        {
            var gridEl = "body".ToJ().getAppend("#grdFiles.Grid");
            gridEl.off();
            var gridOptions = new GridOptions<File>
            {
                Items = ListFilesResponse.Files.AsJsArray(),
                Columns =
                    {
                        new GridCol<File> {Prop = t=>t.Name     ,    Width=null ,},
                        new GridCol<File> {Prop = t=>t.Modified ,    Width=150  , Format= v=>v.As<JsString>().ToDefaultDate().ToFriendlyRelative2()},
                        new GridCol<File> {Prop = t=>t.Size     ,    Width=150  ,},
                        new GridCol<File> {Prop = t=>t.Extension,    Width=150  ,},
                    },
            };
            gridEl.Grid(gridOptions);
            var grid = Grid<File>.Get(gridEl);

            gridEl.click(e =>
            {
                var file = grid.GetItem(e.target.ToJ());
                if (file == null)
                    return;
                HtmlContext.console.info(file);
                if (file.IsFolder)
                {
                    Path = file.Path;
                    ListFiles(RenderGrid);
                }
            });
        }

    }

}