using corexjs.ui.grid;
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
            Res = new ListFilesResponse
            {
                Relatives = new FileRelativesInfo { }
            };
        }

        public JsString Path { get { return Req.Path; } }
        public SiteServiceClient Service { get; set; }
        public jQuery El { get; set; }
        ListFilesResponse Res;
        private jQuery grdFiles;
        private jQuery tbPath;
        private jQuery btnGroup;

        private void OnDomReady()
        {
            Win = HtmlContext.window;
            El = "body".ToJ();
            grdFiles = El.getAppend("#grdFiles.Grid");
            btnGroup = grdFiles.getAppend(".btn-group");

            var btns = new JsArray<Page2Button>
            {
                new Page2Button { Id = "GotoParentDir",   Text = "Up",        Action = () => GotoFolder(Res.Relatives.ParentFolder)},
                new Page2Button { Id = "GotoPrevSibling", Text = "Prev",      Action = () => GotoFolder(Res.Relatives.PreviousSibling)},
                new Page2Button { Id = "GotoNextSibling", Text = "Next",      Action = () => GotoFolder(Res.Relatives.NextSibling)},
                new Page2Button { Id = "Folders",         Text = "Folders",   Action = () => { Req.HideFolders=!Req.HideFolders; SaveReqListAndRender(); } },
                new Page2Button { Id = "Files",           Text = "Files",     Action = () => { Req.HideFiles=!Req.HideFiles; SaveReqListAndRender(); } },
                new Page2Button { Id = "Mix",             Text = "Mix",       Action = () => { Req.MixFilesAndFolders=!Req.MixFilesAndFolders; SaveReqListAndRender(); } },
                new Page2Button { Id = "Size",            Text = "Size",      Action = () => { Req.FolderSize=!Req.FolderSize; SaveReqListAndRender(); } },
                new Page2Button { Id = "Keep",            Text = "Keep",      Action = () => { Req.KeepView=!Req.KeepView; SaveReqListAndRender(); } },
                new Page2Button { Id = "Hidden",          Text = "Hidden",    Action = () => { Req.ShowHiddenFiles=!Req.ShowHiddenFiles; SaveReqListAndRender(); } },
                new Page2Button { Id = "Recursive",       Text = "Recursive", Action = () => { Req.IsRecursive=!Req.IsRecursive; SaveReqListAndRender(); } },
                new Page2Button { Id = "Subs",            Text = "Subs",      Action = () => OpenInNewWindow(GetSubtitleSearchLink(Res.File)) },
                new Page2Button { Id = "Imdb",            Text = "Imdb",      Action = () => OpenInNewWindow(GetSubtitleSearchLink(Res.File)) },
                new Page2Button { Id = "Delete",          Text = "Delete",    Action = GotoNextSibling },
                new Page2Button { Id = "Explore",         Text = "Explore",   Action = () => Execute(Res.File, res=>HtmlContext.console.info(res))},
                //new Page2Button { Id = "ToggleView",      Text = "View",      Action = () => { Req.=!Req.HideFolders; SaveReqListAndRender(); } },
            };
            btns.forEach(AddButton);

            tbPath = grdFiles.getAppend("input.form-control.Path").change(e => GotoPath(tbPath.valString()));

            //Options = new Page2Options { p = "" };
            Req = new ListFilesRequest();
            LoadReq();

            tbPath.val(Req.Path);
            ListFiles(Render);
            Win.onpopstate = e =>
            {
                LoadReq();
                ListAndRender();

            };
        }

        private void OpenInNewWindow(string p)
        {
            Win.open(p, "_blank");
        }

        private void LoadReq()
        {
            QueryString.parse(null, Req);
            var path = HtmlContext.decodeURI(HtmlContext.window.location.pathname);
            if (path == "/")
            {
                path = "";
            }
            else if (path.startsWith("//"))
            {
                var tokens = path.split('/');
                path = tokens.join("\\");
            }
            else
            {
                path = path.substr(1); //skip first / to get real drive name
                var tokens = path.split('/');
                tokens[0] += ":";
                path = tokens.join("\\");
            }
            if (path.endsWith("\\"))
                path = path.removeLast(1);
            Req.Path = path;
        }
        //Page2Options Options;

        void AddButton(Page2Button btn)
        {
            btnGroup.getAppend("button.btn.btn-default#btn" + btn.Id).text(btn.Text).click(btn.Action);
        }


        ListFilesRequest Req;
        private Window Win;

        void ListFiles(JsAction cb)
        {
            Service.ListFiles(Req, res =>
               {
                   Res = res;
                   cb.Trigger();
               });
        }

        void GotoPrevSibling()
        {
            GotoFolder(Res.Relatives.PreviousSibling);
        }
        void GotoNextSibling()
        {
            GotoFolder(Res.Relatives.NextSibling);
        }
        void GotoParentDir()
        {
            GotoFolder(Res.Relatives.ParentFolder);
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
            var state = Q.copy(Req);
            var path = state.Path.AsJsString();
            if (path.length > 0)
            {
                var isNetworkShare = path.startsWith("\\\\");
                if (isNetworkShare)//network share
                    path = path.substr(1);
                var tokens = path.split('\\');//.where(t=>t.length>0);
                if (!isNetworkShare)
                    tokens[0] = tokens[0].replaceAll(":", "");
                //tokens[0] = tokens[0].replaceAll(":", "");
                //tokens = tokens;
                path = tokens.join("/");
                //path = path.replaceAll(":\\", "/").replaceAll("\\", "/");
                //path = "/" + path;
                path = HtmlContext.encodeURI(path);
                path = "/" + path;
                //if (!path.startsWith("/"))
                //    path = "/" + path;
                if (!path.endsWith("/"))
                    path += "/";

            }

            JsContext.delete(state.Path);
            var q = QueryString.stringify(state);
            if (q.isNotNullOrEmpty())
                q = "?" + q;
            var url = HtmlContext.location.origin + path + q;
            var win = HtmlContext.window;
            //win.history.pushState(state, Req.Path, "?" + q);
            win.history.pushState(state, Req.Path, url);
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
                Items = Res.Files.AsJsArray(),
                Columns =
                    {
                        new GridCol<File> {Prop = t=>t.Name     ,    Width=null , RenderCell=RenderNameCell},
                        new GridCol<File> {Prop = t=>t.Modified ,    Width=150  , Format= FormatFriendlyDate},
                        new GridCol<File> {Prop = t=>t.Size     ,    Width=150  ,},
                        new GridCol<File> {Prop = t=>t.Extension,    Width=150  ,},
                    },
                RowClass = GetRowClass,
                PageSize = 100,
            };
            grdFiles.Grid(gridOptions);
            var grid = Grid<File>.Get(grdFiles);

            grdFiles.mousedown(e =>
            {
                var target = e.target.ToJ();
                var file = grid.GetItem(target);
                if (file == null)
                    return;
                ClickFile(file, e.ctrlKey, e.shiftKey);
            });
            grdFiles.click(e =>
            {
                var target = e.target.ToJ();
                var file = grid.GetItem(target);
                if (file == null)
                    return;
                if (!target.@is("a.Name"))
                    return;
                e.preventDefault();
                Open(file);
            });
            grdFiles.dblclick(e =>
            {
                var target = e.target.ToJ();
                var file = grid.GetItem(target);
                if (file == null)
                    return;
                e.preventDefault();
                Open(file);
            });
        }

