using corexjs;
using SharpKit.JavaScript;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopBrowser.client
{
    [JsType(JsMode.Prototype)]
    static class SiteExtensions
    {
        public static JsString removeLast(this JsString s, JsNumber count)
        {
            if (count == null || count <= 0)
                return s;
            return s.substr(0, s.length - count);
        }

        public static JsDateEx ToDefaultDate(this JsString s)
        {
            if (s.isNullOrEmpty())
                return null;
            return JsDateEx.tryParseExact(s, new JsString[] { "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd" });
        }
        public static JsString ToDefaultDateString(this JsDate date)
        {
            if (date == null)
                return null;
            return date.As<JsDateEx>().format("yyyy-MM-dd");
        }
        public static JsString ToDefaultDateTimeString(this JsDate date)
        {
            if (date == null)
                return null;
            return date.As<JsDateEx>().format("yyyy-MM-dd HH:mm:ss");
        }

        public static string ToFriendlyRelative2(this JsDateEx dt, JsDateEx rel = null)
        {
            if (rel == null)
                rel = JsDateEx.current();
            if (dt.Year == rel.Year)
            {
                if (dt.Month == rel.Month)
                {
                    if (dt.Day == rel.Day)
                    {
                        return dt.format("HH:mm").toLowerCase();
                    }
                    return dt.format("MMM d");
                }
                return dt.format("MMM d");
            }
            return dt.format("d/M/yy");
        }

        static JsString toFriendlyNumber(this JsNumber x)
        {
            JsString s;
            if (x >= 0 && x < 10)
                s = x.toFixed(2);
            if (x >= 10 && x < 100)
                s = x.toFixed(1);
            else
   //         if (x >= 100 && x < 1000)
                s = x.toFixed(0);
            while (s.endsWith("0"))
                s = s.removeLast(1);
            if (s.endsWith("."))
                s = s.removeLast(1);
            return s;
        }

        public static JsString ToFriendlySize(this JsNumber bytes)
        {
            var kb = bytes / 1024.0;
            var mb = kb / 1024.0;
            var gb = mb / 1024.0;
            var tb = gb / 1024.0;
            if (kb < 1)
                return bytes.toFriendlyNumber();
            if (mb < 1)
                return kb.toFriendlyNumber() + " kb";
            if (mb < 1)
                return kb.toFriendlyNumber() + " kb";
            if (gb < 1)
                return mb.toFriendlyNumber() + " mb";
            if (tb < 1)
                return gb.toFriendlyNumber() + " gb";
            return tb.toFriendlyNumber() + " tb";
        }

    }
}
