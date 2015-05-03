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
            var ignoreWords = new HashSet<string>(StringComparer.CurrentCultureIgnoreCase) { "xvid","720p", "1080p", "dimension", "sample", "nfo", "par2" };
            var list = new List<string>();
            foreach (var token in tokens)
            {
                if (ignoreWords.Contains(token))
                    break;
                if (token.Length == 3)
                {
                    var season = TryParse(token.Substring(0, 1));
                    var episode = TryParse(token.Substring(1));
                    if(season!=null && episode!=null && episode<30)
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

    }
}