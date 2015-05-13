using SharpKit.JavaScript;
using SharpKit.Html;
using SharpKit.jQuery;
using DesktopBrowser.client;
using DesktopBrowser.Server;
using DesktopBrowser.client.utils;
using System.Collections.Generic;
using System;
namespace DesktopBrowser
{
    public partial class Default : System.Web.UI.Page
    {
        public IEnumerable<File> Files { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            Service = new SiteService();
            Req = SiteRequest.Load(Context.Request);
            File = Service.GetFile(new PathRequest { Path = Req.Path });
            Req.Path = File.Path;
            if (!File.IsFolder)
            {
                Service.Execute(new PathRequest { Path = File.Path });
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

}