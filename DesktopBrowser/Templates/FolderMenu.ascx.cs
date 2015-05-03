using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DesktopBrowser.Server;

namespace DesktopBrowser.Templates
{
    public partial class FolderMenu : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Page = base.Page as Default;
            InitMenu();
        }
        public new Default Page { get; set; }

        public SiteRequest req { get; set; }

        public File prevSibling { get; set; }
        public File parentFolder { get; set; }
        public File nextSibling { get; set; }

        public string GetSubtitleSearchLink()
        {
            if (file == null)
                return null;
            var s = GetFilenameForSearch(file.Name);
            return "https://www.google.com/search?q=" + HttpUtility.UrlEncode(s + " eng subscene");
        }
        public string GetGoogleSearchLink()
        {
            if (file == null)
                return null;
            var s = GetFilenameForSearch(file.Name);
            return "https://www.google.com/search?q=" + HttpUtility.UrlEncode(s);
        }



        string GetFilenameForSearch(string s)
        {
            //s = s.Replace(".", " ").Replace("-", " ");
            var tokens = s.Split(' ', '.', '-');
            var ignoreWords = new HashSet<string>(StringComparer.CurrentCultureIgnoreCase) { "xvid", "720p", "1080p", "dimension", "sample", "nfo", "par2" };
            var list = new List<string>();
            foreach (var token in tokens)
            {
                if (ignoreWords.Contains(token))
                    break;
                if (token.Length == 3)
                {
                    var season = TryParse(token.Substring(0, 1));
                    var episode = TryParse(token.Substring(1));
                    if (season != null && episode != null && episode < 30)
                    {
                        var normalized = String.Format("S{0:00}E{1:00}", season, episode);
                        list.Add(normalized);
                        break;
                    }
                }
                list.Add(token);
            }
            var s2 = String.Join(" ", list.ToArray());
            return s2;
        }

        //<a href="my name is "shooki". "
        int? TryParse(string s)
        {
            int x;
            if (!int.TryParse(s, out x))
                return null;
            return x;
        }

        public File file { get; set; }


        string Att(string name, object value)
        {
            if (value == null || name == "text")
                return "";
            if (name == "className")
                name = "class";
            var sValue = value.ToString();
            var s = name;
            s = name + "=\"" + HttpUtility.HtmlEncode(sValue) + "\"";
            return s;
        }

        public string RenderMenu()
        {
            return Menu.Select(RenderMenuItem).StringJoin("\n");
        }
        public string RenderMenuItem(MenuItem mi)
        {
            return "<a " + mi.GetType().GetProperties().Select(pi => Att(pi.Name, pi.GetValue(mi))).StringJoin(" ") + ">" + mi.text + "</a>";
        }
        public List<MenuItem> Menu { get; set; }
        public void InitMenu()
        {
            Menu = new List<MenuItem>
            {
                new MenuItem { href=parentFolder.IfNotNull(t=> t.GetHref(req)), title=parentFolder.IfNotNull(t=> t.Path), text="Up"},
                new MenuItem { href=prevSibling.IfNotNull(t=> t.GetHref(req)) , title=prevSibling.IfNotNull(t=> t.Path), text="Prev"},
                new MenuItem { href=nextSibling.IfNotNull(t=> t.GetHref(req)) , title=nextSibling.IfNotNull(t=> t.Path), text="Next"},
                new MenuItem { className=req.HideFolders.Active(),                   href=req.Clone(t=>t.HideFolders=!t.HideFolders).GetHref(),               title="Shows or hides folders"                        , text="Folders"},
                new MenuItem { className=req.HideFiles.Active(),                     href=req.Clone(t=>t.HideFiles=!t.HideFiles).GetHref(),                   title="Shows or hides files"                              , text="Files"},
                new MenuItem { className=req.MixFilesAndFolders.Active(),            href=req.Clone(t=>t.MixFilesAndFolders=!t.MixFilesAndFolders).GetHref(), title="Disables Folder grouping"        , text="Mix"},
                new MenuItem { className=req.FolderSize.Active(),                    href=req.Clone(t=>t.FolderSize=!t.FolderSize).GetHref(),                 title="Calculates folder sizes"                         , text="Folders Size"},
                new MenuItem { className=req.KeepView.Active(),                      href=req.Clone(t=>t.KeepView=!t.KeepView).GetHref(),                     title="Keeps the same view when navigating to other folders", text="Keep View"},
                new MenuItem { className=req.ShowHiddenFiles.Active(),               href=req.Clone(t=>t.ShowHiddenFiles=!t.ShowHiddenFiles).GetHref(),         title="Shows or hides hidden files"   , text="Hidden"},
                new MenuItem { className=req.IsRecursive.Active(),                   href=req.Clone(t=>t.IsRecursive=!t.IsRecursive).GetHref(),         title="Recursively shows all files"           , text="Recursive"},
                new MenuItem { className=req.View=="ImageList" ? "Selected" : "",    href=req.ToggleImageListView().GetHref(),         title="Changes the view mode"                                  , text="Image View"},
                new MenuItem {                                                       href=GetSubtitleSearchLink(), target="_blank"                                                          , text="Subs"},
                new MenuItem {                                                       href=GetGoogleSearchLink(), target="_blank"                                                            , text="Imdb"},
                new MenuItem { onclick="btnDelete_click(event);", title="Delete", text="Delete"},
                new MenuItem { onclick="OpenFile("+req.Path.ToJavaScript().ToHtmlAttributeValue()+");", title="Open folder in windows exlorer", text="Explore"},
            };
            Menu.ForEach(mi =>
            {
                if (mi.className == null)
                    mi.className = "";
                if (mi.className.Length > 0)
                    mi.className += " ";
                mi.className += "btn btn-default";
            });

        }

    }
    public class MenuItem
    {

        public string href { get; set; }

        public string title { get; set; }

        public string text { get; set; }

        public string className { get; set; }

        public string onclick { get; set; }

        public string target { get; set; }
    }


}