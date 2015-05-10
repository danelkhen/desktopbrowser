using System.Collections.Generic;
using SharpKit.JavaScript;
using DesktopBrowser.client.utils;
using DesktopBrowser.Server.Utils;
using DesktopBrowser.Server;
using SharpKit.Html;

namespace DesktopBrowser.client
{

    [JsType(JsMode.Prototype)]
    public class SiteProxy
    {
        public void Execute(string path, JsAction<object> callback)
        {
            Invoke("Execute", new object[] { path }, callback.As<JsAction<object>>());
        }
        public void Delete(string path, JsAction<object> callback)
        {
            Invoke("Delete", new object[] { path }, callback.As<JsAction<object>>());
        }

        #region Utils
        public SiteProxy()
        {
            DataClient = new DataServiceProxy();
            //DataClient.DataServiceUrl = SiteClient.BaseUrl + "DataService.ashx";
        }
        DataServiceProxy DataClient;
        [JsMethod(IgnoreGenericArguments=true)]
        protected virtual void Invoke<T>(string methodName, JsArray prms, JsAction<T> callback)
        {
            var req = new DataServiceRequest
            {
                AssemblyName = "DesktopBrowser",
                TypeName = "DesktopBrowser.Server.SiteService",
                MethodName = methodName,
                Parameters = prms.As<List<object>>()
            };
            DataClient.InvokeAsync(req, t =>
            {
                if (t.Error != null)
                {
                    HtmlContext.alert(t.Error);
                }
                else
                {
                    if(callback!=null)
                        callback(t.ReturnValue.As<T>());
                }
            });

        }
        #endregion

    }



}
