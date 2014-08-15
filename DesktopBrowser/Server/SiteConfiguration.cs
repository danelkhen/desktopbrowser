using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DesktopBrowser.Server.Utils;

namespace DesktopBrowser.Server
{
    public class SiteConfiguration
    {
        public string Filename { get; private set; }
        public void Save()
        {
            new XmlSerializer().SerializeToFile(this, Filename);
        }
        public void SaveAs(string filename)
        {
            new XmlSerializer().SerializeToFile(this, filename);
        }
        public static SiteConfiguration Load()
        {
            var file = HttpContext.Current.Server.MapPath("~/SiteConfiguration.xml");
            if (!System.IO.File.Exists(file))
                return new SiteConfiguration();
            var config=  new XmlSerializer().DeserializeFromFile<SiteConfiguration>(file);
            config.Filename = file;
            return config;
        }
        public Page HomePage { get; set; }
    }


    public class Page
    {
        public Page()
        {
            Files = new List<File>();
        }
        public List<File> Files { get; set; }
    }
}