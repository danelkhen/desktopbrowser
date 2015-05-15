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
            ListFilesResponse = new ListFilesResponse
            {
                Relatives = new FileRelativesInfo { }
            };
        }

        public JsString Path { get { return Req.Path; } }
        public SiteServiceClient Service { get; set; }
        public jQuery El { get; set; }
        ListFilesResponse ListFilesResponse;
        private jQuery grdFiles;
        private jQuery tbPath;
        private jQuery btnGroup;

        private void OnDomReady()
        {
            El = "body".ToJ();
            grdFiles = El.getAppend("#grdFiles.Grid");
            btnGroup = grdFiles.getAppend(".btn-group");

            var btns = new JsArray<Page2Button>
            {
                new Page2Button { Id = "GotoParentDir",   Text = "Up",        Action = () => GotoFolder(ListFilesResponse.Relatives.ParentFolder)},
                new Page2Button { Id = "GotoPrevSibling", Text = "Prev",      Action = () => GotoFolder(ListFilesResponse.Relatives.PreviousSibling)},
                new Page2Button { Id = "GotoNextSibling", Text = "Next",      Action = () => GotoFolder(ListFilesResponse.Relatives.NextSibling)},
                new Page2Button { Id = "Folders",         Text = "Folders",   Action = () => { Req.HideFolders=!Req.HideFolders; SaveReqListAndRender(); } },
                new Page2Button { Id = "Files",           Text = "Files",     Action = () => { Req.HideFiles=!Req.HideFiles; SaveReqListAndRender(); } },
                new Page2Button { Id = "Mix",             Text = "Mix",       Action = () => { Req.MixFilesAndFolders=!Req.MixFilesAndFolders; SaveReqListAndRender(); } },
                new Page2Button { Id = "Size",            Text = "Size",      Action = () => { Req.FolderSize=!Req.FolderSize; SaveReqListAndRender(); } },
                new Page2Button { Id = "Keep",            Text = "Keep",      Action = () => { Req.KeepView=!Req.KeepView; SaveReqListAndRender(); } },
                new Page2Button { Id = "Hidden",          Text = "Hidden",    Action = () => { Req.ShowHiddenFiles=!Req.ShowHiddenFiles; SaveReqListAndRender(); } },
                new Page2Button { Id = "Recursive",       Text = "Recursive", Action = () => { Req.IsRecursive=!Req.IsRecursive; SaveReqListAndRender(); } },
                //new Page2Button { Id = "ToggleView",      Text = "View",      Action = () => { Req.=!Req.HideFolders; SaveReqListAndRender(); } },
                new Page2Button { Id = "Subs",            Text = "Subs",      Action = GotoNextSibling },
                new Page2Button { Id = "Imdb",            Text = "Imdb",      Action = GotoNextSibling },
                new Page2Button { Id = "Delete",          Text = "Delete",    Action = GotoNextSibling },
                new Page2Button { Id = "Explore",         Text = "Explore",   Action = GotoNextSibling },
            };
            btns.forEach(AddButton);

            tbPath = grdFiles.getAppend("input.form-control.Path");

            //Options = new Page2Options { p = "" };
            Req = new ListFilesRequest();
            QueryString.parse(null, Req);
            tbPath.val(Req.Path);
            ListFiles(Render);
        }
        //Page2Options Options;

        void AddButton(Page2Button btn)
        {
            btnGroup.getAppend("button.btn.btn-default#btn" + btn.Id).text(btn.Text).click(btn.Action);
        }


        ListFilesRequest Req;

        void ListFiles(JsAction cb)
        {
            Service.ListFiles(Req, res =>
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
            Req.Path = path;
            SaveReqListAndRender();
        }
        void SaveReq()
        {
            var state = Req;
            var q = QueryString.stringify(state);
            var win = HtmlContext.window;
            win.history.pushState(state, Req.Path, "?" + q);
        }

        void SaveReqListAndRender()
        {
            SaveReq();
            ListAndRender();
        }
        void ListAndRender()
        {
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
                    GotoFolder(file);
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

    [JsType(JsMode.Json)]
    class Page2Options
    {
        public JsString p { get; set; }
    }


    [JsType(JsMode.Json)]
    class Page2Button
    {

        public string Text { get; set; }

        public string Id { get; set; }

        public JsAction Action { get; set; }
    }


}