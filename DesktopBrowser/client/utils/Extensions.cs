using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.client
{

    [JsType(JsMode.Prototype, Export = false)]
    public static class Extensions
    {
        [JsMethod(InlineCodeExpression = "$(el)")]
        public static jQuery ToJ(this HtmlElement el) { return null; }
        [JsMethod(InlineCodeExpression = "$(s)")]
        public static jQuery ToJ(this JsString s) { return null; }
        [JsMethod(InlineCodeExpression = "$(s)")]
        public static jQuery ToJ(this string s) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void remove<T>(this JsArray<T> list, T item) { }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void insert<T>(this JsArray<T> list, JsNumber index, T item) { }

        [JsMethod(ExtensionImplementedInInstance = true, OmitCalls = true)]
        public static JsArray<T> ItemAs<T>(this System.Collections.IEnumerable list) { return null; }

        [JsMethod(InlineCodeExpression = "x instanceof Array")]
        public static bool IsArray(this object x) { return false; }
        [JsMethod(InlineCodeExpression = "typeof(x)")]
        public static JsString getTypeName(this object x) { return null; }
        [JsMethod(InlineCodeExpression = "typeof(x)")]
        public static JsTypes getType(this object x) { return default(JsTypes); }
        [JsMethod(InlineCodeExpression = "isNaN(x)")]
        public static bool IsNaN(this JsNumber x) { return false; }
        [JsMethod(InlineCodeExpression = "typeof(x)=='undefined'")]
        public static bool IsUndefined(this object x) { return false; }
        [JsMethod(InlineCodeExpression = "typeof(x)=='string'")]
        public static bool IsString(this object x) { return false; }
        [JsMethod(InlineCodeExpression = "typeof(x)=='number'")]
        public static bool IsNumber(this object x) { return false; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsNumber round(this JsNumber x, double precision) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsString removeDoubleWhitespace(this JsString s) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void mapAsyncParallel<T, R>(this JsArray<T> list, JsAction<T, JsAction<R>> action, JsAction<JsArray<R>> finalCallback) { }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void forEachAsyncParallel<T>(this JsArray<T> list, JsAction<T, JsAction> action, JsAction finalCallback) { }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void joinWith<T, T2, K, R>(this JsArray<T> list, JsArray<T2> list2, JsFunc<T, K> keySelector1, JsFunc<T2, K> keySelector2, JsFunc<JsArrayWithKey<K, T>, JsArrayWithKey<K, T2>, R> resultSelector) { }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void clear<T>(this JsArray<T> list) { }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void forEachAsyncProgressive<T>(this JsArray<T> list, JsAction<T, JsAction> action, JsAction finalCallback) { }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> toArray<T>(this JsArray<T> list) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> exceptNulls<T>(this JsArray<T> list) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<R> select<T, R>(this JsArray<T> list, JsFunc<T, R> selector) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<R> select<T, R>(this JsArray<T> list, JsFunc<T, int, R> selector) { return null; }
        //[JsMethod(ExtensionImplementedInInstance = true)]
        //public static JsArray<R> select<T, R>(this JsArray<T> list, JsString s) { return null; }
        //[Obsolete]
        //[JsMethod(ExtensionImplementedInInstance = true)]
        //public static JsArray<object> select<T>(this JsArray<T> list, JsString s) { return null; }
        //[Obsolete]
        //[JsMethod(ExtensionImplementedInInstance = true)]
        //public static JsArray<R> selectMany<T, R>(this JsArray<T> list, JsString s) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<R> selectMany<T, R>(this JsArray<T> list, JsFunc<T, JsArray<R>> selector) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool contains<T>(this JsArray<T> list, T item) { return false; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArrayWithKey<K, JsArray<T>> groupBy<T, K>(this JsArray<T> list, JsFunc<T, K> keySelector) { return null; }

        //[JsMethod(ExtensionImplementedInInstance = true)]
        //public static JsArray<JsArray<T>> groupBy<T>(this JsArray<T> list, JsString s) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> distinct<T>(this JsArray<T> list) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool any<T>(this JsArray<T> list, JsFunc<T, bool> predicate) { return false; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool all<T>(this JsArray<T> list, JsFunc<T, bool> predicate) { return false; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> orderBy<T, V>(this JsArray<T> list, JsFunc<T, V> selector) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> orderBy<T, V>(this JsArray<T> list, JsArray<JsFunc<T, V>> selectors) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> orderByDescending<T, V>(this JsArray<T> list, JsFunc<T, V> predicate) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> where<T>(this JsArray<T> list, JsFunc<T, bool> predicate) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static void removeAll<T>(this JsArray<T> list, JsFunc<T, bool> predicate) { }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static T max<T>(this JsArray<T> list) { return default(T); }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static T min<T>(this JsArray<T> list) { return default(T); }

        [Obsolete]
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> whereEq<T>(this JsArray<T> list, JsString name, object value) { return null; }

        //[JsMethod(ExtensionImplementedInInstance = true)]
        //public static JsArray<T> whereEq<T, V>(this JsArray<T> list, JsFunc<T,V> prop, V value) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsNumber round(this JsNumber x) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsNumber sum<T>(this JsArray<T> list) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsNumber avg<T>(this JsArray<T> list) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static T first<T>(this JsArray<T> list) { return default(T); }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static T first<T>(this JsArray<T> list, JsFunc<T, bool> predicate) { return default(T); }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static T last<T>(this JsArray<T> list) { return default(T); }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsObject<K, V> selectToObject<T, K, V>(this JsArray<T> list, JsFunc<T, K> keySelector, JsFunc<T, V> valueSelector) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsObject<V> selectToObject<T, V>(this JsArray<T> list, JsFunc<T, JsString> keySelector, JsFunc<T, V> valueSelector) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool startsWith(this JsString s, JsString find) { return false; }


        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool endsWith(this JsString s, JsString find) { return false; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool startsWith(this string s, string find) { return false; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsString substringBetween(this JsString s, JsString start, JsString end) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsString substringBetween(this JsString s, JsString start, JsString end, JsNumber fromIndex) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsString replaceAll(this JsString s, JsString find, JsString replace) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static bool contains(this JsString s, JsString find) { return false; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<JsString> lines(this JsString s) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> skip<T>(this JsArray<T> list, int skip) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> take<T>(this JsArray<T> list, int take) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> insert<T>(this JsArray<T> list, int index, T iteam) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> add<T>(this JsArray<T> list, T item) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static JsArray<T> addRange<T>(this JsArray<T> list, JsArray<T> items) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery getAppend(this jQuery j, JsString selector) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery getAppendRemove(this jQuery j, JsString selector, JsNumber total) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery getAppendRemove(this jQuery j, JsString selector, bool condition) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery tab(this jQuery j, JsString cmd) { return null; }

        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery bindChildrenToList<T>(this jQuery j, JsString selector, JsArray<T> list, JsAction<jQuery, T> action) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery getAppendRemoveForEach<T>(this jQuery j, JsString selector, JsArray<T> list, JsAction<jQuery, T> action) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery bindChildrenToList<T>(this jQuery j, JsString selector, JsArray<T> list, JsAction<jQuery, T, JsNumber> action) { return null; }
        [JsMethod(ExtensionImplementedInInstance = true)]
        public static jQuery off(this jQuery j) { return null; }

    }


    [JsType(JsMode.Prototype, Export = false, Name = "Array")]
    public class JsArrayWithKey<K, T> : JsArray<T>
    {
        public K key { get; set; }
    }

    [JsType(JsMode.Prototype, Export = false, Name = "Date")]
    public class JsDateEx : JsDate
    {
        public static JsDateEx @new(JsNumber y = null, JsNumber M = null, JsNumber d = null, JsNumber h = null, JsNumber m = null, JsNumber s = null, JsNumber f = null) { return null; }

        public JsDateEx(JsString s)
        {
        }

        public static JsDateEx tryParseExact(string p1, string p2)
        {
            throw new NotImplementedException();
        }
        public static JsDateEx tryParseExact(string p1, JsArray<JsString> p2)
        {
            throw new NotImplementedException();
        }

        public static JsDateEx today()
        {
            throw new NotImplementedException();
        }


        public JsDateEx subtract(JsDateEx jsDateEx)
        {
            throw new NotImplementedException();
        }

        public int totalDays()
        {
            throw new NotImplementedException();
        }

        public JsString format(string p)
        {
            throw new NotImplementedException();
        }

        public static JsDateEx current()
        {
            throw new NotImplementedException();
        }

        public JsDateEx addDays(int p)
        {
            throw new NotImplementedException();
        }

        public bool equals(JsDateEx x)
        {
            throw new NotImplementedException();
        }

        public JsDateEx removeTime()
        {
            throw new NotImplementedException();
        }

        internal int compareTo(JsDateEx startDate)
        {
            throw new NotImplementedException();
        }


        public JsNumber Year
        {
            [JsMethod(Name = "year")]
            get;
            [JsMethod(Name = "year")]
            set;
        }
        public JsNumber Month
        {
            [JsMethod(Name = "month")]
            get;
            [JsMethod(Name = "month")]
            set;
        }
        public JsNumber Day
        {
            [JsMethod(Name = "day")]
            get;
            [JsMethod(Name = "day")]
            set;
        }

    }
}