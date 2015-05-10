using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.client
{
    //[JsType(JsMode.Prototype, NativeOverloads = false)]
    [JsType(JsMode.Prototype)]
    public class PropHelper<T>
    {
        public JsString Prop(JsNativeFunc<T, object> prop)
        {
            return Utils.Prop<T>(prop);
        }

    }
    [JsType(JsMode.Prototype, NativeOverloads = false)]
    public static class Extensions2
    {


        //public static T firstOrAdd<T>(this JsArray<T> list, JsFunc<T, bool> predicate, JsFunc<T> creator)
        //{
        //    var obj = list.first(predicate);
        //    if (obj.As<object>() == null)
        //    {
        //        obj = creator();
        //        list.push(obj);
        //    }
        //    return obj;
        //}

        public static JsNumber ToFloatOrNull(this JsString s)
        {
            var x = JsContext.parseFloat(s);
            if (JsContext.isNaN(x))
                return null;
            return x;
        }
        public static JsNumber ToIntOrNull(this JsString s)
        {
            var x = JsContext.parseInt(s);
            if (JsContext.isNaN(x))
                return null;
            return x;
        }
        public static JsNumber Abs(this JsNumber x)
        {
            return JsMath.abs(x);
        }
        public static void ForEachWithPrev<T>(this JsArray<T> list, JsAction<T, T> action)
        {
            T prev = default(T);
            foreach (var item in list)
            {
                action(item, prev);
                prev = item;
            }
        }
        public static JsString ItemProp<T>(this JsArray<T> list, JsNativeFunc<T, object> prop)
        {
            return Utils.Prop<T>(prop);
        }
        public static JsDateEx ToDate(this JsString yyyy_mm_dd)
        {
            if (yyyy_mm_dd.isNullOrEmpty())
                return null;
            return JsDateEx.tryParseExact(yyyy_mm_dd, "yyyy-MM-dd");
        }
        public static JsString ToDefaultDateString(this JsDate date)
        {
            if (date == null)
                return null;
            return date.As<JsDateEx>().format("yyyy-MM-dd");
        }
        public static JsNumber ToDateValue(this JsString yyyy_mm_dd)
        {
            return ToDate(yyyy_mm_dd).valueOf();
        }

        public static void Trigger(this JsAction action)
        {
            if (action != null)
                action();
        }
        public static JsString GetPropertyName<T>(this T obj, JsNativeFunc<T, object> prop)
        {
            return Utils.Prop<T>(prop);
        }


        public static void InvokeAsyncParallel(this JsArray<JsAction<JsAction>> list, JsAction finalCallback)
        {
            var count = 0;
            var total = list.length;
            JsAction cb = () =>
            {
                count++;
                if (count == total)
                {
                    finalCallback.Trigger();
                }
            };
            list.forEach(t => t(cb));
        }

        public static jQuery GetCreateChildDivWithClass(this jQuery el, JsString className)
        {
            var ch = el.children("." + className);
            if (ch.length == 0)
                ch = new jQuery("<div/>").addClass(className).appendTo(el);
            return ch;
        }
        public static T DataItem<T>(this jQuery j)
        {
            return j.data("DataItem").As<T>();
        }

        //public static jQuery GetAppendRemove2<T>(this jQuery j, JsString selector, JsArray<T> list,  JsAction<jQuery, T> action)
        //{
        //    retu
        //    var els = j.getAppendRemove(selector, list.length);
        //    list.forEach((t, i) =>
        //        {
        //            var el = new jQuery(els[i]);
        //            action(el, t);
        //        });
        //    return els;
        //}
        //public static jQuery GetCreateChild(this jQuery el, JsString selector)
        //{
        //    var ch = el.children("." + className);
        //    if (ch.length == 0)
        //        ch = new jQuery("<div/>").addClass(className).appendTo(el);
        //    return ch;
        //}



    }


    [JsType(JsMode.Prototype, Export = false, Name = "Q")]
    public static class Q
    {
        public static bool isNotNullOrEmpty(this JsString s) { return false; }
        public static bool isNullOrEmpty(this JsString s) { return false; }
        public static bool isNullOrEmpty(this string s) { return false; }
        public static bool isNullOrEmpty<T>(this JsArray<T> s) { return false; }
        public static bool isNotNullOrEmpty<T>(this JsArray<T> s) { return false; }
        public static JsFunc<T, R> createSelectorFunction<T, R>(JsString selector) { return null; }



        public static T copy<T>(T from, T to, CopyOptions options)
        {
            throw new NotImplementedException();
        }
        public static T copy<T>(T from, T to)
        {
            throw new NotImplementedException();
        }
        public static T copy<T>(T from)
        {
            throw new NotImplementedException();
        }
        [JsMethod(Name = "copy")]
        public static object copy2(object from, object to)
        {
            throw new NotImplementedException();
        }
    }
    [JsType(JsMode.Prototype, Export = false, Name = "Object")]
    public class JsObjectEx : JsObject
    {
        public static JsArray<JsString> keys(object obj) { return null; }
        public static void forEach(object obj, JsAction<JsString, object> selector) { }

    }
    [JsType(JsMode.Prototype, Export = false, Name = "Array")]
    public class JsArrayEx : JsArray
    {
        internal static JsArray<JsNumber> generateNumbers(int p1, int p2)
        {
            throw new NotImplementedException();
        }
    }
}