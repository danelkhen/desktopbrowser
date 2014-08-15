using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using DesktopBrowser.Server;

namespace DesktopBrowser
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {

        }
        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            //var app = sender as Global;
            //if (app == null)
            //    return;
            //var context = app.Context;
            //if (context == null)
            //    return;
            //var tokens = context.Request.AppRelativeCurrentExecutionFilePath.Split('/').ToList();
            //tokens.RemoveAt(0);
            //if (tokens.Count == 0)
            //    return;
            //if (tokens[0].EqualsIgnoreCase("res") || tokens[0].Contains("."))
            //    return;
            //var newPath = "~/Default.aspx?p=";
            //if (tokens[0].EndsWith(":"))
            //{
            //    newPath += tokens.StringConcat("\\").ToQueryStringValue();
            //}
            //else
            //{
            //    newPath += tokens.StringConcat("\\", "\\", "").ToQueryStringValue();
            //}
            //context.RewritePath(newPath);

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}