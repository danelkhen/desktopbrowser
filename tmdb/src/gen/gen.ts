let _doc: SwaggerDoc;
let _nameIndex = 0;
let _extra = [];
let _module = new Module();
_module.name = "MyModule";
type Tokens = any;
let _md: any = {};
function xhrGetJson(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => resolve(JSON.parse(xhr.response)),
            xhr.onerror = () => reject(xhr.response),
            xhr.send();
    });
}

function main() {
    xhrGetJson("../../tmdb.swagger.json").then(e => _doc = e).then(main2);
}

function main2() {
    normalizeDoc(_doc);
    console.log(_doc);
    let methodss = _doc.pathsList.map(processPath);
    //console.log(methodss);
    postProcess(methodss);
    console.log(_module);
    let pre = document.createElement("pre");
    pre.textContent = _module.toCode();
    document.body.appendChild(pre);
}

function postProcess(methodss: Method[][]) {
    let serviceClass = new Type();
    serviceClass.name = "Client";
    _module.members.splice(0, 0, serviceClass);

    methodss.forEach(methods => serviceClass.members.push(...methods));
    let methods = serviceClass.members.filter(t => t instanceof Method) as Method[];
    methods.forEach(method => {
        let ce = new Type();
        let name = method.name[0].toUpperCase() + method.name.substr(1) + "Request";
        ce.name = name;
        ce.members.push(...method.parameters.map(t => new Property(t as any as Property)));
        ce.members.forEach(t => t.isOptional = true);
        _module.members.push(ce);
        method.parameters = [new Parameter({ name: "req", type: getTypeRef(ce) })];
    });

    let types = _module.members.filter(t => t instanceof Type) as Type[];

    let skip = new Set<Type>();
    let duplicates: Array<Set<Type>> = [];//{ ce: Type, duplicates: Type[] }[] = [];
    types.forEach(ce1 => {
        if (skip.has(ce1))
            return;
        let entry = new Set<Type>();//{ ce: ce1, duplicates: new Array<Type>(), all:Type[] };
        duplicates.push(entry);
        types.forEach(ce2 => {
            if (skip.has(ce2))
                return;
            entry.add(ce1);
            if (ce1 != ce2 && isTypeEquals(ce1, ce2)) {
                if ((ce1.name + ce2.name).indexOf("SearchSearchMoviesResponse") >= 0) {
                    isTypeEquals(ce1, ce2);
                }
                skip.add(ce1);
                skip.add(ce2);
                entry.add(ce2);
                //console.log("similar types", { x:ce1.name, y:ce2.name, entry, duplicates });
            }
        });
    });
    //console.log(duplicates);
    duplicates = duplicates.filter(t => t.size > 1);
    console.log(duplicates);
    let baseIndex = 1;
    duplicates.forEach(set => {
        let list = Array.from(set);
        console.log("merging duplicates", list.map(t => t.name));
        let ce = new Type();
        let ce2 = list[0];
        ce.name = ce2.name + "Base";// + (baseIndex++);
        ce.members.push(...ce2.members);
        set.forEach(t => t.extends.push(getTypeRef(ce)));
        //set.forEach(t => t.members = []);
        set.forEach(t => t.name = ce.name);
        _module.members = _module.members.filter(t => !set.has(t as any));
        _module.members.push(ce);
        //console.log(ce);
    });


    (_module.members.filter(t => t instanceof Type) as Type[]).forEach(ce => ce.members.sort((a, b) => a.name.localeCompare(b.name)));
    _module.members.push(new Variable({ name: "Metadata", value: JSON.stringify(_md, exceptParentReplacer, TAB) }));
}

function isTypeRefEquals(x: TypeRef, y: TypeRef): boolean {
    if (x.type != null && y.type != null) {
        if (!isTypeEquals(x.type, y.type))
            return false;
    }
    else if (x.name != y.name)
        return false;
    if (x.args.length != y.args.length)
        return false;
    if (x.args.find((t, i) => !isTypeRefEquals(t, y.args[i])) != null)
        return false;
    return true;
}

function isTypeEquals(x: Type, y: Type): boolean {
    if (x.members.length != y.members.length)
        return false;
    for (let me1 of x.members) {
        let me2 = y.members.find(t => t.name == me1.name);
        if (me2 == null)
            return false;
        let tr1 = me1.type;
        let tr2 = me2.type;
        if (!isTypeRefEquals(tr1, tr2))
            return false;
    }
    return true;
}
interface KeyValue<T> {
    key: string;
    value: T;
}
//interface HasKey {
//    key: string;
//}

