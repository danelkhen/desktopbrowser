let rules: [[RegExp, string]] = [
    [/([A-Z]\s*d\s*[A-Z])/, "M"], // member.member
    [/([A-Z]\s*O)/, "I"], // invocation()
    [/([A-Z]\s*[a-z]\s*[A-Z])/, "B"], // exp binaryOp exp
];


//export function Identifier()

class Node {
    constructor(a?, b?, c?, d?, e?) {
        this.nodes = [a, b, c, d, e].filter(t => t != null);
        //console.log(this.constructor.name, this.nodes.map(t=>t.constructor.name));
    }
    nodes: Node[];
    toCode() {
        return this.constructor.name;
    }
}
class Operator extends Node {
}
class Dot extends Operator {
    toCode() {
        return "."+this.nodes.map(t=>t.toCode()).join(" ");
    }
}
class BinaryOperator extends Operator {
    toCode() {
        return "("+this.nodes.map(t=>t.toCode()).join(" ")+")";
    }
}
class Plus extends BinaryOperator {

}
class Const extends BinaryOperator {

}
class Multiply extends BinaryOperator {

}
class Identifier extends Node {
}
class ParenthesizedExpression extends Node {
    toCode() {
        return "()"+" " + this.nodes.map(t=>t.toCode()).join(" ");
    }
}
class Member extends Node {
    constructor(public left, public dot, public right) {
        super();
    }

    toCode() {
        return [this.left, this.dot, this.right].map(t=>t.toCode()).join("");
    }
}

let mapping = {
    "I": Identifier,
    "d": Dot,
    "O": ParenthesizedExpression,
    "p": Plus,
    "C": Const,
    "x": Multiply,
    "M": Member,
    "B": BinaryOperator,
};


function toNotation(node: Node): string {
    for (let key of Object.keys(mapping)) {
        let value = mapping[key];
        if (value == node.constructor)
            return key;
    }
    return null;
}
function createFromNotation(s: string, args: any[]): Node {
    let ctor = mapping[s];
    if (ctor == null)
        throw new Error("ctor not found for " + JSON.stringify(s));
    console.log(ctor);
    let node = new ctor(args[0], args[1], args[2], args[3], args[4]);
    return node;
}

export function parseExpression(nodes: Node[]): string {
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

function _parseExpression(tokens: string, nodes: Node[]): string {
    for (let rule of rules) {
        let res = tryRule(tokens, nodes, rule[0], rule[1]);
        if (res != tokens) {
            return res;
        }
    }
    return tokens;
}
function tryRule(tokens: string, nodes: Node[], find: RegExp, replace: string) {
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
    let nodes = Array.from("IdIdIOpCxIO").map(t => createFromNotation(t, []));
    let result = parseExpression(nodes);

    console.log("FINAL: ", JSON.stringify(nodes[0].toCode()));//JSON.stringify(nodes)); //a.b.hello() + 7 * foo()
}
main();
