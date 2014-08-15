using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DesktopBrowser.Templates
{
    public partial class NavBar : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Page = base.Page as Default;
            if (Page.relatives != null)
            {
                FolderMenu1.parentFolder = Page.relatives.ParentFolder;
                FolderMenu1.nextSibling = Page.relatives.NextSibling;
                FolderMenu1.prevSibling = Page.relatives.PreviousSibling;
            }
            FolderMenu1.file = Page.file;
            FolderMenu1.req = Page.req;
            Finder1.req = Page.req;
            Pager1.SiteRequest = Page.req;
            showGrid = Page.req.Take != null && Page.req.Skip != null;


        }
        public bool showGrid { get; set; }
        public new Default Page { get; set; }
    }
}