function normalizeHash<T>(obj: Hash<T>, keys?: string[]): KeyValue<T>[] {
    if (obj == null)
        return [];
    if (keys == null)
        keys = Object.keys(obj);
    return keys.map(key => {
        let value = obj[key];
        if (value == null)
            return null;
        if (typeof (value) != "object")
            return null; //value = { value } as any as T;
        return { key, value };
    }).filter(t => t != null);
}
//function normalizeHash2<T extends HasKey>(obj: Hash<T>, keys?: string[]): T[] {
//    if (obj == null)
//        return [];
//    if (keys == null)
//        keys = Object.keys(obj);
//    return keys.map(key => {
//        let value = obj[key];
//        if (value == null)
//            return null;
//        if (typeof (value) != "object")
//            return null; //value = { value } as any as T;
//        value.key = key;
//        return value;
//    }).filter(t => t != null);
//}
function normalizeDoc(doc: SwaggerDoc) {
    doc.definitionsList = normalizeHash(doc.definitions);
    //Object.keys(doc.paths).forEach(path => {
    //    let pi = doc.paths[path];
    //    Object.keys(pi).forEach(method => {
    //        let pi2 = pi[method];

    //    });
    //});
    doc.pathsList = normalizeHash(doc.paths);
    doc.pathsList.forEach(path => {
        path.value.methods = normalizeHash(path.value as any as Hash<SwaggerMethod>, ["get", "post", "put", "delete"]);
        path.value.methods.forEach(method => {
            method.value.responsesList = normalizeHash(method.value.responses);
            method.value.responsesList.forEach(response => response.value.schemaObj = normalizeDef(response.value.schema));
        });
    });
    addParents(doc);
    return doc;
}
function addParents(obj, parent?) {
    if (obj == null || typeof (obj) != "object")
        return obj;
    if (obj instanceof Array) {
        obj.forEach(t => addParents(t, obj));
    }
    else {
        Object.keys(obj).forEach(key => key != "_parent" ? addParents(obj[key], obj) : null);
    }
    obj._parent = parent;
    return obj;
}

function tryParseJson(s: string) {
    try {
        return JSON.parse(s);

    } catch (e) {
        return null;
    }
}


