Array.prototype.withValueBetweenItems = function (value) {
    let list = [];
    this.forEach((t, i) => {
        if (i != 0)
            list.push(value);
        list.push(t);
    });
    return list;
};
//function join(list: Array<any>, value: any): any[] {
//}
class Entity {
    constructor(ent) {
        this.attributes = [];
        if (ent != null)
            Object.assign(this, ent);
    }
    toCode() {
        let tokens = new CodeWriter().visit(this);
        //console.log({ tokens });
        let sb = [];
        tokensToString(tokens, sb);
        return sb.join("");
    }
}
class Type extends Entity {
    constructor(ent) {
        super(ent);
        this.members = [];
        this.extends = [];
        this.kind = "interface";
    }
}
class Property extends Entity {
    constructor(ent) { super(ent); }
}
class Method extends Entity {
    constructor(ent) {
        super(ent);
        this.parameters = [];
    }
}
class Parameter extends Entity {
    constructor(ent) { super(ent); }
}
class TypeRef {
    constructor() {
        this.args = [];
    }
}
class Module extends Entity {
    constructor(ent) {
        super(ent);
        this.members = [];
    }
}
class Variable extends Entity {
    constructor(ent) { super(ent); }
}
const TAB = "    ";
class CodeWriter {
    constructor() {
        this.map = new Map();
        this.register(Module, t => ["export module ", t.name, " {\n", t.members.map(t => [t, "\n"]), "}\n"]);
        this.register(Type, t => [
            TAB, "export ", t.kind, " ", t.name,
            t.kind == "type" ? [" = ", t.type] : [],
            t.extends.length > 0 ? [" extends ", t.extends.withValueBetweenItems(",")] : [],
            [" {\n", t.members.map(t => [t, "\n"])], TAB, "}\n"
        ]);
        this.register(Property, t => [TAB, TAB, this.stringifyPropIfNeeded(t.name), t.isOptional ? "?" : "", [": ", t.type], ";"]);
        this.register(Variable, t => [TAB, "export let ", t.name, [": ", t.type], [" = ", t.value], ";"]);
        this.register(Method, t => [TAB, TAB, [t.attributes.length == 0 ? null : t.attributes, "\n", TAB, TAB], t.name, "(", t.parameters.withValueBetweenItems(", "), ")", [": ", t.type], ";"]);
        this.register(Parameter, t => [t.name, ": ", t.type]);
        this.register(TypeRef, t => this.typeRefToCode(t));
        //this.register(Array, t => t.some(x => x == null) ? "" : t.map(x => this.visit(x)));
        //this.register(String, t => JSON.stringify(t));
        //this.register(Number, t => JSON.stringify(t));
    }
    typeRefToCode(tr) {
        let name = tr.type != null ? tr.type.name : tr.name || "any";
        if (name == "object")
            return "Object";
        if (name == "integer")
            return "number";
        if (name == "Array" && tr.args.length == 1)
            return [this.typeRefToCode(tr.args[0]), "[]"];
        return [name, ["<", tr.args.length == 0 ? null : tr.args.withValueBetweenItems(","), ">"]];
    }
    stringifyPropIfNeeded(name) {
        if (/[\.\-]/.test(name))
            return JSON.stringify(name);
        return name;
    }
    visit(obj) {
        if (obj == null || typeof (obj) != "object")
            return obj;
        if (obj instanceof Array) {
            if (obj.some(t => t == null))
                return "";
            if (obj.some(t => typeof (t) == "object"))
                return obj.map(t => this.visit(t));
            return obj;
        }
        let handler = this.map.get(obj.constructor);
        if (handler == null)
            throw new Error();
        let res = handler(obj);
        let res2 = this.visit(res);
        return res2;
        //if (typeof (obj) == "object") {
        //    if (obj instanceof Array) {
        //        return obj.map(t => this.visit(t));
        //    }
        //    else {
        //        if (obj instanceof Entity) {
        //            let handler = this.map.get(obj.constructor as any);
        //            if (handler == null)
        //                throw new Error();
        //            return handler(obj);
        //        }
        //        else if (obj instanceof TypeRef) {
        //            return obj.name;
        //        }
        //        else {
        //            throw new Error();
        //        }
        //    }
        //}
        //return JSON.stringify(obj);
    }
    register(type, handler) {
        this.map.set(type, handler);
    }
}
