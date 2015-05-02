using System;
using System.Collections;
using System.Collections.Generic;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;

namespace DesktopBrowser.Client.Utils
{


    [JsType(JsMode.Global, OrderInFile=-1)]
    public class Utils : jQueryContext
    {

        static Utils()
        {
            IsIE6 = ((window.navigator.userAgent.indexOf("MSIE 6.") != -1) && (window.navigator.userAgent.indexOf("Opera") == -1));
            IsWebKit = (window.navigator.userAgent.indexOf("AppleWebKit") != -1);
        }
        public static bool IsIE6 { get; set; }
        public static bool IsWebKit { get; set; }

        #region Templating
        public static HtmlElement ApplyExactTemplate(HtmlElement el, HtmlElement template)
        {
            if (el.getAttribute("_IsTemplated").As<bool>())
                return null;
            el.setAttribute("_IsTemplated", true.As<JsString>());
            var tmp = template.cloneNode(true).As<HtmlElement>();
            tmp.id = "";
            J(el).replaceWith(tmp);
            J("#Element", tmp).replaceWith(el);
            return tmp;
        }
        /// <summary>
        /// _IsTemplated attribute applies to:
        /// template element containers
        /// template elements, 
        /// cloned template elements
        /// and template content elements
        /// It enables the use of the same css name and prevents recursion
        /// </summary>
        public static void ApplyTemplates()
        {
            J("#Templates").children().each((i, templateEl) =>
            {
                templateEl.setAttribute("_IsTemplated", true.As<JsString>());
                var className = "." + templateEl.id;
                J(className).each((index, t) => ApplyExactTemplate(t, templateEl));

            });
        }

        public static HtmlElement ApplyTemplate(HtmlElement el)
        {
            var className = el.className;
            if (className.length > 0)
            {
                var templateEl = document.getElementById(className).As<HtmlElement>();
                if (templateEl != null && templateEl.parentElement.As<HtmlElement>().id == "Templates")
                    return ApplyExactTemplate(el, templateEl);
            }
            return null;
        }

        #endregion

        public static JsObject ParseQueryString(JsString search)
        {
            var obj = new JsObject<JsString>();
            var pairs = search.substring(1).split("&");
            foreach (var pair in pairs)
            {
                var tokens = pair.split("=");
                obj[decodeURIComponent(tokens[0])] = decodeURIComponent(tokens[1]);
            }
            return obj;
        }

        public static JsObject GetFormData(object inputMappings, JsString suffix = null)
        {
            var obj2 = inputMappings.As<JsObject>();
            var data = new JsObject();
            foreach (var p in obj2)
            {
                var id = obj2[p].As<JsString>();
                if (suffix != null)
                    id += suffix;
                var input = document.getElementById(id).As<HtmlInputElement>();
                if (input == null)
                    continue;
                if (input.type == "checkbox")
                    data[p] = input.@checked;
                else
                    data[p] = input.value;
            }
            return data;
        }
        public static JsArray<JsObject> GetRepeatedFormData(object inputMappings)
        {

            var list = new JsArray<JsObject>();
            JsNumber i = 0;
            while (true)
            {
                i++;
                var data = GetFormData(inputMappings, i.toString());
                if (data == null)
                    return list;
                list.push(data);
            }
        }

        public static void FixBrowserCompatibilityIssues()
        {
            if (IsIE6 || IsWebKit)
            {
                //Fix chrome anchor cursor issues.
                J("a").each((i, el) =>FixAnchor(el));
            }
        }

        internal static void FixAnchor(HtmlElement el)
        {
            if (el == null || el.nodeName != "A")
                return;
            if (!Utils.IsWebKit)
                return;
            var a = el.As<HtmlAnchorElement>();
            if (a.href == null || a.href.length == 0)
                a.href = "javascript:void(0);";
        }

        public static void SmoothScrollTo(string id)
        {
            J("html,body").animate(new { scrollTop = J("#" + id).offset().top }.As<Map>(), "slow");
        }
        public static void SmoothScrollToTop()
        {
            J("html,body").animate(new { scrollTop = 0 }.As<Map>(), "slow");
        }




    }

