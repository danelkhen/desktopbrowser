using SharpKit.JavaScript;
using SharpKit.Html;
using SharpKit.jQuery;
using DesktopBrowser.Client;
using DesktopBrowser.Server;
using DesktopBrowser.Client.Utils;
using System.Collections.Generic;
using System;
namespace DesktopBrowser
{
    public partial class Default : System.Web.UI.Page
    {
        public IEnumerable<DesktopBrowser.Server.File> Files { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            Service = new SiteService();
            Req = SiteRequest.Load(Context.Request);
            File = Service.GetFile(Req.Path);
            Req.Path = File.Path;
            if (!File.IsFolder)
            {
                Service.Execute(File.Path);
            }
            else
            {
                var folder = File;
                Relatives = Service.GetFileRelatives(folder.Path);
                FilesGrid1.Req = Req;
                if (Req.View == "ImageList")
                {
                    if (Req.ImageListColumns == null)
                        Req.ImageListColumns = 5;
                    if (Req.ImageListRows == null)
                        Req.ImageListRows = 1;
                    Req.Take = Req.ImageListRows.Value * Req.ImageListColumns.Value;
                    if (Req.Skip == null)
                        Req.Skip = 0;
                    Files = Service.GetFiles(Req);
                    FilesImageList1.Files = Files;
                    FilesImageList1.Columns = Req.ImageListColumns.Value;
                }
                else
                {
                    if (Req.Take == null)
                        Req.Take = 300;
                    if (Req.Skip == null)
                        Req.Skip = 0;
                    Files = Service.GetFiles(Req);
                    FilesGrid1.Files = Files;
                }

            }
        }


        public SiteService Service { get; set; }

        public SiteRequest Req { get; set; }

        public File File { get; set; }

        public FileRelativesInfo Relatives { get; set; }
    }
    [JsType(JsMode.Prototype)]
    public class Keys
    {
        public static JsNumber Enter = 13;
        public static JsNumber PageUp = 33;
        public static JsNumber PageDown = 34;
        public static JsNumber End = 35;
        public static JsNumber Home = 36;
        public static JsNumber Up = 38;
        public static JsNumber Down = 40;
    }

    [JsType(JsMode.Json)]
    class DefaultClientData
    {
        public bool MoreAvailable { get; set; }
    }
    [JsType(JsMode.Global, Filename = "res/js/default.js")]
    public class DefaultClient : jQueryContext
    {
        [JsProperty(Export = false, NativeField=true)]
        static DefaultClientData Data { get;set; }
        static Selector<HtmlElement> Selector;
        static SiteProxy SiteProxy;
        static DefaultClient()
        {
            SiteProxy = new SiteProxy();
        }
        static void DefaultClient_Load()
        {
            if (Data.MoreAvailable.ExactEquals(false))
            {
                new jQuery(".Pager .Next").addClass("disabled").attr("disabled", "disabled");
            }
            Selector = new Selector<HtmlElement>();
            Selector.Selected = t =>
                {
                    t.className = "Selected";
                    SaveSelection(J(t).find(".NameCell A").text());
                };
            Selector.UnSelected = t => t.className = "";
            UpdateClock();
            RestoreSelection();
            new jQuery(window).keydown(e =>
                {
                    if (e.target != null && e.target.nodeName == "INPUT")
                        return;
                    if (e.which == Keys.Up)
                    {
                        e.preventDefault();
                        Up();
                    }
                    else if (e.which == Keys.Down)
                    {
                        e.preventDefault();
                        Down();
                    }
                    else if (e.which == Keys.PageDown)
                    {

                        e.preventDefault();
                        PageDown();
                    }
                    else if (e.which == Keys.PageUp)
                    {

                        e.preventDefault();
                        PageUp();
                    }
                    else if (e.which == Keys.Enter)
                    {

                        e.preventDefault();
                        Enter();
                    }
                    else
                    {
                        J("#tbSearch").get(0).focus();
                    }
                });

        }

        private static void WriteLine(object obj)
        {
            document.body.appendChild(document.createTextNode(obj.As<JsString>()));
            document.body.appendChild(document.createElement("br"));
        }

        static bool CanMoveSelection(int by) 
        { 
            return MoveSelection(by); 
        }
        static bool MoveSelection(int by, bool preview=false)
        {
            var by2 = by;
            var row = J(Selector.SelectedItem);
            if (row.length == 0)
                return false;
            while (by2 > 0)
            {
                if (row.next().length == 0)
                    break;
                row = row.next();
                by2--;
            }
            while (by2 < 0)
            {
                if (row.prev().length == 0)
                    break;
                row = row.prev();
                by2++;
            }
            if (row.length == 0 || by == by2)
                return false;
            if (!preview)
            {
                var row2 = row.get(0);
                Select(row2);
            }
            return true;
        }

        private static void Select(HtmlElement row)
        {
            Selector.Select(row);
            var pos = J(row).offset();
            //WriteLine("pos.Top=" + pos.top+ ",pageYOffset=" + window.pageYOffset + ",window.innerHeight=" + window.innerHeight);
            if (pos.top < window.pageYOffset)
            {
                row.scrollIntoView(true);
            }
            else if (pos.top > window.pageYOffset + window.innerHeight)
            {
                row.scrollIntoView(false);
            }
        }
        static int PageSize = 10;
        private static bool PageDown()
        {
            return MoveSelection(PageSize * 1);
        }

