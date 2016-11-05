interface StringConstructor {
    isNullOrEmpty(s: string): boolean;
    isNotNullOrEmpty(s: string): boolean;
    //Format(format: string, ...args: any[]): string;
}

interface Array<T> {
    StringConcat(selector: (obj: T) => any, prefix: string, separator: string, suffix: string): string;
}

interface String {
    equalsIgnoreCase(s: string): boolean;
    removeLast(x?: number): string;
}

String.isNullOrEmpty = s => s == null || s == "";
String.isNotNullOrEmpty = s => s != null && s != "";
String.prototype.equalsIgnoreCase = function (s: string): boolean {
    let x: string = this;
    let xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0;
    return xx;
}
String.prototype.removeLast = function (x?: number): string {
    let s: string = this;
    if (x == null)
        x = 1;
    return s.substr(0, s.length - x);

}


enum Cache {
    NoSlidingExpiration,
}



interface IEnumerable<T> extends Array<T> {
    OrderByDescending?(sel): IOrderedEnumerable<T>;
    OrderBy?(sel): IOrderedEnumerable<T>;
    ToCachedEnumerable?(): CachedIEnumerable<T>;
}
interface IOrderedEnumerable<T> extends IEnumerable<T> {
    ThenByDescending?(sel): IOrderedEnumerable<T>;
    ThenBy?(sel): IOrderedEnumerable<T>;
}

interface CachedIEnumerable<T> extends IEnumerable<T> {
}





class XmlSerializer {
    DeserializeFromFile<T>(filename: string): T {
        throw new Error();
    }
    SerializeToFile(obj: any, filename: string): void {
        throw new Error();
    }
}


class Process {
    static Start(opts: any): Process {
        throw new Error();
    }
    MainWindowHandle: string;
}

interface Date {
    ToDefaultString(): string;
}

Date.prototype.ToDefaultString = function () {
    let defaultDateFormat = "yyyy-MM-dd HH:mm:ss";
    return this.format(defaultDateFormat);

}