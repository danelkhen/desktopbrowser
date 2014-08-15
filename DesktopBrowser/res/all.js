/* Generated by SharpKit 5 v5.4.0 */
if (typeof ($Inherit) == 'undefined') {
	var $Inherit = function (ce, ce2) {

		if (typeof (Object.getOwnPropertyNames) == 'undefined') {

			for (var p in ce2.prototype)
				if (typeof (ce.prototype[p]) == 'undefined' || ce.prototype[p] == Object.prototype[p])
					ce.prototype[p] = ce2.prototype[p];
			for (var p in ce2)
				if (typeof (ce[p]) == 'undefined')
					ce[p] = ce2[p];
			ce.$baseCtor = ce2;

		} else {

			var props = Object.getOwnPropertyNames(ce2.prototype);
			for (var i = 0; i < props.length; i++)
				if (typeof (Object.getOwnPropertyDescriptor(ce.prototype, props[i])) == 'undefined')
					Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i]));

			for (var p in ce2)
				if (typeof (ce[p]) == 'undefined')
					ce[p] = ce2[p];
			ce.$baseCtor = ce2;

		}

	}
};

if (typeof($CreateException)=='undefined') 
{
    var $CreateException = function(ex, error) 
    {
        if(error==null)
            error = new Error();
        if(ex==null)
            ex = new System.Exception.ctor();       
        error.message = ex.message;
        for (var p in ex)
           error[p] = ex[p];
        return error;
    }
}

if (typeof ($CreateAnonymousDelegate) == 'undefined') {
    var $CreateAnonymousDelegate = function (target, func) {
        if (target == null || func == null)
            return func;
        var delegate = function () {
            return func.apply(target, arguments);
        };
        delegate.func = func;
        delegate.target = target;
        delegate.isDelegate = true;
        return delegate;
    }
}


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


var IsIE6 = false;
var IsWebKit = false;
IsIE6 = ((window.navigator.userAgent.indexOf("MSIE 6.") != -1) && (window.navigator.userAgent.indexOf("Opera") == -1));
IsWebKit = (window.navigator.userAgent.indexOf("AppleWebKit") != -1);
function ApplyExactTemplate(el, template){
    if (el.getAttribute("_IsTemplated"))
        return null;
    el.setAttribute("_IsTemplated", true);
    var tmp = template.cloneNode(true);
    tmp.id = "";
    $(el).replaceWith(tmp);
    $("#Element", tmp).replaceWith(el);
    return tmp;
};
function ApplyTemplates(){
    $("#Templates").children().each(function (i, templateEl){
        templateEl.setAttribute("_IsTemplated", true);
        var className = "." + templateEl.id;
        $(className).each(function (index, t){
            ApplyExactTemplate(t, templateEl);
        });
    });
};
function ApplyTemplate(el){
    var className = el.className;
    if (className.length > 0){
        var templateEl = document.getElementById(className);
        if (templateEl != null && templateEl.parentElement.id == "Templates")
            return ApplyExactTemplate(el, templateEl);
    }
    return null;
};
function ParseQueryString(search){
    var obj = new Object();
    var pairs = search.substring(1).split("&");
    for (var $i2 = 0,$l2 = pairs.length,pair = pairs[$i2]; $i2 < $l2; $i2++, pair = pairs[$i2]){
        var tokens = pair.split("=");
        obj[decodeURIComponent(tokens[0])] = decodeURIComponent(tokens[1]);
    }
    return obj;
};
function GetFormData(inputMappings, suffix){
    var obj2 = inputMappings;
    var data = new Object();
    for (var p in obj2){
        var id = obj2[p];
        if (suffix != null)
            id += suffix;
        var input = document.getElementById(id);
        if (input == null)
            continue;
        if (input.type == "checkbox")
            data[p] = input.checked;
        else
            data[p] = input.value;
    }
    return data;
};
function GetRepeatedFormData(inputMappings){
    var list =  [];
    var i = 0;
    while (true){
        i++;
        var data = GetFormData(inputMappings, i.toString());
        if (data == null)
            return list;
        list.push(data);
    }
};
function FixBrowserCompatibilityIssues(){
    if (IsIE6 || IsWebKit){
        $("a").each(function (i, el){
            FixAnchor(el);
        });
    }
};
function FixAnchor(el){
    if (el == null || el.nodeName != "A")
        return;
    if (!IsWebKit)
        return;
    var a = el;
    if (a.href == null || a.href.length == 0)
        a.href = "javascript:void(0);";
};
function SmoothScrollTo(id){
    $("html,body").animate({
        scrollTop: $("#" + id).offset().top
    }, "slow");
};
function SmoothScrollToTop(){
    $("html,body").animate({
        scrollTop: 0
    }, "slow");
};
if (typeof(DesktopBrowser) == "undefined")
    var DesktopBrowser = {};
