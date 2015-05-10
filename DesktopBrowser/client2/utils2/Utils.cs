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

    [JsType(JsMode.Prototype)]
    public class Utils
    {
        public static JsNumber CalcChangePct(JsNumber from, JsNumber to)
        {
            var pct = ((to / from) - 1);
            return pct;
        }

        public static JsString ObjToClass(JsObject obj, JsString defaultTypeForNull)
        {
            var sb = new JsArray<JsString>();
            var mappings = new JsObject
            {
                {"object", "JsObject"},
                {"number", "JsNumber"},
                {"boolean", "JsBoolean"},
                {"string", "JsString"},
            };
            sb.push("public class Obj");
            sb.push("{");
            foreach(var p in obj)
            {
                var value = obj[p];
                var type = value.getTypeName();
                var type2 = mappings[type] ?? type;
                if (value == null)
                    type2 = defaultTypeForNull ?? "object";
                sb.push("public " + type2 + " " + p + " { get; set; }");
            }
            sb.push("}");
            return sb.join("\n");
        }
        public static JsNativeFunc<JsNativeFunc<T, object>, JsString> PropHelper<T>()
        {
            var x = new PropHelper<T>();
            return x.Prop;
        }
        public static JsString Prop<T>(JsNativeFunc<T, object> prop)
        {
            JsString code;
            if (prop.As<JsObject>()["isDelegate"].As<bool>())
                code = prop.As<JsObject>()["func"].As<JsObject>().toString();
            else
                code = prop.As<JsObject>().toString();
            return code.substringBetween(".", ";");
        }


        public static void listToMatrix<T>(JsArray<T> list, JsString xProp, JsString yProp, JsString valueProp, JsFunc<JsArray<object>, object> aggregateFunc, JsAction<object, object, object, int, int> yieldCallback)
        {
            if (aggregateFunc == null)
                aggregateFunc = values => values.sum();
            //if (@typeof (aggregateFunc) == "string")
            //    aggregateFunc = Array.prototype[aggregateFunc];
            var xPropSelector = Q.createSelectorFunction<T, object>(xProp);
            var yPropSelector = Q.createSelectorFunction<T, object>(yProp);
            var valuePropSelector = Q.createSelectorFunction<T, object>(valueProp);
            var xs = list.select(xPropSelector).distinct();
            var ys = list.select(yPropSelector).distinct();
            xs.forEach((x, xIndex) =>
            {
                var row = new JsArray<object> { x };
                ys.forEach((y, yIndex) =>
                {
                    var values = list.where(t =>
                    {
                        return xPropSelector(t) == x && yPropSelector(t) == y;
                    }).select(valuePropSelector);
                    var aggregated = aggregateFunc(values);
                    yieldCallback(x, y, aggregated, xIndex, yIndex);
                });
            });
        }


        public static JsArray<JsArray<object>> listToMatrixRows<T>(JsArray<T> list, JsString xProp, JsString yProp, JsString valueProp, JsFunc<JsArray<object>, object> aggregateFunc = null)
        {
            var header = new JsArray<object>();
            var rows = new JsArray<JsArray<object>>();
            listToMatrix(list, xProp, yProp, valueProp, aggregateFunc,
                (x, y, value, xIndex, yIndex) =>
                {
                    if (xIndex == 0)
                    {
                        if (yIndex == 0)
                            header.push(xProp);
                        header.push(y);
                    }
                    if (yIndex == 0)
                        rows[xIndex] = new JsArray<object> { x, value };
                    else
                        rows[xIndex].push(value);
                });
            rows.insert(0, header);
            return rows;
        }

        public static JsObject<JsObject> listToMatrixObject<T>(JsArray<T> list, JsString xProp, JsString yProp, JsString valueProp, JsFunc<JsArray<object>, object> aggregateFunc)
        {
            var byX = new JsObject<JsObject>();
            listToMatrix(list, xProp, yProp, valueProp, aggregateFunc,
                (x, y, value, xIndex, yIndex) =>
                {
                    var xx = x.As<JsString>();
                    var yy = y.As<JsString>();
                    if (byX[xx] == null)
                        byX[xx] = new JsObject();
                    byX[xx][yy] = value;
                });
            return byX;
        }





        public static JsArray<JsArray<object>> cleanUpRows(JsArray<JsArray<object>> rows)
        {
            rows.forEach(row =>
            {
                row.forEach((value, i) =>
                {
                    if (value.ExactEquals(jQueryContext.undefined))
                        row[i] = null;
                });
            });
            return rows;
        }



        public static void clearTextNodes(HtmlElement el = null)
        {
            if (el == null)
                el = jQueryContext.document.body;
            jQueryContext.J(el).find("*+*").toArray().forEach(el2 =>
            {
                var prev = el2.previousSibling;
                while (prev != null && prev.nodeType == 3)
                {
                    var tmp = prev;
                    prev = prev.previousSibling;
                    tmp.As<Element>().remove();
                }
            });
        }

        public static void createTabControl(jQuery div)
        {

            var tabs = div.children("div");
            var ul = div.getAppend("ul.nav.nav-tabs");
            var lis = ul.getAppendRemove("li", tabs.length).toArray();
            var btns = tabs.toArray().select((tab, i) =>
            {
                var li = jQueryContext.J(lis[i]);
                var btn = li.getAppend("a").text(tab.title).data("target", "#" + tab.id);
                tab.title = "";
                //btn.data("_tab", tab);
                return btn[0];
            });
            //var btnsDiv = ul;// J("<div class='btn-group btn-group-sm'/>").append(btns.As<HtmlElement>());
            //var btns2 = J(btns);

            var btns2 = jQueryContext.J(btns);
            btns2.mousedown(e =>
                {
                    e.preventDefault();
                    var target = jQueryContext.J(e.target);
                    target.tab("show");
                    var tab = jQueryContext.J(target.data("target"));
                    tab.trigger("tabchanged");
                });
            div.getAppend(".tab-content").append(tabs);
            tabs.addClass("tab-pane");
            tabs.first().addClass("active");
            btns2.first().tab("show");



            //btns2.mousedown(e =>
            //{
            //    tabs.hide();
            //    J(e.target.As<dynamic>().tab).show();
            //    J(btns).removeClass("active");
            //    J(e.target).addClass("active");
            //    J(e.target.As<dynamic>().tab).trigger("tabchanged", e);
            //});
            //div.prepend(btnsDiv);
            //tabs.hide().first().show();
        }



        static object _Unwrap(object obj)
        {
            var keys = JsObjectEx.keys(obj);
            if (keys.length == 2 && keys.contains("_value") && keys.contains("_name"))
            {
                return obj.As<JsObject>()["_value"];
            }
            return obj;
        }


        public static object _xmlToJson(Element el)
        {
            if (el.nodeType == 3)
                return el.As<dynamic>().data;
            if (el.nodeType != 1)
                return jQueryContext.undefined;
            //if (el.attributes.length == 0 && el.childNodes.length == 0)
            //    return el.textContent;

            var obj = new JsObject();
            obj["_name"] = el.nodeName;
            for (var i = 0; i < el.attributes.length; i++)
            {
                var att = el.attributes[i];
                obj[att.As<dynamic>().name] = att.As<dynamic>().value;
            }
            for (var i = 0; i < el.childNodes.length; i++)
            {
                var node2 = el.childNodes[i].As<Element>();
                //var value = _xmlToJson(node2);
                if (node2.nodeType == 1)
                {
                    var el2 = node2;
                    var prop = el2.nodeName;
                    var objValue = obj[prop];
                    if (objValue != null)
                    {
                        JsArray<object> list;
                        if (objValue.IsArray())
                        {
                            list = objValue.As<JsArray<object>>();
                        }
                        else
                        {
                            list = new JsArray<object> { objValue };
                            obj[el2.nodeName] = list;
                        }
                        list.push(_Unwrap(_xmlToJson(el2)));
                        continue;
                    }
                    obj[el2.nodeName] = _Unwrap(_xmlToJson(el2));
                }
                else
                {
                    var value = _xmlToJson(node2);
                    obj.As<dynamic>()._value = value;
                }
            }
            return obj;
        }

        [JsMethod(Export = false)]
        public static T xmlToJson<T>(JsString xml)
        {
            return default(T);

        }
        public static T xmlToJson<T>(Document xml)
        {
            if (jQueryContext.@typeof(xml) == "string")
                xml = jQuery.parseXML(xml.As<JsString>());
            var el = xml.documentElement;
            var obj = _xmlToJson(el).As<T>();
            return obj;
        }

        public static JsNumber parseDutchFloat(JsString s)
        {
            s = s.replaceAll(".", "d").replaceAll(",", ".").replaceAll("d", ",");
            return jQueryContext.parseFloat(s);
        }


        [JsMethod(Export = false)]
        public static void proxy<T>(JsString url, object q, object data, JsAction<T> cb)
        {

        }

        public static void proxy<T>(JsString url, object q, object data, JsAction<T, JsError> cb)
        {
            var qurl = url;
            if (q != null)
                qurl = url += "?" + QueryString.stringify(q);
            var q2 = new { url = qurl };
            var x = new AjaxSettings
            {
                url = "proxy.ashx?" + jQuery.param(q2),
                data = data,
                success = (t, b, c) =>
                {
                    if (cb != null)
                        cb(t.As<T>(), null);
                },
                error = (jqXHR, textStatus, errorThrown) =>
                {
                    if (cb != null)
                        cb(default(T), errorThrown);
                },
            };
            x.As<dynamic>().method = data != null ? "POST" : "GET";
            jQuery.ajax(x);
        }


        public static JsArray<JsArray<object>> data { get; set; }
    }

}