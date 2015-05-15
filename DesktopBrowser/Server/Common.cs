using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using DesktopBrowser.Server.Utils;
using System.Globalization;

namespace DesktopBrowser.Server
{
    public static class Extensions
    {
        public static DateTime? ToDefaultDate(this string s)
        {
            DateTime dt;
            if (!DateTime.TryParseExact(s, DefaultDateFormat, null, DateTimeStyles.None, out dt))
                return null;
            return dt;
        }
        static string DefaultDateFormat = "yyyy-MM-dd HH:mm:ss";
        public static string ToDefaultString(this DateTime dt)
        {
            return dt.ToString(DefaultDateFormat);
        }
        public static string Active(this bool x)
        {
            if (x)
                return "active";
            return "";
        }
        public static string ToQueryStringValue(this string s)
        {
            if (s == null)
                return null;
            return HttpUtility.UrlEncode(s);
        }
        public static string ToHtmlAttributeValue(this string s)
        {
            if (s == null)
                return null;
            return HttpUtility.HtmlAttributeEncode(s);
        }
        public static string ToJavaScript(this object obj)
        {
            return new JavaScriptSerializer().Serialize(obj);
        }
        public static string ToFriendlyRelative(this DateTime? dt)
        {
            return ToFriendlyRelative(dt, DateTime.Now);
        }

        private static string ToFriendlyRelative(this DateTime? dt, DateTime rel)
        {
            if (dt == null)
                return null;
            var span = rel - dt.Value;
            if (span.TotalDays > 0)
            {
                var totalMonths = Math.Round(span.TotalDays / 30);
                var totalYears = Math.Round(span.TotalDays / 365);
                var totalWeeks = Math.Round(span.TotalDays / 7);
                if (totalYears >= 1)
                    return String.Format("{0:0} Years ago", totalYears);
                if (totalMonths >= 1)
                    return String.Format("{0:0} Months ago", totalMonths);
                if (totalWeeks >= 1)
                    return String.Format("{0:0} Weeks ago", totalWeeks);
                if (span.Days == 1)
                    return "Yesterday";
                if (span.Days > 1)
                    return String.Format("{0:0} Days ago", span.Days);
                if (totalWeeks == 1)
                    return "Last week";
                if (span.Hours >= 1)
                    return String.Format("{0:0} Hours ago", span.Hours);
                if (span.Minutes >= 1)
                    return String.Format("{0:0} Minutes ago", span.Minutes);
                if (span.Seconds > 0)
                    return String.Format("{0:0} Seconds ago", span.Seconds);
            }
            return "Right now";
        }
        public static string ToFriendlyRelative2(this DateTime? dt)
        {
            return ToFriendlyRelative2(dt, DateTime.Now);
        }

        private static string ToFriendlyRelative2(this DateTime? dt2, DateTime rel)
        {
            if (dt2 == null)
                return null;
            var dt = dt2.Value;
            if (dt.Year == rel.Year)
            {
                if (dt.Month == rel.Month)
                {
                    if (dt.Day == rel.Day)
                    {
                        return dt.ToString("hh:mm tt").ToLower();
                    }
                    return dt.ToString("MMM d");
                }
                return dt.ToString("MMM d");
            }
            return dt.ToString("d/M/yy");
        }
        public static string ToFriendlyRelative2(this string s)
        {
            return s.ToDefaultDate().ToFriendlyRelative2();

        }

        //public static string EncodeQueryStringValue(string s)
        //{
        //    return s.Replace("#", "%23").Replace("&", "%26").Replace("+", "%2B");
        //}
        public static string GetHref(this File file, SiteRequest req = null)
        {
            if (req == null)
            {
                var hc = HttpContext.Current;
                if (hc != null)
                    req = SiteRequest.Load(HttpContext.Current.Request);
                if (req == null)
                    req = new SiteRequest();
            }
            SiteRequest req2;
            if (req.KeepView)
                req2 = req.Clone(t => t.Skip = 0);
            else
                req2 = new SiteRequest();
            req2.Path = file.Path;
            return req2.ToString();
        }
        public static void Apply<T>(this T obj, Action<T> action)
        {
            action(obj);
        }
        static HashSet<string> ImageTypes = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase) { ".jpg", ".jpeg", ".png", ".bmp" };
        public static bool IsImage(this File file)
        {
            return !file.IsFolder && ImageTypes.Contains(new PathInfo(file.Path).Extension);
        }

        public static string GetFileContentHref(this File file)
        {
            return "File.ashx?p=" + file.Path.ToQueryStringValue();
        }
    }
}