using SharpKit.jQuery;
using SharpKit.JavaScript;

namespace DesktopBrowser.Client.Utils
{
    [JsType(JsMode.Prototype, Name="jQuery", Export=false)]
    public class jQueryCookie
    {
        public static void cookie(JsString name, JsString value, jQueryCookieOptions options=null)
        {
        }
        public static JsString cookie(JsString name)
        {
            return null;
        }
    }

    [JsType(JsMode.Json)]
    public class jQueryCookieOptions
    {
        public JsString path { get; set; }
        public JsDate expires { get; set; }
        public JsString domain { get; set; }
        public bool secure { get; set; }
    }
}