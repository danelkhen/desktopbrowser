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
            ListFilesResponse = new ListFilesResponse
            {
                Relatives = new FileRelativesInfo { }
            };
        }

        public JsString Path { get; set; }
        public SiteServiceClient Service { get; set; }
        public jQuery El { get; set; }
        ListFilesResponse ListFilesResponse;
        private jQuery grdFiles;
        private jQuery tbPath;

        private void OnDomReady()
        {
            El = "body".ToJ();
            El.getAppend("button#btnGotoParentDir.btn.btn-default").text("Parent").click(e => GotoParentDir());
            El.getAppend("button#btnGotoPrevSibling.btn.btn-default").text("Prev").click(e => GotoPrevSibling());
            El.getAppend("button#btnGotoNextSibling.btn.btn-default").text("Next").click(e => GotoNextSibling());
            tbPath = El.getAppend("input.form-control.Path");
            grdFiles = El.getAppend("#grdFiles.Grid");

            tbPath.val(Path);
            ListFiles(Render);
        }

        void ListFiles(JsAction cb)
        {
            Service.ListFiles(new ListFilesRequest { Path = Path }, res =>
               {
                   ListFilesResponse = res;
                   cb.Trigger();
               });
        }

        void GotoPrevSibling()
        {
            GotoFolder(ListFilesResponse.Relatives.PreviousSibling);
        }
        void GotoNextSibling()
        {
            GotoFolder(ListFilesResponse.Relatives.NextSibling);
        }
        void GotoParentDir()
        {
            GotoFolder(ListFilesResponse.Relatives.ParentFolder);
        }

        void GotoFolder(File file)
        {
            if (file == null || !file.IsFolder)
                return;
            GotoPath(file.Path);
        }

        void GotoPath(JsString path)
        {
            //if (!path.endsWith("\\"))
            //    path += "\\";
            Path = path;
            ListFiles(Render);
        }


        void Render()
        {
            tbPath.val(Path);
            RenderGrid();
        }

        void RenderGrid()
        {
            grdFiles.off();
            var gridOptions = new GridOptions<File>
            {
                Items = ListFilesResponse.Files.AsJsArray(),
                Columns =
                    {
                        new GridCol<File> {Prop = t=>t.Name     ,    Width=null , RenderCell=RenderNameCell},
                        new GridCol<File> {Prop = t=>t.Modified ,    Width=150  , Format= FormatFriendlyDate},
                        new GridCol<File> {Prop = t=>t.Size     ,    Width=150  ,},
                        new GridCol<File> {Prop = t=>t.Extension,    Width=150  ,},
                    },
                RowClass = GetRowClass,
            };
            grdFiles.Grid(gridOptions);
            var grid = Grid<File>.Get(grdFiles);

            grdFiles.click((JsAction<Event>)(e =>
            {
                var target = e.target.ToJ();
                var file = grid.GetItem(target);
                if (file == null)
                    return;
                HtmlContext.console.info(file);
                if (file.IsFolder && target.@is("a.Name"))
                {
                    Path = file.Path;
                    ListFiles((JsAction)this.Render);
                }
            }));
        }

        private JsString FormatFriendlyDate(object arg)
        {
            return arg.As<JsString>().ToDefaultDate().ToFriendlyRelative2();
        }

        private void RenderNameCell(GridCol<File> col, File file, jQuery td)
        {
            td.getAppend("a.Name").text(file.Name).attr("href", "javascript:void(0)");
        }

        private JsString GetRowClass(File file, JsNumber index)
        {
            if (file.IsFolder)
                return "FolderRow";
            return "FileRow";
        }
    }

}