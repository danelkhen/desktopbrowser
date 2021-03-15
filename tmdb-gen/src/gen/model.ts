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
    definitionsList: KeyValue<SwaggerDef>[];
    paths: Hash<SwaggerPath>;
    pathsList: KeyValue<SwaggerPath>[];
}
interface SwaggerDef extends SwaggerElement {
    type: SwaggerType;
    properties: Hash<SwaggerDef>;
    propertiesList: KeyValue<SwaggerDef>[];
    items: SwaggerDef;
    //itemsList: KeyValue<SwaggerDef>[];
}
type SwaggerType = string | string[];
interface SwaggerPath extends SwaggerElement {
    get: SwaggerMethod;
    post: SwaggerMethod;
    delete: SwaggerMethod;
    put: SwaggerMethod;

    parameters: SwaggerParameter[];
    methods: KeyValue<SwaggerMethod>[];
}
interface SwaggerMethod extends SwaggerElement {
    operationId: string;
    summary: string;
    description: string;
    parameters: SwaggerParameter[];
    responses: Hash<SwaggerResponse>
    responsesList: KeyValue<SwaggerResponse>[];
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
interface SwaggerResponse extends SwaggerElement {
    description: string;
    schema: SwaggerDef | string;
    schemaObj: SwaggerDef;
}
interface Array<T> {
    withValueBetweenItems(value: T): T[];
    withValueBetweenItems(value: any): any[];
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

//function join(list: Array<any>, value: any): any[] {
//}

class Entity {
    constructor(ent?: Partial<Entity>) {
        if (ent != null)
            Object.assign(this, ent);
    }
    name: string;
    type: TypeRef;
    parent: Entity;
    attributes: any[] = [];
    toCode(): string {
        let tokens = new CodeWriter().visit(this);
        //console.log({ tokens });
        let sb = [];
        tokensToString(tokens, sb);
        return sb.join("");
    }
    isOptional: boolean;
}
class Type extends Entity {
    constructor(ent?: Partial<Type>) {
        super(ent);
        this.kind = "interface";
    }
    members: Entity[] = [];
    kind: "interface" | "type";
    extends: TypeRef[] = [];
}
class Property extends Entity {
    constructor(ent?: Partial<Property>) { super(ent); }
    parent: Type;
}
class Method extends Entity {
    constructor(ent?: Partial<Method>) { super(ent); }
    parameters: Parameter[] = [];
    parent: Type;
}
class Parameter extends Entity {
    constructor(ent?: Partial<Method>) { super(ent); }
    parent: Method;
}
class TypeRef {
    type: Type;
    name: string;
    args: TypeRef[] = [];
}
class Module extends Entity {
    constructor(ent?: Partial<Module>) { super(ent); }
    members: Entity[] = [];
}
class Variable extends Entity {
    constructor(ent?: Partial<Variable>) { super(ent); }
    value: string;
}


const TAB = "    ";
class CodeWriter {
    constructor() {
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
    typeRefToCode(tr: TypeRef): Tokens {
        let name = tr.type != null ? tr.type.name : tr.name || "any";
        if (name == "object")
            return "Object";
        if (name == "integer")
            return "number";
        if (name == "Array" && tr.args.length == 1)
            return [this.typeRefToCode(tr.args[0]), "[]"];
        return [name, ["<", tr.args.length == 0 ? null : tr.args.withValueBetweenItems(","), ">"]];
    }

    stringifyPropIfNeeded(name: string): string {
        if (/[\.\-]/.test(name))
            return JSON.stringify(name);
        return name;
    }
    visit(obj: any): Tokens {
        if (obj == null || typeof (obj) != "object")
            return obj;
        if (obj instanceof Array) {
            if (obj.some(t => t == null))
                return "";
            if (obj.some(t => typeof (t) == "object"))
                return obj.map(t => this.visit(t));
            return obj;
        }
        let handler = this.map.get(obj.constructor as any);
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
    map: Map<Constructor<any>, Handler<any>> = new Map<Constructor<any>, Handler<any>>();
    register<T>(type: Constructor<T>, handler: Handler<T>) {
        this.map.set(type, handler);
    }

}
type Constructor<T> = { new (): T };
type Handler<T> = (el: T) => Tokens;

