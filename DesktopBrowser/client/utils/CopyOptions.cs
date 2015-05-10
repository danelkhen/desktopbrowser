using SharpKit.JavaScript;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DesktopBrowser.client
{
    [JsType(JsMode.Json)]
    public class CopyOptions
    {
        public bool overwrite { get; set; }
    }
    [JsType(JsMode.Prototype, Export=false, Name="QueryString")]
    public class QueryString
    {

        public static JsString stringify(object q)
        {
            throw new NotImplementedException();
        }
    }
}
