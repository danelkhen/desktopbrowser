using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ReportApp.client.utils;

namespace ReportApp.client
{

    public class Obsolete
    {
        static Unit ParseUnit(JsString s)
        {
            if (s.IsNumber())
                return new Unit { Value = s.As<JsNumber>(), Type = "" };
            var type = s.match(new JsRegExp("[a-z]+"));


            var x = new Unit
            {
                Value = JsContext.parseInt(s),
                Type = type == null ? "".As<JsString>() : type[0],
            };
            return x;
        }



    }

}