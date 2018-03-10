let rules = [
    [/([A-Z]d[A-Z])/, "M"],
    [/([A-Z]O)/, "X"],
    [/([A-Z][a-z][A-Z])/, "B"],
];
//export function Identifier()
let id = 0;
class Node {
    constructor(a, b, c, d, e) {
        this.nodes = [];
        this.id = id++;
        this.nodes = [a, b, c, d, e].filter(t => t != null);
        //console.log(this.constructor.name, this.nodes.map(t=>t.constructor.name));
    }
    toString() {
        return this.value;
    }
}
class Operator extends Node {
}
class Dot extends Node {
    toString() {
        return ".";
    }
}
class BinaryOperator extends Operator {
    constructor(left, op, right) {
        super();
        this.left = left;
        this.op = op;
        this.right = right;
    }
    toString() {
        return ["(", this.left, this.op, this.right, ")"].join(""); // + this.nodes.map(t => t.toString()).join(" ") + ")";
    }
}
class Plus extends Node {
    toString() {
        return "+";
    }
}
class Const extends Node {
}
class Multiply extends Node {
    toString() {
        return "*";
    }
}
class Identifier extends Node {
    toString() {
        return this.value + this.id;
    }
}
class Invocation extends Node {
    constructor(target, args) {
        super();
        this.target = target;
        this.args = args;
    }
    toString() {
        return "(" + this.target + this.args + ")";
    }
}
class ParenthesizedExpression extends Node {
    toString() {
        return "( " + this.nodes.join("") + " )";
    }
}
class Member extends Node {
    constructor(left, dot, right) {
        super();
        this.left = left;
        this.dot = dot;
        this.right = right;
    }
    toString() {
        return ["(", this.left, this.dot, this.right, ")"].map(t => t.toString()).join("");
    }
}
let mapping = {
    "I": Identifier,
    "X": Invocation,
    "d": Dot,
    "O": ParenthesizedExpression,
    "p": Plus,
    "C": Const,
    "x": Multiply,
    "M": Member,
    "B": BinaryOperator,
};
function toNotation(node) {
    for (let key of Object.keys(mapping)) {
        let value = mapping[key];
        if (value == node.constructor)
            return key;
    }
    return null;
}
function createFromNotation(s, args) {
    let ctor = mapping[s];
    if (ctor == null)
        throw new Error("ctor not found for " + JSON.stringify(s));
    //console.log(ctor);
    let node = new ctor(args[0], args[1], args[2], args[3], args[4]);
    node.value = s;
    return node;
}
export function parseExpression(nodes) {
    let tokens = nodes.map(t => toNotation(t)).join("");
    //let realTokens = Array.from(tokens).map(t => toNotation(t));
    //let realTokens: string[] = Array.from(tokens);
    for (let i = 0; i < 100; i++) {
        //console.log(tokens);
        //console.log(nodes.join(""));
        //if (tokens != realTokens.join(""))
        //    throw new Error("bad replace");
        let res = _parseExpression(tokens, nodes);
        if (res == tokens)
            return res;
        tokens = res;
    }
    return tokens;
}
function _parseExpression(tokens, nodes) {
    for (let rule of rules) {
        let res = tryRule(tokens, nodes, rule[0], rule[1]);
        if (res != tokens) {
            console.log("rule matched", tokens, nodes.join(""), nodes, rule);
            return res;
        }
    }
    return tokens;
}
function tryRule(tokens, nodes, find, replace) {
    let res = find.exec(tokens);
    if (res != null) {
        //console.log("STR: ", tokens);
        //console.log("TOK: ", realTokens);
        //console.log(res, res.index, res.length);//, res[0], res[1], res[1].length);
        let tokens2 = tokens.replace(find, replace);
        //let replace2 = createFromNotation(replace, )
        let removed = nodes.splice(res.index, res[1].length);
        let newNode = createFromNotation(replace, removed);
        nodes.splice(res.index, 0, newNode);
        //console.log("STR: ", tokens2);
        //console.log("TOK: ", realTokens);
        return tokens2;
    }
    return tokens;
}
function main() {
    // abc.def.ghj() + 7 * abc()
    /*
              *
         +        abc()
 abc.def.ghj()       7

    */
    let s = "IdIdIOpCxIO";
    let nodes = Array.from(s).map(t => createFromNotation(t, []));
    console.log(nodes);
    console.log(nodes.join(""));
    let result = parseExpression(nodes);
    console.log(nodes.join(""));
    console.log(nodes);
    //console.log("SRC:", s);
    //console.log("FINAL: ", JSON.stringify(nodes[0].toString()));//JSON.stringify(nodes)); //a.b.hello() + 7 * foo()
}
main();
