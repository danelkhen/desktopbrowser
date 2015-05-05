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
            if (Page.Relatives != null)
            {
                FolderMenu1.ParentFolder = Page.Relatives.ParentFolder;
                FolderMenu1.NextSibling = Page.Relatives.NextSibling;
                FolderMenu1.PrevSibling = Page.Relatives.PreviousSibling;
            }
            FolderMenu1.File = Page.File;
            FolderMenu1.Req = Page.Req;
            Finder1.Req = Page.Req;
            Pager1.SiteRequest = Page.Req;
            ShowGrid = Page.Req.Take != null && Page.Req.Skip != null;


        }
        public bool ShowGrid { get; set; }
        public new Default Page { get; set; }
    }
}