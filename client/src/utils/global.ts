interface StringConstructor {
    isNullOrEmpty(s: string): boolean;
    isNotNullOrEmpty(s: string): boolean;
    Format(format: string, ...args: any[]): string;
}

interface Array<T> {
    StringConcat(selector: (obj: T) => any, prefix: string, separator: string, suffix: string): string;
    GetSiblingOrEdge(item: T, offset: number): T;
    ItemGetter<V>(prop: JsFunc1<T, V>): JsFunc1<T, V>;
}
let DefaultDateFormat = "yyyy-MM-dd HH:mm:ss";


Array.prototype.GetSiblingOrEdge = function <T>(item: T, offset: number): T {
    let list: T[] = this;
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
}

interface String {
    equalsIgnoreCase(s: string): boolean;
    removeLast(x?: number): string;
    ToDefaultDate(): Date;
}

String.prototype.ToDefaultDate = function () {
    return Date.tryParseExact(this, DefaultDateFormat);
}

String.isNullOrEmpty = s => s == null || s == "";
String.isNotNullOrEmpty = s => s != null && s != "";
String.prototype.equalsIgnoreCase = function (s: string): boolean {
    let x: string = this;
    let xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0;
    console.log("EIC", this, s, xx);
    return xx;
}
String.prototype.removeLast = function (x?: number): string {
    let s: string = this;
    if (x == null)
        x = 1;
    return s.substr(0, s.length - x);

}

enum Keys {
    Enter = 13,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    Up = 38,
    Down = 40,
}

interface Function {
    ToComparer<T, V>(desc?: boolean): JsFunc2<T, T, number>;
}

interface Date {
    ToFriendlyRelative2(): string;
}

interface Number {
    ToFriendlySize(): string;
    toFriendlyNumber(): string;
}

Date.prototype.ToFriendlyRelative2 = function (rel?: Date) {
    let dt: Date = this;
    if (rel == null)
        rel = new Date();
    if (dt.year() == rel.year()) {
        if (dt.month() == rel.month()) {
            if (dt.day() == rel.day()) {
                return dt.format("HH:mm");//.toLowerCase();
            }
            return dt.format("MMM d");
        }
        return dt.format("MMM d");
    }
    return dt.format("d/M/yy");
}
Number.prototype.ToFriendlySize = function (): string {
    let bytes: number = this;
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

Number.prototype.toFriendlyNumber = function (): string {
    let x: number = this;
    let s: string;
    if (x == 0)
        return "0";
    if (x > 0 && x < 10)
        s = x.toFixed(2);
    else if (x >= 10 && x < 100)
        s = x.toFixed(1);
    else
        s = x.toFixed(0);
    //while (s.endsWith("0"))
    //    s = s.removeLast(1);
    if (s.endsWith(".0"))
        s = s.removeLast(2);
    if (s.endsWith(".00"))
        s = s.removeLast(3);
    return s;
}



//Function.prototype.nameof = function <T>(this: { new (): T }, selector: SelectorFunc<T, any>) {
//}

//interface Function {
//    nameof<T>(this: { new (): T }, selector: SelectorFunc<T, any>);
//}


//interface Contact {
//    xxx:string;
//    new():Contact;
//}


interface LessStatic {
    modifyVars(obj:any);
}


