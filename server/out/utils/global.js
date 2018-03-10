String.isNullOrEmpty = s => s == null || s == "";
String.isNotNullOrEmpty = s => s != null && s != "";
String.prototype.equalsIgnoreCase = function (s) {
    let x = this;
    let xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0;
    return xx;
};
String.prototype.removeLast = function (x) {
    let s = this;
    if (x == null)
        x = 1;
    return s.substr(0, s.length - x);
};
Date.prototype.ToDefaultString = function () {
    let defaultDateFormat = "yyyy-MM-dd HH:mm:ss";
    return this.format(defaultDateFormat);
};
if (typeof (Symbol.asyncIterator) == "undefined") {
    let x = Symbol;
    x.asyncIterator = Symbol("asyncIterator");
}