        private static bool PageUp()
        {
            return MoveSelection(PageSize * -1);
        }
        static bool Enter()
        {
            var anchor = J(Selector.SelectedItem).find("a").get(0);
            if (anchor.nodeName == "A")
            {
                SimulateClick(anchor.As<HtmlAnchorElement>());
                return true;
            }
            return false;
        }

        static bool SelectFirstItem()
        {
            var first = J("grdFiles TBODY TR").first().get(0);
            if (first != null)
            {
                Select(first);
                return true;
            }
            return false;
        }

        private static bool Down()
        {
            if (!MoveSelection(1))
                return SelectFirstItem();
            return false;
        }

        private static bool Up()
        {
            if (!MoveSelection(-1))
                return SelectFirstItem();
            return false;
        }

        static void RestoreSelection()
        {
            var folder = J("#tbFilename").val().As<JsString>();
            var filename = GetStorageItem(folder);// jQueryCookie.cookie(folder);
            if (filename != null && filename.length > 0)
            {
                J("#grdFiles .NameCell A").each((i, el) =>
                    {
                        var x = J(el);
                        if (x.text() == filename)
                        {
                            Selector.Select(x.parents("tr").first().get(0));
                            @return(false);
                        }
                    });
            }

        }

        static JsString GetStorageItem(JsString key)
        {
            return window.As<SharpKit.Html.Window>().localStorage.getItem(key).As<JsString>();
        }
        static void SetStorageItem(JsString key, JsString value)
        {
            window.As<SharpKit.Html.Window>().localStorage.setItem(key, value);
        }
        static void SaveSelection(JsString filename)
        {
            var folder = J("#tbFilename").val().As<JsString>();
            var nextYear = new JsDate();
            nextYear.setFullYear(nextYear.getFullYear() + 4);
            SetStorageItem(folder, filename);
            //jQueryCookie.cookie(folder, filename, new jQueryCookieOptions { expires = nextYear });
        }
        static void UpdateClock()
        {
            J("#divTime").text(new JsDate().format("h:MM tt"));
            J("#divDate").text(new JsDate().format("ddd, mmm d"));
            window.setTimeout(UpdateClock, 5000);
        }
        static void Execute(JsString path)
        {
            new SiteProxy().Execute(path, null);
        }
        static void OpenFile(JsString path)
        {
            new SiteProxy().Execute(path, null);
        }


        static JsString GetSelectedPath()
        {
            if(Selector.SelectedItem==null)
                return null;
            var filePath = J(Selector.SelectedItem).find(".ihFilePath").valString();
            //var dir = J("#tbFolder").valString();
            return filePath;// dir + "\\" + filename;
                
        }
        static void btnDelete_click()
        {
            var path = GetSelectedPath();
            if (path == null)
                return;
            if(!window.confirm("are you sure you want to permanantly delete the path: "+path))
                return;
            SiteProxy.Delete(path, t=>window.location.reload());
        }

        static void Filter(HtmlElement el, JsRegExp exp)
        {
            var x = J(el);
            x.parents("tr").first().toggle(x.text().search(exp) >= 0);
        }

        static void tbFolder_keydown(DOMEvent e)
        {
            if (e.As<KeyboardEvent>().keyCode == 13)
            {
                Go();
            }
        }

        static void Go()
        {
            var newPath = J("#tbFolder").val().As<JsString>();
            window.location.href = "?p=" + encodeURIComponent(newPath);
        }

        static void btnGo_click(DOMEvent e)
        {
            Go();
        }

        static void tbSearch_keyup(DOMEvent e)
        {
            var search = J("#tbSearch").val().As<JsString>();
            var exp = new JsRegExp(search.RegexEscape(), "i");
            J("#grdFiles .NameCell A").each((i, el) => Filter(el, exp));
        }

        static void SimulateClick(HtmlAnchorElement anchor)
        {
            var a = J(anchor);
            a.trigger("click", null);
            var href = a.attr("href");
            if (href != null && href.length > 0)
            {
                var target = a.attr("target");
                if (target == "_blank")
                    window.open(href, "");
                else
                    window.location.href = href;
            }

        }
    }
    [JsType(JsMode.Json)]
    public class Point
    {
        public JsNumber Top { get; set; }
        public JsNumber Left { get; set; }
    }

    [JsType(JsMode.Prototype)]
    public static class ClientExtensions
    {
        public static string RegexEscape(this JsString text)
        {
            return text.replace(new JsRegExp("[-[\\]{}()*+?.,\\\\^$|#\\s]", "g"), "\\$&");
        }
        [JsMethod(ExtensionImplementedInInstance = true, Export = false)]
        public static JsString format(this JsDate date, JsString format)
        {
            return null;
        }
    }


    [JsType(JsMode.Prototype, Filename = "res/Default.js", IgnoreGenericTypeArguments = true)]
    public class Selector<T> where T : class
    {
        [JsMethod(IgnoreGenericArguments = true)]
        public Selector()
        {
        }
        public JsAction<T> Selected { get; set; }
        public JsAction<T> UnSelected { get; set; }
        public void Select(T el)
        {
            if (SelectedItem == el)
                return;
            var unselected = SelectedItem;
            SelectedItem = el;
            if (unselected != null && UnSelected != null)
                UnSelected(unselected);
            if (SelectedItem != null && Selected != null)
                Selected(SelectedItem);
        }
        public T SelectedItem { get; set; }
    }


}