//        JsArray<File> SelectedFiles = new JsArray<File>();
        File ActiveFile{get;set;}
        //{
        //    get
        //    {
        //        return SelectedFiles[0];
        //    }
        //    set
        //    {
        //        SelectedFiles.push(value);
        //    }
        //}
        private void ClickFile(File file, bool ctrl, bool shift)
        {
            if(ctrl)
            {
                if (ActiveFile == file)
                    ActiveFile = null;
                else
                    ActiveFile = file;
            }
            else if (shift)
            {
                ActiveFile = file;
            }
            else
            {
                ActiveFile = file;
            }


        }


        void Open(File file)
        {
            if (file == null)
                return;
            if (file.IsFolder)
            {
                GotoFolder(file);
                return;
            }
            var prompt = false;
            if (file.Extension != null)
            {
                var ext = file.Extension.AsJsString().toLowerCase();
                var blackList = new JsArray<JsString> { ".exe", ".bat", ".com", };
                if (blackList.contains(ext))
                {
                    prompt = true;
                }
            }
            else
            {
                prompt = true;
            }
            if (prompt && !Win.confirm("This is an executable file, are you sure you want to run it?"))
                return;
            Execute(file, res => HtmlContext.console.info(res));
        }

        void Execute(File file, JsAction<object> cb)
        {
            Service.Execute(new PathRequest { Path = file.Path }, cb);
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


        public string GetSubtitleSearchLink(File File)
        {
            if (File == null)
                return null;
            var s = GetFilenameForSearch(File.Name);
            return "https://www.google.com/search?q=" + HtmlContext.encodeURIComponent(s + " eng subscene");
        }
        public string GetGoogleSearchLink(File File)
        {
            if (File == null)
                return null;
            var s = GetFilenameForSearch(File.Name);
            return "https://www.google.com/search?q=" + HtmlContext.encodeURIComponent(s);
        }
        string GetFilenameForSearch(JsString s)
        {
            //s = s.Replace(".", " ").Replace("-", " ");
            var tokens = s.split(new JsRegExp(@"[ \.\-]")).select(t => t.toLowerCase());
            var ignoreWords = new JsArray<JsString> { "xvid", "720p", "1080p", "dimension", "sample", "nfo", "par2" }.selectToObject(t => t, t => true);
            var list = new JsArray<JsString>();
            foreach (var token in tokens)
            {
                if (ignoreWords[token])
                    break;
                if (token.length == 3)
                {
                    var season = TryParse(token.substr(0, 1));
                    var episode = TryParse(token.substr(1));
                    if (season != null && episode != null && episode < 30)
                    {
                        var normalized = "S" + season.format("00") + "E" + episode.format("00");
                        list.Add(normalized);
                        break;
                    }
                }
                list.Add(token);
            }
            var s2 = list.join(" ");// String.Join(" ", list.ToArray());
            return s2;
        }

        JsNumber TryParse(string s)
        {
            var x = JsContext.parseInt(s);
            if (x.IsNaN())
                return null;
            return x;
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