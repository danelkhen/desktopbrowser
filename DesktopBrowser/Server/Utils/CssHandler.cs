using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace DesktopBrowser.Server.Utils
{
    public class CssHandler : IHttpHandler
    {
        #region IHttpHandler Members

        public bool IsReusable
        {
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/css";
            var css = System.IO.File.ReadAllText(context.Request.PhysicalPath);
            var sb = new StringBuilder(css);
            var pallete = new { Darker = "Teal", Dark = "SteelBlue", Medium = "CadetBlue", Light = "PaleTurquoise", Lighter = "LightCyan" };
            pallete.GetType().GetProperties().ForEach(pe => sb.Replace(pe.Name, (string)pe.GetValue(pallete, null)));
            context.Response.Write(sb);
        }

        #endregion
    }
}