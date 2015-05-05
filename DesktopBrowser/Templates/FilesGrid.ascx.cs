using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DesktopBrowser.Server;

namespace DesktopBrowser.Templates
{
    public partial class FilesGrid : System.Web.UI.UserControl
    {
        public IEnumerable<File> Files { get; set; }
        public SiteRequest Req { get; set; }
        public bool DisableFind { get; set; }
        public bool MoreAvailable { get; set; }
    }
}