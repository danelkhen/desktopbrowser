using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Script.Serialization;

namespace DesktopBrowser.Server
{

    public class SiteServiceHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var obj = new SiteService();
            var type = obj.GetType();
            var action = context.Request.PathInfo.Substring(1);
            var mi = type.GetMethod(action);
            if (mi == null)
                throw new Exception("Action "+action + " not found");
            var pi = mi.GetParameters().FirstOrDefault();
            var prms = new List<object>();

            if(pi!=null)
            {
                object prm;
                if(context.Request.HttpMethod=="GET")
                {
                    var dic = new Dictionary<string, object>();
                    foreach(var key in context.Request.QueryString.AllKeys)
                    {
                        dic[key] = context.Request.QueryString[key];
                    }
                    prm = new JavaScriptSerializer().ConvertToType(dic, pi.ParameterType);

                }
                else
                {
                    var s = new StreamReader(context.Request.InputStream).ReadToEnd();
                    prm = new JavaScriptSerializer().Deserialize(s, pi.ParameterType);
                }
                prms.Add(prm);
            }

            string res;
            var status = 200;
            Exception error = null;
            object returnValue = null;
            try
            {
                returnValue = mi.Invoke(obj, prms.ToArray());
            }
            catch (TargetInvocationException e)
            {
                error = e.InnerException;
            }

            if (error != null)
            {
                var dic = new Dictionary<string, object>();
                dic["Message"] = error.Message;
                dic["Type"] = error.GetType().Name;
                res = new JavaScriptSerializer().Serialize(dic);
                status = 500;
            }
            else
            {
                res = new JavaScriptSerializer().Serialize(returnValue);

            }

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/json";
            context.Response.Write(res);
        }


    }
}