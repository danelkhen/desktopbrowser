var _doc;
var _nameIndex = 0;
var _extra = [];
main();
function xhrGetJson(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () { return resolve(JSON.parse(xhr.response)); },
            xhr.onerror = function () { return reject(xhr.response); },
            xhr.send();
    });
}
function main() {
    xhrGetJson("/tmdb.swagger.json").then(function (e) { return _doc = e; }).then(main2);
}
function main2() {
    normalizeDoc(_doc);
    var res = _doc.pathsList.map(processPath);
    var sb = [];
    tokensToString(_extra, sb);
    tokensToString(res, sb);
    var pre = document.createElement("pre");
    pre.textContent = sb.join("");
    document.body.appendChild(pre);
    //console.log();
}
function normalizeHash(obj, keys) {
    if (obj == null)
        return [];
    if (keys == null)
        keys = Object.keys(obj);
    return keys.map(function (key) {
        var value = obj[key];
        if (value == null)
            return null;
        value.key = key;
        return value;
    }).filter(function (t) { return t != null; });
}
function normalizeDoc(doc) {
    doc.definitionsList = normalizeHash(doc.definitions);
    //Object.keys(doc.paths).forEach(path => {
    //    let pi = doc.paths[path];
    //    Object.keys(pi).forEach(method => {
    //        let pi2 = pi[method];
    //    });
    //});
    doc.pathsList = normalizeHash(doc.paths);
    doc.pathsList.forEach(function (path) {
        path.methods = normalizeHash(path, ["get", "post", "put", "delete"]);
        path.methods.forEach(function (method) {
            method.responsesList = normalizeHash(method.responses);
            method.responsesList.forEach(function (response) { return normalizeDef(response.schema); });
        });
    });
    addParents(doc);
    return doc;
}
function addParents(obj, parent) {
    if (obj == null || typeof (obj) != "object")
        return obj;
    if (obj instanceof Array) {
        obj.forEach(function (t) { return addParents(t, obj); });
    }
    else {
        Object.keys(obj).forEach(function (key) { return key != "_parent" ? addParents(obj[key], obj) : null; });
    }
    obj._parent = parent;
    return obj;
}
function normalizeDef(def) {
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
function tokensToString(tokens, sb) {
    if (tokens == null)
        return;
    if (tokens instanceof Array)
        tokens.forEach(function (t) { return tokensToString(t, sb); });
    else {
        sb.push(tokens);
    }
}
function processPath(path) {
    var methods = [path.get, path.delete, path.post, path.put].filter(function (t) { return t != null; });
    return methods.map(function (method) { return ["@", path.key, "() ", processMethod(method), ";\n"]; });
}
function processMethod(me) {
    var retType = me.responses["200"] == null ? { type: "any" } : me.responses["200"].schema;
    return [me.operationId, "(", (me.parameters || []).map(processParameter).withValueBetweenItems(", "), ")", ": ", processDefTypeName(retType)];
}
function processParameter(prm) {
    return [prm.name, ":", prm.type];
}
function processType(ce) {
    if (ce instanceof Array)
        return ce.join(" | ");
    return [ce];
}
function processDefTypeName(ce) {
    if (ce.type == "object") {
        ce.type = "Type" + (++_nameIndex);
        _extra.push(processDef(ce));
        return "Type" + (++_nameIndex);
    }
    return [processType(ce.type)];
}
function processDef(ce) {
    return ["export interface ", ce.type, "{\n", ce.propertiesList.map(processProperty).withValueBetweenItems(";\n"), "\n}\n"];
}
function processProperty(pe) {
    return [pe.key, ":", processDefTypeName(pe)];
}
function toList(obj) {
    return Object.keys(obj).map(function (t) { return ({ key: t, value: obj[t] }); });
}
Array.prototype.withValueBetweenItems = function (value) {
    var list = [];
    this.forEach(function (t, i) {
        if (i != 0)
            list.push(value);
        list.push(t);
    });
    return list;
};
