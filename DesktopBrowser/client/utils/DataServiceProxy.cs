using System;
using SharpKit.Html;
using SharpKit.JavaScript;
using DesktopBrowser.Server.Utils;
using SharpKit.jQuery;

namespace DesktopBrowser.client.utils
{
    [JsType(JsMode.Prototype)]
    public class DataServiceProxy
    {
        public DataServiceProxy()
        {
            DataServiceUrl = "DataService.ashx";
        }
        [JsMethod(Code = "if (window.XMLHttpRequest)\r\n  return new XMLHttpRequest();\r\n\r\nelse if (window.ActiveXObject)\r\n     return new ActiveXObject('MSXML2.XMLHTTP.3.0');\r\nelse\r\n    throw new Error('Your browser does not support ajax requests');")]
        static XMLHttpRequest CreateRequest()
        {
            return null;
        }
        static void WebGetAsync(string url, JsAction<XMLHttpRequest> callback)
        {
            var req = CreateRequest();
            req.open("GET", url, true);
            req.onreadystatechange = delegate
            {
                if (req.readyState == 4)
                {
                    callback(req);
                }
            };
            req.send((JsString)null);
        }

        static void WebPostFormAsync(string url, JsObject form, JsAction<XMLHttpRequest> callback)
        {
            var req = CreateRequest();
            req.open("POST", url, true);
            req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            req.onreadystatechange = delegate
            {
                if (req.readyState == 4)
                {
                    callback(req);
                }
            };
            var sb = new JsArray();
            SerializeForm(form, sb);
            req.send(sb.join(""));
        }

        private static void SerializeForm(JsObject form, JsArray sb)
        {
            var first = true;
            foreach (var p in form)
            {
                if (first)
                    first = false;
                else
                    sb.push("&");
                sb.push(p);
                sb.push("=");
                sb.push(HtmlContext.encodeURIComponent(form[p].As<JsString>()));
            }
        }

        public string DataServiceUrl { get; set; }
        public void InvokeAsync(DataServiceRequest req, JsAction<DataServiceResponse> callback, bool useGetMethod = false)
        {
            var callback2 = new JsAction<XMLHttpRequest>(t =>
            {
                var res = new DataServiceResponse();
                if (t.status == 200)
                {
                    var code = t.responseText;
                    res = JSON.parse(code).As<DataServiceResponse>();
                    //var func = new JsFunction(code).As<JsFunc<DataServiceResponse>>();
                    //try
                    //{
                    //    res = func();
                    //}
                    //catch (JsError e)
                    //{
                    //    res.Error = e.ToString();
                    //}
                }
                else
                {
                    res.Error = "Http error code " + t.status + ", " + t.statusText;
                }
                callback(res);
            });
            var url = DataServiceUrl;
            var sb = new JsArray();
            if (useGetMethod)
            {
                sb.push(url, "?z=z");
                SerializeToQueryString(req, sb);
                url = sb.join("");
                //jQuery.getJSON(url, (x, y, z) => alert(x + y + z));
                WebGetAsync(url, callback2);
            }
            else
            {
                //var body = new JsonSerializer().SerializeToString(req);
                var body = JSON.stringify(req);
                //jQuery.post(url, req, (x, y, z) => alert(x + y + z), "jsonp");
                WebPostFormAsync(url, new JsObject(new { req = body }), callback2);
            }

        }

        private static void SerializeToQueryString(DataServiceRequest req, JsArray sb)
        {
            if (req.AssemblyName != null)
                sb.push("&a=" + req.AssemblyName);
            if (req.TypeName != null)
                sb.push("&t=" + req.TypeName);
            if (req.MethodName != null)
                sb.push("&m=" + req.MethodName);
            if (req.InstanceSessionKey != null)
                sb.push("&isk=" + req.InstanceSessionKey);
            if (req.Parameters != null)
            {
                var prms = req.Parameters.As<JsArray>();
                for (var i = 0; i < prms.length; i++)
                {
                    sb.push("&p");
                    sb.push((i + 1).As<JsNumber>().toString());
                    sb.push("=");
                    sb.push(HtmlContext.encodeURIComponent(prms[i].As<JsObject>().toString()));
                }
            }
        }
    }

}
