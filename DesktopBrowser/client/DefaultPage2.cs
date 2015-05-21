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
            FileSelection = new Selection<File> { Changed = FileSelection_Changed };
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

            Buttons = new JsArray<Page2Button>
            {
                new Page2Button { Id = "GotoParentDir",   Text = "Up",          Action = () => GotoFolder(Res.Relatives.ParentFolder)},
                new Page2Button { Id = "GotoPrevSibling", Text = "Prev",        Action = () => GotoFolder(Res.Relatives.PreviousSibling)},
                new Page2Button { Id = "GotoNextSibling", Text = "Next",        Action = () => GotoFolder(Res.Relatives.NextSibling)},
                new Page2Button { Id = "Folders",         Text = "Folders",     Action = () => { Req.HideFolders=!Req.HideFolders; SaveReqListAndRender(); }                , IsActive=()=>Req.HideFiles},
                new Page2Button { Id = "Files",           Text = "Files",       Action = () => { Req.HideFiles=!Req.HideFiles; SaveReqListAndRender(); }                    , IsActive=()=>Req.HideFolders},
                new Page2Button { Id = "Mix",             Text = "Mix",         Action = () => { Req.MixFilesAndFolders=!Req.MixFilesAndFolders; SaveReqListAndRender(); }  , IsActive=()=>Req.MixFilesAndFolders },
                new Page2Button { Id = "Size",            Text = "Folder Size", Action = () => { Req.FolderSize=!Req.FolderSize; SaveReqListAndRender(); }                  , IsActive=()=>Req.FolderSize},
                new Page2Button { Id = "Keep",            Text = "Keep View",        Action = () => { Req.KeepView=!Req.KeepView; SaveReqListAndRender(); }                      , IsActive=()=>Req.KeepView},
                new Page2Button { Id = "Hidden",          Text = "Hidden",      Action = () => { Req.ShowHiddenFiles=!Req.ShowHiddenFiles; SaveReqListAndRender(); }        , IsActive=()=>Req.ShowHiddenFiles},
                new Page2Button { Id = "Recursive",       Text = "Recursive",   Action = () => { Req.IsRecursive=!Req.IsRecursive; SaveReqListAndRender(); }                , IsActive=()=>Req.IsRecursive},
                new Page2Button { Id = "Subs",            Text = "Subs",        Action = () => OpenInNewWindow(GetSubtitleSearchLink(Res.File)) },
                new Page2Button { Id = "Imdb",            Text = "Imdb",        Action = () => OpenInNewWindow(GetSubtitleSearchLink(Res.File)) },
                new Page2Button { Id = "Delete",          Text = "Delete",      Action = () => DeleteAndRefresh(FileSelection.SelectedItems.last())},
                new Page2Button { Id = "Explore",         Text = "Explore",     Action = () => Execute(Res.File, res=>HtmlContext.console.info(res))},
                //new Page2Button { Id = "ToggleView",      Text = "View",      Action = () => { Req.=!Req.HideFolders; SaveReqListAndRender(); } },
            };

            tbPath = grdFiles.getAppend("input.form-control.Path").change(e => GotoPath(tbPath.valString()));

            //Options = new Page2Options { p = "" };
            Req = new ListFilesRequest();
            DefaultReq = new ListFilesRequest
            {
                FolderSize = false,
                HideFiles = false,
                HideFolders = false,
                ImageListColumns = null,
                ImageListRows = null,
                IsRecursive = false,
                KeepView = false,
                MixFilesAndFolders = false,
                NoCache = false,
                Path = "",
                SearchPattern = "",
                ShowHiddenFiles = false,
                Skip = null,
                Sort = null,
                Take = null,
                View = null,
            };
            LoadReq();
            RenderButtons();
            CreateGrid();

            tbPath.val(Req.Path);
            ListFiles(Render);
            Win.onpopstate = e =>
            {
                LoadReq();
                ListAndRender();

            };
            //Win.onresize = e =>
            //{
            //    if (grdFiles2 != null)
            //        grdFiles2.Render();
            //};
            new jQuery(Win).keydown(Win_keydown);
        }


        private void Win_keydown(Event e)
        {
            FileSelection.KeyDown(e);
            if (e.isDefaultPrevented())
                return;
            if (e.keyCode == Keys.Enter)
            {
                var file = FileSelection.SelectedItems.last();
                if (file == null)
                    return;
                e.preventDefault();
                Open(FileSelection.SelectedItems.last());
            }

        }

        private void OpenInNewWindow(string p)
        {
            Win.open(p, "_blank");
        }

        private void LoadReq()
        {
            QueryString.parse(null, Req, DefaultReq);
            var req = Req.As<JsObject>();
            var defs = DefaultReq.As<JsObject>();
            JsObjectEx.keys(req).forEach(key =>
            {
                var value = req[key];
                var def = defs[key];

                if (JsContext.@typeof(def) == "boolean")
                {
                    if (value.As<string>() == "1")
                        req[key] = true;
                    else if (value.As<string>() == "0")
                        req[key] = false;
                    if (value.As<JsString>().isNullOrEmpty())
                        req[key] = def;
                }
                if (JsContext.@typeof(def) == "number" && value.As<JsString>().isNullOrEmpty())
                {
                    req[key] = JsContext.parseFloat(value.As<JsString>());
                }
            });
            var path = HtmlContext.decodeURI(HtmlContext.window.location.pathname);
            path = Path_LinuxToWin(path);
            Req.Path = path;
            HtmlContext.console.info("LoadReq", Req);
        }
        //Page2Options Options;

        private void RenderButtons()
        {
            btnGroup.getAppendRemoveForEach("button.btn.btn-default", Buttons, (el, btn) =>
            {
                btn.El = el;
                if (btn.Id != null)
                    btn.El.attr("id", btn.Id);
                btn.El.click(e =>
                {
                    btn.Action();
                    RefreshButtonState(btn);
                });
                btn.El.text(btn.Text);
                RefreshButtonState(btn);
            });
        }

        void RefreshButtonsState()
        {
            Buttons.forEach(RefreshButtonState);
        }

        void RefreshButtonState(Page2Button btn)
        {
            ToggleClass(btn.El, "active", btn.IsActive);
        }

        void ToggleClass(jQuery el, JsString className, JsFunc<bool> check)
        {
            if (check == null)
                return;
            var x = check().As<JsBoolean>();
            if (x == null)
                x = false;
            el.toggleClass(className, x);
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
            if (!Req.KeepView)
            {
                Req = new ListFilesRequest();
                RefreshButtonsState();
            }
            Req.Path = path;
            SaveReqListAndRender();
        }
        JsString Path_LinuxToWin(JsString path)
        {
            if (path.isNullOrEmpty())
                return path;
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
            return path;
        }
        JsString Path_WinToLinux(JsString path)
        {
            if (path.isNullOrEmpty())
                return path;
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
            return path;
        }
        void SaveReq()
        {
            var state = Q.copy(Req);
            var path = state.Path.AsJsString();
            path = Path_WinToLinux(path);

            JsContext.delete(state.Path);
            var state2 = state.As<JsObject>();
            var defs = DefaultReq.As<JsObject>();
            JsObjectEx.keys(state2).forEach(key =>
            {
                var val = state2[key];
                if (val == null || defs[key] == val)
                {
                    JsContext.delete(state2[key]);
                    return;
                }
                if (val.ExactEquals(true))
                    state2[key] = "1";
                else if (val.ExactEquals(false))
                    state2[key] = "0";
            });
            HtmlContext.console.info("SaveReq", state);
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
        void ListAndRender(JsAction cb = null)
        {
            ListFiles(()=>
            {
                Render();
                cb.Trigger();
            });
        }


        void Render()
        {
            tbPath.val(Path);
            RenderGrid();
        }

        void CreateGrid()
        {
            grdFiles.off();
            var gridOptions = new GridOptions<File>
            {
                //Items = Res.Files.AsJsArray(),
                Columns =
                    {
                        new GridCol<File> {Prop = t=>t.Name     ,    Width=null , RenderCell=RenderNameCell},
                        new GridCol<File> {Prop = t=>t.Modified ,    Width=150  , Format= FormatFriendlyDate},
                        new GridCol<File> {Prop = t=>t.Size     ,    Width=150  , Format= FormatFriendlySize},
                        new GridCol<File> {Prop = t=>t.Extension,    Width=150  ,},
                    },
                RowClass = GetRowClass,
                PageSize = 100,
                RenderFinished = () => FileSelection.AllItems = grdFiles2.CurrentList,
            };
            grdFiles2 = new Grid<File>(grdFiles, gridOptions);
            grdFiles2.Render();

            //grdFiles.Grid(gridOptions);
            //grdFiles2 = Grid<File>.Get(grdFiles);

            grdFiles.mousedown(e =>
            {
                var target = e.target.ToJ();
                var file = grdFiles2.GetItem(target);
                if (file == null)
                    return;
                FileSelection.Click(file, e.ctrlKey, e.shiftKey);
            });
            grdFiles.click(e =>
            {
                var target = e.target.ToJ();
                var file = grdFiles2.GetItem(target);
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
                var file = grdFiles2.GetItem(target);
                if (file == null)
                    return;
                e.preventDefault();
                Open(file);
            });
        }
        void RenderGrid()
        {
            if (grdFiles2 == null)
            {
                CreateGrid();
            }
            grdFiles2.Options.Items = Res.Files.AsJsArray();
            grdFiles2.Render();
            FileSelection.AllItems = grdFiles2.CurrentList;
            FileSelection.SelectedItems.clear();
            var selectedFileName = DefaultPage.RestoreSelection(Res.File.Name);
            if (selectedFileName.isNotNullOrEmpty())
            {
                var files = FileSelection.AllItems.where(t => t.Name == selectedFileName);
                FileSelection.SetSelection(files);
            }


            //var prevOptions = grdFiles2 != null ? grdFiles2.Options : new GridOptions<File>();
            //OrderBy = prevOptions.OrderBy,
            //    OrderByDesc = prevOptions.OrderByDesc,

        }

        Selection<File> FileSelection;

        private void FileSelection_Changed(SelectionChangedEventArgs<File> e)
        {
            e.Removed.forEach(grdFiles2.RenderRow);
            e.Added.forEach(grdFiles2.RenderRow);
            var file = FileSelection.SelectedItems.last();
            if (file == null)
                return;
            DefaultPage.SaveSelection2(Res.File.Name, file.Name);
        }

        private void DeleteAndRefresh(File file, JsAction cb=null)
        {
            if (file == null)
                return;
            var fileOrFolder = file.IsFolder ? "folder" : "file";
            if (!Win.confirm("Are you sure you wan to delete the "+fileOrFolder+"?\n"+file.Path))
                return;
            Service.Delete(new PathRequest { Path = file.Path }, res=>
            {
                ListAndRender(cb);
            });
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


        private JsString FormatFriendlyDate(object value)
        {
            return value.As<JsString>().ToDefaultDate().ToFriendlyRelative2();
        }
        private JsString FormatFriendlySize(object value)
        {
            return value.As<JsNumber>().ToFriendlySize();
        }

        private void RenderNameCell(GridCol<File> col, File file, jQuery td)
        {
            td.getAppend("a.Name").text(file.Name).attr("href", "javascript:void(0)");
        }

        private JsString GetRowClass(File file, JsNumber index)
        {
            var s = "FileRow";
            if (file.IsFolder)
                s += " IsFolder";
            if (file.IsFolder)
                s += " IsFile";
            if (FileSelection.SelectedItems.contains(file))
                s += " Selected";
            return s;
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



        public Grid<File> grdFiles2 { get; set; }
        public ListFilesRequest DefaultReq { get; private set; }
        internal JsArray<Page2Button> Buttons { get; private set; }
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
        public JsFunc<bool> IsActive { get; set; }
        public jQuery El { get; set; }
    }


}