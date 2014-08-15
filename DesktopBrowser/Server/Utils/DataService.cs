using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using SharpKit.JavaScript;
using System.Diagnostics;


namespace DesktopBrowser.Server.Utils
{
    public class DataServiceAttribute : Attribute
    {
    }

    public interface IDataService
    {
        void OnBeforeExecuteRequest();
    }

    public class DataService : IHttpHandler
    {
        static TraceSource Trace = new TraceSource("DesktopBrowser");
        protected HttpContext Context;
        HttpRequest Request;
        HttpResponse Response;

        protected MethodInvocationInfo Resolved;
        public void ProcessRequest(HttpContext context)
        {
            Context = context;
            Request = context.Request;
            Response = context.Response;
            var res = new DataServiceResponse();
            try
            {
                Authenticate();

                Response.ContentType = "text/plain";
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.Now.AddDays(3));

                ParseRequest();
                ResolveRequest();

                ExecuteRequest(res);
            }
            catch (Exception e)
            {
                res.Error = String.Concat(e.Message, "\r\n", e.StackTrace);
                Trace.TraceData(TraceEventType.Warning, 0, "Data Service: ProcessRequest.", res.Error);
            }
            Response.Write("return ");
            var js = Serialize(res);
            Response.Write(js);
            Response.Write(";");
        }

        private void ExecuteRequest(DataServiceResponse res)
        {
            try
            {
                var ids = Resolved.Object as IDataService;
                if (ids != null)
                    ids.OnBeforeExecuteRequest();
                res.ReturnValue = Resolved.Method.Invoke(Resolved.Object, Resolved.Parameters.ToArray());
            }
            catch (TargetInvocationException e)
            {
                res.Error = e.InnerException.Message;// String.Concat(e.InnerException.Message, "\r\n", e.InnerException.StackTrace);
                Trace.TraceEvent(TraceEventType.Warning,0,  "Data Service: ExecuteRequest. {0}", res.Error);
            }
            finally
            {
                if (Resolved.Object != null && req.InstanceSessionKey == null && Resolved.Object is IDisposable)
                    ((IDisposable)Resolved.Object).Dispose();
            }
        }

        private void ResolveRequest()
        {
            Resolved = new MethodInvocationInfo();
            Type type = null;
            if (req.InstanceSessionKey != null)
            {
                if (Context.Session == null)
                    throw new Exception("InstanceSessionKey can only be used with AuthenticatedSessionDataService, please modify your web.config file");
                Resolved.Object = Context.Session[req.InstanceSessionKey];
                type = Resolved.Object.GetType();
            }
            if (type == null)
            {
                type = Type.GetType(req.TypeName + ", " + req.AssemblyName, true);
            }
            if (type.GetCustomAttributes(typeof(DataServiceAttribute), true).OfType<DataServiceAttribute>().FirstOrDefault() == null)
                throw new Exception("Type " + type.FullName + " does not have a DataServiceAttribute");
            Resolved.Method = type.GetMethod(req.MethodName);
            if (!Resolved.Method.IsStatic && Resolved.Object == null)
                Resolved.Object = Activator.CreateInstance(type);
            Resolved.Parameters = new List<object>();
            var i = 0;
            var ser = new JavaScriptSerializer();
            foreach (var p in Resolved.Method.GetParameters())
            {
                object prm = null;
                var sPrm = req.Parameters[i];
                if (sPrm != null)
                {
                    if (p.ParameterType != typeof(string))
                    {
                        try
                        {
                            prm = ser.ConvertToType(p.ParameterType, sPrm);
                        }
                        catch (Exception e)
                        {

                            Trace.TraceEvent(TraceEventType.Warning, 0,  "Data Service: Could not parse parameter {0} to type {1}. Exception = {2}", sPrm, p.ParameterType, e);
                            throw new Exception("Could not parse parameter " + sPrm + " to type " + p.ParameterType, e);
                        }
                    }
                    else
                    {
                        prm = sPrm;
                    }
                }
                Resolved.Parameters.Add(prm);
                i++;
            }
        }

        private void ParseRequest()
        {
            var js = Request["req"];
            if (js != null)
            {
                var ser = new JavaScriptSerializer();
                req = ser.Deserialize<DataServiceRequest>(js);
            }
            else
            {
                req = new DataServiceRequest();
                req.InstanceSessionKey = Request["isk"];
                req.AssemblyName = Request["a"];
                req.TypeName = Request["t"];
                req.MethodName = Request["m"];
                req.Parameters = new List<object>();
                var i = 1;
                while (true)
                {
                    var sPrm = Request["p" + i];
                    if (sPrm == null)
                        break;
                    req.Parameters.Add(sPrm);
                    i++;
                }
            }
        }

        protected DataServiceRequest req;
        protected virtual void Authenticate()
        {
            //if (Request.IsAuthenticated == false)
            //  throw new Exception("Unauthenticated request, please login first.");
        }


        private static string Serialize(object res)
        {
            var serializer = new JavaScriptSerializer();
            var json = serializer.Serialize(res);
            var fixedJson = Regex.Replace(json, "\"\\\\\\/Date\\(([-0-9]+)\\)\\\\\\/\"", "new Date($1)");
            return fixedJson;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

    }

    static class ServerExtensions
    {

        static ServerExtensions()
        {
            ConvertToTypeMethod = typeof(JavaScriptSerializer).GetMember("ConvertToType", BindingFlags.Instance | BindingFlags.Public).OfType<MethodInfo>().Where(t => t.IsGenericMethodDefinition).First();
        }

        static MethodInfo ConvertToTypeMethod;
        public static object ConvertToType(this JavaScriptSerializer ser, Type type, object obj)
        {
            try
            {
                var x = ConvertToTypeMethod.MakeGenericMethod(type).Invoke(ser, new[] { obj });
                return x;
            }
            catch (TargetInvocationException e)
            {
                throw e.InnerException;
            }
        }

    }

    public class SessionDataService : DataService, IRequiresSessionState
    {

    }

    [JsType(JsMode.Json)]
    public class DataServiceRequest
    {
        public DataServiceRequest()
        {
            Parameters = new List<object>();
        }
        public string AssemblyName { get; set; }
        public string TypeName { get; set; }
        public string MethodName { get; set; }
        public string InstanceSessionKey { get; set; }
        public List<object> Parameters { get; set; }
    }


    public class MethodInvocationInfo
    {
        public object Object { get; set; }
        public MethodInfo Method { get; set; }
        public List<object> Parameters { get; set; }
    }
    [JsType(JsMode.Json)]
    public class DataServiceResponse
    {
        public string Error { get; set; }
        public object ReturnValue { get; set; }
    }
}