function getBraces(s: string) {
    let closers = { "{": "}", "[": "]" };
    let sb = [];
    for (let char of s) {
        if (/[\{\[]/.test(char)) {
            sb.push(char);
        }
        else if (/[\}\]]/.test(char)) {
            let closer = char;
            let opener = sb.pop();
            if (closers[opener] != closer) {
                console.warn("invalid json braces", { opener, closer, json: s });
            }
        }
    }
    let res = { opened: sb.join(""), missing: "" };
    res.missing = res.opened.replace(/\{/g, "}").replace(/\[/g, "]");
    res.missing = Array.from(res.missing).reverse().join("");
    //res.missing
    return res;
}
function normalizeDef(def2: SwaggerDef | string): SwaggerDef {
    let def: SwaggerDef;
    if (typeof (def2) == "string") {
        let s = def2;
        if (s.startsWith("{")) {
            if (s.endsWith(","))
                s = s.substr(0, s.length - 1);
            def = tryParseJson(s);
            if (def == null) {
                let braces = getBraces(s);
                s += braces.missing;
                def = tryParseJson(s);
                if (def == null) {
                    console.warn("can't parse schema json string", { def2, s, braces });
                    return def2 as any;
                }
            }
        }
        else
            def = { type: def2, propertiesList: [], properties: null, items: null, _parent: null };
    }
    else {
        def = def2 as SwaggerDef;
    }


    if (def.properties != null) {
        def.propertiesList = normalizeHash(def.properties);
        def.propertiesList.forEach(t => t.value = normalizeDef(t.value));
    }
    if (def.items != null) {
        def.items = normalizeDef(def.items);
    }
    return def;
}

function tokensToString(tokens: any, sb: string[]) {
    if (tokens == null)
        return;
    if (tokens instanceof Array)
        tokens.forEach(t => tokensToString(t, sb));
    else {
        sb.push(tokens);
    }
}

function processPath(path2: KeyValue<SwaggerPath>): Method[] {
    let pi = path2.value;
    let path = path2.key;

    //let methodNames = ["get", "delete", "post", "put"];
    //let methods = methodNames.map(t => <KeyValue<SwaggerMethod>>{ key: t, value: pi[t] }).filter(t => t.value != null);
    //console.log({ methods, methods2:pi.methods });
    //return methods.map(method => ["@", path.key, "() ", processMethod(method), ";\n"]);
    //console.log("PATH", path);
    let methods2 = pi.methods.map(method => {
        let me2 = processMethod(method.value, path2);
        if (pi.parameters != null) {
            let pathParams = pi.parameters.map(processParameter);
            me2.parameters.splice(0, 0, ...pathParams);
            //console.log({ pathParams, prms: path.parameters });
        }
        let md = { path: path, method: method.key };
        _md[me2.name] = md;
        //me2.attributes.push("@url(" + JSON.stringify(md) + ")");
        return me2;
    });
    return methods2;
}

let _usedNames = new Set<string>();
function getUniqueName(baseName: string, set?: Set<string>): string {
    if (set == null)
        set = _usedNames;
    let name = baseName;
    let index = 1;
    while (_usedNames.has(name)) {
        index++;
        name = baseName + index;
    }
    _usedNames.add(name);
    return name;
}

function processMethod(me: SwaggerMethod, path2: KeyValue<SwaggerPath>): Method {
    console.log("METHOD", path2.key, me.summary, me.operationId);

    let me2 = new Method();
    let name = me.summary.replace(/ /g, "");
    name = path2.key.split("/")[1] + name;
    name = getUniqueName(name);
    let methodName = name[0].toLowerCase() + name.substr(1);
    let typeName = name[0].toUpperCase() + name.substr(1);


    me2.name = methodName;//me.operationId;
    me2.parameters = (me.parameters || []).map(processParameter);
    let retType = me.responses["200"] == null ? <SwaggerDef>{ type: "any" } : me.responses["200"].schemaObj;
    //let retCe = 
    me2.type = processDef(retType, typeName + "Response"); //getTypeRef(retCe);// processDefTypeName(retType);
    return me2;
    //return [me.operationId, "(", (me.parameters || []).map(processParameter).withValueBetweenItems(", "), ")", ": ", processDefTypeName(retType)];
}

function exceptParentReplacer(key, value) {
    if (key == "_parent")
        return undefined;
    return value;
}
function processParameter(prm: SwaggerParameter): Parameter {
    let prm2 = new Parameter({
        name: prm.name,
        type: processType(prm.type),
        attributes: [prm],
    });
    return prm2;
    //[prm.name, ":", prm.type];
}
function processType(ce: SwaggerType): TypeRef {
    //if (typeof (ce) == "object")
    //    return processDef(ce as SwaggerDef);
    let tr = new TypeRef();
    if (ce instanceof Array) {
        let list = ce as any as string[];
        tr.name = list.filter(t => t != "null").join(" | ");
    }
    else
        tr.name = ce;
    return tr;
}

function getTypeRef(ce: Type, typeArgs?: TypeRef[]): TypeRef {
    let tr = new TypeRef();
    tr.name = ce.name;
    tr.type = ce;
    tr.args = typeArgs || [];
    return tr;
}
//function processDefTypeName(ce: SwaggerDef): TypeRef {
//    if (ce.type == "object") {
//        ce.type = "Type" + (++_nameIndex);
//        let ce2 = processDef(ce);
//        //_extra.push(processDef(ce));
//        return getTypeRef(ce2);
//        //return "Type" + (++_nameIndex);
//    }
//    return processType(ce.type);
//}

function processDef(ce: SwaggerDef, name?: string): TypeRef {
    if (ce.type == "object") {
        let ce2 = new Type();
        ce2.name = name || "Type" + (++_nameIndex);
        ce.type = ce2.name;
        if (ce.propertiesList != null) {
            ce2.members = ce.propertiesList.map(t => processProperty(t, ce2.name));
        }
        let ce3 = _module.members.find(t => t.name == ce2.name)
        if (ce3 != null)
            console.warn("two classes with the same name found", ce2.name, ce2, ce3);
        _module.members.push(ce2);
        return getTypeRef(ce2);
    }
    if (ce.type == "array") {
        let typeArgs = [processDef(ce.items, name)];
        return getTypeRef(new Type({ name: "Array" }), typeArgs);
    }
    //console.log(ce);
    return processType(ce.type);
    //return ["export interface ", ce.type, "{\n", ce.propertiesList.map(processProperty).withValueBetweenItems(";\n"), "\n}\n"];
}
function processProperty(pe: KeyValue<SwaggerDef>, className?: string): Tokens {
    let pe2 = new Property();
    pe2.name = pe.key;
    pe2.type = processDef(pe.value, className + "_" + pe2.name);
    return pe2;
    //return [pe.key, ":", processDefTypeName(pe)];
}

function toList<T>(obj: Hash<T>) {
    return Object.keys(obj).map(t => <HashKeyValue<T>>{ key: t, value: obj[t] });
}