    //[JsType(JsMode.Prototype, Name = "JSON", Export = false)]
    //public class JSON
    //{
    //    public static string stringify(object obj)
    //    {
    //        return null;
    //    }
    //}



    [JsType(JsMode.Prototype)]
    class JsArrayEnumerator : IEnumerator
    {
        public JsArrayEnumerator(JsArray array)
        {
            Array = array;
            Index = -1;
        }
        JsArray Array;

        public bool MoveNext()
        {
            Index++;
            return Index < Array.length;
        }
        int Index;
        public object Current
        {
            get
            {
                return Array[Index];
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
        }

        #endregion

        #region IEnumerator Members

        object IEnumerator.Current
        {
            get { throw new NotImplementedException(); }
        }

        public void Reset()
        {
            Index = -1;
        }

        #endregion
    }

    [JsType(JsMode.Prototype, Name = "Array", NativeEnumerator = false)]
    class JsArray2 : JsArray
    {
        [JsMethod(Export = false)]
        public JsArray2()
        {
        }
        public new IEnumerator GetEnumerator()
        {
            return new JsArrayEnumerator(this);
        }
    }


    [JsType(JsMode.Prototype)]
    public static class JsExtensions
    {
        public static JsString Trim(this JsString s)
        {
            return s.replace(new JsRegExp(@"^\s*"), "").As<JsString>().replace(new JsRegExp(@"\s*$"), "");
        }

        [JsMethod(OmitCalls = true)]
        public static JsArray<T> AsJsArray<T>(this List<T> list)
        {
            throw new Exception();
        }
        [JsMethod(OmitCalls = true)]
        public static JsArray<T> AsJsArray<T>(this T[] array)
        {
            throw new Exception();
        }
        [JsMethod(OmitCalls = true)]
        public static List<T> AsList<T>(this JsArray<T> list)
        {
            throw new Exception();
        }

        public static int IndexOf(this JsArray array, object item)
        {
            var i = 0;
            foreach (var item2 in array)
            {
                if (item2 == item)
                    return i;
                i++;
            }
            return -1;
        }
        public static bool Remove(this JsArray array, object item)
        {
            var i = 0;
            foreach (var item2 in array)
            {
                if (item2 == item)
                {
                    array.splice(i, 1);
                    return true;
                }
                i++;
            }
            return false;
        }
        public static void RemoveAt(this JsArray array, JsNumber index)
        {
            array.splice(index, 1);
        }
        public static void Clear(this JsArray array)
        {
            array.splice(0, array.length);
        }
        public static bool Contains(this JsArray array, object item)
        {
            foreach (var item2 in array)
            {
                if (item2 == item)
                    return true;
            }
            return false;
        }
        public static void Insert(this JsArray array, JsNumber index, object item)
        {
            array.splice(index, 0, item);
        }

    }

    [JsType(JsMode.Prototype)]
    public static class jQueryExtensions
    {
        [JsMethod(ExtensionImplementedInInstance = true, NativeOverloads = true, Export=false)]
        public static bool preventDefault(this DOMEvent e)
        {
            return false;
        }
        [JsMethod(ExtensionImplementedInInstance = true, NativeOverloads = true, Export=false)]
        public static bool stopPropagation(this DOMEvent e)
        {
            return false;
        }

        [JsMethod(NativeOverloads=true, Export=false)]
        public static bool isChecked(this jQuery j)
        {
            return j.attr("checked").As<bool>();
        }
        public static bool isChecked(this jQuery j, bool value)
        {
            if (JsContext.arguments.length == 1)
                return j.attr("checked").As<bool>();
            else
            {
                j.attr("checked", value.As<JsString>());
                return JsContext.undefined.As<bool>();
            }
        }
        [JsMethod(ExtensionImplementedInInstance=true, Name="val", NativeOverloads=true, Export=false)]
        public static JsString valString(this jQuery j)
        {
            return j.val().As<JsString>();
        }

        [JsMethod(ExtensionImplementedInInstance = true, Name = "val", NativeOverloads = true)]
        public static void SetVisible(this jQuery j, bool visible)
        {
            if (visible)
                j.show();
            else
                j.hide();
        }
    }

}