if (typeof(DesktopBrowser.Client) == "undefined")
    DesktopBrowser.Client = {};
if (typeof(DesktopBrowser.Client.Utils) == "undefined")
    DesktopBrowser.Client.Utils = {};
DesktopBrowser.Client.Utils.JsArrayEnumerator = function (array){
    this.Array = null;
    this.Index = 0;
    this.Array = array;
    this.Index = -1;
};
DesktopBrowser.Client.Utils.JsArrayEnumerator.prototype.MoveNext = function (){
    this.Index++;
    return this.Index < this.Array.length;
};
DesktopBrowser.Client.Utils.JsArrayEnumerator.prototype.get_Current = function (){
    return this.Array[this.Index];
};
DesktopBrowser.Client.Utils.JsArrayEnumerator.prototype.Dispose = function (){
};
DesktopBrowser.Client.Utils.JsArrayEnumerator.prototype.Reset = function (){
    this.Index = -1;
};
Array.prototype.GetEnumerator = function (){
    return new DesktopBrowser.Client.Utils.JsArrayEnumerator(this);
};
$Inherit(Array, Array);
DesktopBrowser.Client.Utils.JsExtensions = function (){
};
DesktopBrowser.Client.Utils.JsExtensions.Trim = function (s){
    return s.replace(new RegExp("^\\s*"), "").replace(new RegExp("\\s*$"), "");
};
DesktopBrowser.Client.Utils.JsExtensions.AsJsArray = function (list){
    throw $CreateException(new System.Exception.ctor(), new Error());
};
DesktopBrowser.Client.Utils.JsExtensions.AsJsArray = function (array){
    throw $CreateException(new System.Exception.ctor(), new Error());
};
DesktopBrowser.Client.Utils.JsExtensions.AsList = function (list){
    throw $CreateException(new System.Exception.ctor(), new Error());
};
DesktopBrowser.Client.Utils.JsExtensions.IndexOf = function (array, item){
    var i = 0;
    for (var $i2 = 0,$l2 = array.length,item2 = array[$i2]; $i2 < $l2; $i2++, item2 = array[$i2]){
        if (item2 == item)
            return i;
        i++;
    }
    return -1;
};
DesktopBrowser.Client.Utils.JsExtensions.Remove = function (array, item){
    var i = 0;
    for (var $i3 = 0,$l3 = array.length,item2 = array[$i3]; $i3 < $l3; $i3++, item2 = array[$i3]){
        if (item2 == item){
            array.splice(i, 1);
            return true;
        }
        i++;
    }
    return false;
};
DesktopBrowser.Client.Utils.JsExtensions.RemoveAt = function (array, index){
    array.splice(index, 1);
};
DesktopBrowser.Client.Utils.JsExtensions.Clear = function (array){
    array.splice(0, array.length);
};
DesktopBrowser.Client.Utils.JsExtensions.Contains = function (array, item){
    for (var $i4 = 0,$l4 = array.length,item2 = array[$i4]; $i4 < $l4; $i4++, item2 = array[$i4]){
        if (item2 == item)
            return true;
    }
    return false;
};
DesktopBrowser.Client.Utils.JsExtensions.Insert = function (array, index, item){
    array.splice(index, 0, item);
};
DesktopBrowser.Client.Utils.jQueryExtensions = function (){
};
DesktopBrowser.Client.Utils.jQueryExtensions.isChecked = function (j, value){
    if (arguments.length == 1)
        return j.attr("checked");
    else {
        j.attr("checked", value);
        return undefined;
    }
};
DesktopBrowser.Client.Utils.jQueryExtensions.val = function (j, visible){
    if (visible)
        j.show();
    else
        j.hide();
};
DesktopBrowser.Client.SiteProxy = function (){
    this.DataClient = null;
    this.DataClient = new DesktopBrowser.Client.Utils.DataServiceProxy();
};
DesktopBrowser.Client.SiteProxy.prototype.Execute = function (path, callback){
    this.Invoke("Execute", [path], callback);
};
DesktopBrowser.Client.SiteProxy.prototype.Delete = function (path, callback){
    this.Invoke("Delete", [path], callback);
};
DesktopBrowser.Client.SiteProxy.prototype.Invoke = function (methodName, prms, callback){
    var req = {
        AssemblyName: "DesktopBrowser",
        TypeName: "DesktopBrowser.Server.SiteService",
        MethodName: methodName,
        Parameters: prms
    };
    this.DataClient.InvokeAsync(req, $CreateAnonymousDelegate(this, function (t){
        if (t.Error != null){
            alert(t.Error);
        }
        else {
            if (callback != null)
                callback(t.ReturnValue);
        }
    }), false);
};
DesktopBrowser.Client.Utils.DataServiceProxy = function (){
    this.DataServiceUrl = null;
    this.DataServiceUrl = "DataService.ashx";
};
DesktopBrowser.Client.Utils.DataServiceProxy.CreateRequest = function (){
    if (window.XMLHttpRequest)
  return new XMLHttpRequest();

else if (window.ActiveXObject)
     return new ActiveXObject('MSXML2.XMLHTTP.3.0');
else
    throw new Error('Your browser does not support ajax requests');
};
DesktopBrowser.Client.Utils.DataServiceProxy.WebGetAsync = function (url, callback){
    var req = DesktopBrowser.Client.Utils.DataServiceProxy.CreateRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function (){
        if (req.readyState == 4){
            callback(req);
        }
    };
    req.send(null);
};
DesktopBrowser.Client.Utils.DataServiceProxy.WebPostFormAsync = function (url, form, callback){
    var req = DesktopBrowser.Client.Utils.DataServiceProxy.CreateRequest();
    req.open("POST", url, true);
    req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = function (){
        if (req.readyState == 4){
            callback(req);
        }
    };
    var sb =  [];
    DesktopBrowser.Client.Utils.DataServiceProxy.SerializeForm(form, sb);
    req.send(sb.join(""));
};
DesktopBrowser.Client.Utils.DataServiceProxy.SerializeForm = function (form, sb){
    var first = true;
    for (var p in form){
        if (first)
            first = false;
        else
            sb.push("&");
        sb.push(p);
        sb.push("=");
        sb.push(encodeURIComponent(form[p]));
    }
};
DesktopBrowser.Client.Utils.DataServiceProxy.prototype.InvokeAsync = function (req, callback, useGetMethod){
    var callback2 = $CreateAnonymousDelegate(this, function (t){
        var res = {};
        if (t.status == 200){
            var code = t.responseText;
            var func = new Function(code);
            try{
                res = func();
            }
            catch(e){
                res.Error = e.toString();
            }
        }
        else {
            res.Error = "Http error code " + t.status + ", " + t.statusText;
        }
        callback(res);
    });
    var url = this.DataServiceUrl;
    var sb =  [];
    if (useGetMethod){
        sb.push(url, "?z=z");
        DesktopBrowser.Client.Utils.DataServiceProxy.SerializeToQueryString(req, sb);
        url = sb.join("");
        DesktopBrowser.Client.Utils.DataServiceProxy.WebGetAsync(url, callback2);
    }
    else {
        var body = JSON.stringify(req);
        DesktopBrowser.Client.Utils.DataServiceProxy.WebPostFormAsync(url, new Object({
            req: body
        }), callback2);
    }
};
DesktopBrowser.Client.Utils.DataServiceProxy.SerializeToQueryString = function (req, sb){
    if (req.AssemblyName != null)
        sb.push("&a=" + req.AssemblyName);
    if (req.TypeName != null)
        sb.push("&t=" + req.TypeName);
    if (req.MethodName != null)
        sb.push("&m=" + req.MethodName);
    if (req.InstanceSessionKey != null)
        sb.push("&isk=" + req.InstanceSessionKey);
    if (req.Parameters != null){
        var prms = req.Parameters;
        for (var i = 0; i < prms.length; i++){
            sb.push("&p");
            sb.push((i + 1).toString());
            sb.push("=");
            sb.push(encodeURIComponent(prms[i].toString()));
        }
    }
};
DesktopBrowser.Keys = function (){
};
DesktopBrowser.Keys.Enter = 13;
DesktopBrowser.Keys.PageUp = 33;
DesktopBrowser.Keys.PageDown = 34;
DesktopBrowser.Keys.End = 35;
DesktopBrowser.Keys.Home = 36;
DesktopBrowser.Keys.Up = 38;
DesktopBrowser.Keys.Down = 40;
DesktopBrowser.ClientExtensions = function (){
};
DesktopBrowser.ClientExtensions.RegexEscape = function (text){
    return text.replace(new RegExp("[-[\\]{}()*+?.,\\\\^$|#\\s]", "g"), "\\$&");
};

