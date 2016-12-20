let _doc: SwaggerDoc;
let _nameIndex = 0;
let _extra = [];

main();

type Tokens = any;

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
    xhrGetJson("/tmdb.swagger.json").then(e => _doc = e).then(main2);
}

function main2() {
    normalizeDoc(_doc);
    let res: any[] = _doc.pathsList.map(processPath);
    let sb = [];
    tokensToString(_extra, sb);
    tokensToString(res, sb);
    let pre = document.createElement("pre");
    pre.textContent = sb.join("");
    document.body.appendChild(pre);
    //console.log();
}

interface HasKey {
    key: string;
}

function normalizeHash<T extends HasKey>(obj: Hash<T>, keys?: string[]): T[] {
    if (obj == null)
        return [];
    if (keys == null)
        keys = Object.keys(obj);
    return keys.map(key => {
        let value = obj[key];
        if (value == null)
            return null;
        value.key = key;
        return value;
    }).filter(t => t != null);
}
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
        path.methods = normalizeHash(path as any as Hash<SwaggerMethod>, ["get", "post", "put", "delete"]);
        path.methods.forEach(method => {
            method.responsesList = normalizeHash(method.responses);
            method.responsesList.forEach(response => normalizeDef(response.schema));
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
function normalizeDef(def: SwaggerDef): SwaggerDef {
    if (def.items != null) {
        def.itemsList = normalizeHash(def.items);
        def.itemsList.forEach(normalizeDef);
    }
    if (def.properties != null) {
        def.propertiesList = normalizeHash(def.properties);
        def.propertiesList.forEach(normalizeDef);
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

function processPath(path: SwaggerPath) {
    let methods = [path.get, path.delete, path.post, path.put].filter(t => t != null);
    return methods.map(method => ["@", path.key, "() ", processMethod(method), ";\n"]);
}
function processMethod(me: SwaggerMethod) {
    let retType = me.responses["200"] == null ? <SwaggerDef>{ type: "any" } : me.responses["200"].schema;
    return [me.operationId, "(", (me.parameters || []).map(processParameter).withValueBetweenItems(", "), ")", ": ", processDefTypeName(retType)];
}

function processParameter(prm: SwaggerParameter): Tokens {
    return [prm.name, ":", prm.type];
}
function processType(ce: SwaggerType) {
    if (ce instanceof Array)
        return ce.join(" | ");
    return [ce];
}

function processDefTypeName(ce: SwaggerDef) {
    if (ce.type == "object") {
        ce.type = "Type" + (++_nameIndex);
        _extra.push(processDef(ce));
        return "Type" + (++_nameIndex);
    }
    return [processType(ce.type)];
}

function processDef(ce: SwaggerDef) {
    return ["export interface ", ce.type, "{\n", ce.propertiesList.map(processProperty).withValueBetweenItems(";\n"), "\n}\n"];
}
function processProperty(pe: SwaggerDef): Tokens {
    return [pe.key, ":", processDefTypeName(pe)];
}

function toList<T>(obj: Hash<T>) {
    return Object.keys(obj).map(t => <HashKeyValue<T>>{ key: t, value: obj[t] });
}

interface Hash<T> {
    [key: string]: T
}

interface HashKeyValue<T> {
    key: string;
    value: T;
}
interface SwaggerElement {
    _parent: SwaggerElement;
}
interface SwaggerDoc extends SwaggerElement {
    definitions: Hash<SwaggerDef>;
    definitionsList: SwaggerDef[];
    paths: Hash<SwaggerPath>;
    pathsList: SwaggerPath[];
}
interface SwaggerDef extends SwaggerElement, HasKey {
    type: SwaggerType;
    properties: Hash<SwaggerDef>;
    propertiesList: SwaggerDef[];
    items: Hash<SwaggerDef>;
    itemsList: SwaggerDef[];
}
type SwaggerType = string | string[];
interface SwaggerPath extends SwaggerElement, HasKey {
    get: SwaggerMethod;
    post: SwaggerMethod;
    delete: SwaggerMethod;
    put: SwaggerMethod;

    parameters: SwaggerParameter[];
    methods: SwaggerMethod[];
}
interface SwaggerMethod extends SwaggerElement, HasKey {
    operationId: string;
    summary: string;
    description: string;
    parameters: SwaggerParameter[];
    responses: Hash<SwaggerResponse>
    responsesList: SwaggerResponse[];
}
interface SwaggerParameter extends SwaggerElement {
    name: string;
    in: SwaggerParameterSource,
    required: boolean,
    type: SwaggerType,
    default: any,
    format: string;
    minimum: any;
    maximum: any;

}
type SwaggerParameterSource = "query" | "path" | "header" | "body";
interface SwaggerResponse extends SwaggerElement, HasKey {
    description: string;
    schema: SwaggerDef;
}
interface Array<T> {
    withValueBetweenItems(value: T): T[];
}
Array.prototype.withValueBetweenItems = function <T>(this: Array<T>, value: T): T[] {
    let list: T[] = [];
    this.forEach((t, i) => {
        if (i != 0)
            list.push(value);
        list.push(t);
    });
    return list;
}
