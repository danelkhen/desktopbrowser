let DefaultDateFormat = "yyyy-MM-dd HH:mm:ss";
Array.prototype.GetSiblingOrEdge = function (item, offset) {
    let list = this;
    if (offset == null || offset == 0)
        return item;
    var index = list.indexOf(item);
    var newIndex = index += offset;
    if (newIndex < 0 || newIndex >= list.length) {
        if (offset > 0)
            return list.last();
        return list.first();
    }
    return list[newIndex];
};
String.prototype.ToDefaultDate = function () {
    return Date.tryParseExact(this, DefaultDateFormat);
};
String.isNullOrEmpty = s => s == null || s == "";
String.isNotNullOrEmpty = s => s != null && s != "";
String.prototype.equalsIgnoreCase = function (s) {
    let x = this;
    let xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0;
    console.log("EIC", this, s, xx);
    return xx;
};
String.prototype.removeLast = function (x) {
    let s = this;
    if (x == null)
        x = 1;
    return s.substr(0, s.length - x);
};
var Keys;
(function (Keys) {
    Keys[Keys["Enter"] = 13] = "Enter";
    Keys[Keys["PageUp"] = 33] = "PageUp";
    Keys[Keys["PageDown"] = 34] = "PageDown";
    Keys[Keys["End"] = 35] = "End";
    Keys[Keys["Home"] = 36] = "Home";
    Keys[Keys["Up"] = 38] = "Up";
    Keys[Keys["Down"] = 40] = "Down";
})(Keys || (Keys = {}));
Date.prototype.ToFriendlyRelative2 = function (rel) {
    let dt = this;
    if (rel == null)
        rel = new Date();
    if (dt.year() == rel.year()) {
        if (dt.month() == rel.month()) {
            if (dt.day() == rel.day()) {
                return dt.format("HH:mm");
            }
            return dt.format("MMM d");
        }
        return dt.format("MMM d");
    }
    return dt.format("d/M/yy");
};
Number.prototype.ToFriendlySize = function () {
    let bytes = this;
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
};
Number.prototype.toFriendlyNumber = function () {
    let x = this;
    let s;
    if (x == 0)
        return "0";
    if (x > 0 && x < 10)
        s = x.toFixed(2);
    else if (x >= 10 && x < 100)
        s = x.toFixed(1);
    else
        s = x.toFixed(0);
    if (s.endsWith(".0"))
        s = s.removeLast(2);
    if (s.endsWith(".00"))
        s = s.removeLast(3);
    return s;
};
//# sourceMappingURL=global.js.map