var Selector = null;
var SiteProxy = null;
var PageSize = 10;
SiteProxy = new DesktopBrowser.Client.SiteProxy();
function DefaultClient_Load(){
    if (Data.MoreAvailable === false){
        $(".Pager .Next").addClass("disabled").attr("disabled", "disabled");
    }
    Selector = new DesktopBrowser.Selector();
    Selector.Selected = function (t){
        t.className = "Selected";
        SaveSelection($(t).find(".NameCell A").text());
    };
    Selector.UnSelected = function (t){
        t.className = "";
    };
    UpdateClock();
    RestoreSelection();
    $(window).keydown(function (e){
        if (e.target != null && e.target.nodeName == "INPUT")
            return;
        if (e.which == DesktopBrowser.Keys.Up){
            e.preventDefault();
            Up();
        }
        else if (e.which == DesktopBrowser.Keys.Down){
            e.preventDefault();
            Down();
        }
        else if (e.which == DesktopBrowser.Keys.PageDown){
            e.preventDefault();
            PageDown();
        }
        else if (e.which == DesktopBrowser.Keys.PageUp){
            e.preventDefault();
            PageUp();
        }
        else if (e.which == DesktopBrowser.Keys.Enter){
            e.preventDefault();
            Enter();
        }
        else {
            $("#tbSearch").get(0).focus();
        }
    });
};
function WriteLine(obj){
    document.body.appendChild(document.createTextNode(obj));
    document.body.appendChild(document.createElement("br"));
};
function CanMoveSelection(by){
    return MoveSelection(by, false);
};
function MoveSelection(by, preview){
    var by2 = by;
    var row = $(Selector.SelectedItem);
    if (row.length == 0)
        return false;
    while (by2 > 0){
        if (row.next().length == 0)
            break;
        row = row.next();
        by2--;
    }
    while (by2 < 0){
        if (row.prev().length == 0)
            break;
        row = row.prev();
        by2++;
    }
    if (row.length == 0 || by == by2)
        return false;
    if (!preview){
        var row2 = row.get(0);
        Select(row2);
    }
    return true;
};
function Select(row){
    Selector.Select(row);
    var pos = $(row).offset();
    if (pos.top < window.pageYOffset){
        row.scrollIntoView(true);
    }
    else if (pos.top > window.pageYOffset + window.innerHeight){
        row.scrollIntoView(false);
    }
};
function PageDown(){
    return MoveSelection(PageSize * 1, false);
};
function PageUp(){
    return MoveSelection(PageSize * -1, false);
};
function Enter(){
    var anchor = $(Selector.SelectedItem).find("a").get(0);
    if (anchor.nodeName == "A"){
        SimulateClick(anchor);
        return true;
    }
    return false;
};
function SelectFirstItem(){
    var first = $("grdFiles TBODY TR").first().get(0);
    if (first != null){
        Select(first);
        return true;
    }
    return false;
};
function Down(){
    if (!MoveSelection(1, false))
        return SelectFirstItem();
    return false;
};
function Up(){
    if (!MoveSelection(-1, false))
        return SelectFirstItem();
    return false;
};
function RestoreSelection(){
    var folder = $("#tbFilename").val();
    var filename = GetStorageItem(folder);
    if (filename != null && filename.length > 0){
        $("#grdFiles .NameCell A").each(function (i, el){
            var x = $(el);
            if (x.text() == filename){
                Selector.Select(x.parents("tr").first().get(0));
                return false;
            }
        });
    }
};
function GetStorageItem(key){
    return window.localStorage.getItem(key);
};
function SetStorageItem(key, value){
    window.localStorage.setItem(key, value);
};
function SaveSelection(filename){
    var folder = $("#tbFilename").val();
    var nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 4);
    SetStorageItem(folder, filename);
};
function UpdateClock(){
    $("#divTime").text(new Date().format("h:MM tt"));
    $("#divDate").text(new Date().format("dddd, mmm d"));
    window.setTimeout(UpdateClock, 5000);
};
function Execute(path){
    new DesktopBrowser.Client.SiteProxy().Execute(path, null);
};
function OpenFile(path){
    new DesktopBrowser.Client.SiteProxy().Execute(path, null);
};
function GetSelectedPath(){
    if (Selector.SelectedItem == null)
        return null;
    var filePath = $(Selector.SelectedItem).find(".ihFilePath").val();
    return filePath;
};
function btnDelete_click(){
    var path = GetSelectedPath();
    if (path == null)
        return;
    if (!window.confirm("are you sure you want to permanantly delete the path: " + path))
        return;
    SiteProxy.Delete(path, function (t){
        window.location.reload();
    });
};
function Filter(el, exp){
    var x = $(el);
    x.parents("tr").first().toggle(x.text().search(exp) >= 0);
};
function tbFolder_keydown(e){
    if (e.keyCode == 13){
        Go();
    }
};
function Go(){
    var newPath = $("#tbFolder").val();
    window.location.href = "?p=" + encodeURIComponent(newPath);
};
function btnGo_click(e){
    Go();
};
function tbSearch_keyup(e){
    var search = $("#tbSearch").val();
    var exp = new RegExp(DesktopBrowser.ClientExtensions.RegexEscape(search), "i");
    $("#grdFiles .NameCell A").each(function (i, el){
        Filter(el, exp);
    });
};
function SimulateClick(anchor){
    var a = $(anchor);
    a.trigger("click", null);
    var href = a.attr("href");
    if (href != null && href.length > 0){
        var target = a.attr("target");
        if (target == "_blank")
            window.open(href, "");
        else
            window.location.href = href;
    }
};
if (typeof(DesktopBrowser) == "undefined")
    var DesktopBrowser = {};
DesktopBrowser.Selector = function (){
    this.Selected = null;
    this.UnSelected = null;
    this.SelectedItem = null;
};
DesktopBrowser.Selector.prototype.Select = function (el){
    if (this.SelectedItem == el)
        return;
    var unselected = this.SelectedItem;
    this.SelectedItem = el;
    if (unselected != null && this.UnSelected != null)
        this.UnSelected(unselected);
    if (this.SelectedItem != null && this.Selected != null)
        this.Selected(this.SelectedItem);
};

