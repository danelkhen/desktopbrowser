using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DesktopBrowser.Server;

namespace DesktopBrowser.Templates
{
    public partial class FilesImageList : System.Web.UI.UserControl
    {
        public FilesImageList()
        {
            Columns = 5;
        }
        public IEnumerable<File> Files { get; set; }

        public int Columns { get; set; }
        public File GetFirstImage(File folder)
        {
            var service = new SiteService();
            var innerFiles = service.GetFiles(new SiteRequest { Path = folder.Path });
            var image = innerFiles.Where(t => t.IsImage()).FirstOrDefault();
            if (image == null)
            {
                foreach (var folder2 in innerFiles.Where(t => t.IsFolder))
                {
                    image = GetFirstImage(folder2);
                    if (image != null)
                        break;
                }
            }
            return image;
        }
    }
}