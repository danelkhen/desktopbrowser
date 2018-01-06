let rules: [[RegExp, string]] = [
    [/([A-Z]\s*d\s*[A-Z])/, "M"], // member.member
    [/([A-Z]\s*O)/, "I"], // invocation()
    [/([A-Z]\s*[a-z]\s*[A-Z])/, "B"], // exp binaryOp exp
];


//export function Identifier()
let map: {
    "I": Identifier,
    "d": Dot,
    "O": ParenthesizedExpression,
    "p": Plus,
    "C": Const,
    "x": Multiply,
};

class Node {
    constructor(a, b, c, d, e) {
        console.log(this.constructor.name, [a, b, c, d, e]);
        this.nodes = [a, b, c, d, e].filter(t => t != null);
    }
    nodes: Node[];

}
class Operator extends Node {

}
class Dot extends Operator {

}
class BinaryOperator extends Operator {

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

}

function toNotation(node: Node): string {
    for (let key of Object.keys(map)) {
        let value = map[key];
        if (value == node.constructor)
            return key;
    }
    return null;
}
function createFromNotation(s: string, args: any[]): Node {
    let ctor = map[s];
    let node = new ctor(args[0], args[1], args[2], args[3], args[4]);
    return node;
}
let nodes = Array.from("IdIdIO p C x IO").map(t => createFromNotation(t, []));
let result = parseExpression(nodes);
console.log("FINAL: ", JSON.stringify(result)); //a.b.hello() + 7 * foo()

export function parseExpression(realTokens: Node[]): string {
    let tokens = realTokens.map(t => toNotation(t)).join("");
    //let realTokens = Array.from(tokens).map(t => toNotation(t));
    //let realTokens: string[] = Array.from(tokens);
    for (let i = 0; i < 100; i++) {
        console.log(tokens);
        console.log(realTokens.join(""));
        //if (tokens != realTokens.join(""))
        //    throw new Error("bad replace");
        let res = _parseExpression(tokens, realTokens);
        if (res == tokens)
            return res;
        tokens = res;
    }
    return tokens;
}

function _parseExpression(tokens: string, realTokens: Node[]): string {
    for (let rule of rules) {
        let res = tryRule(tokens, realTokens, rule[0], rule[1]);
        if (res != tokens) {
            return res;
        }
    }
    return tokens;
}
function tryRule(tokens: string, realTokens: Node[], find: RegExp, replace: string) {
    let res = find.exec(tokens);
    if (res != null) {
        //console.log("STR: ", tokens);
        //console.log("TOK: ", realTokens);
        //console.log(res, res.index, res.length);//, res[0], res[1], res[1].length);
        let tokens2 = tokens.replace(find, replace);
        //let replace2 = createFromNotation(replace, )
        realTokens.splice(res.index, res[1].length, replace);
        //console.log("STR: ", tokens2);
        //console.log("TOK: ", realTokens);
        return tokens2;
    }
    return tokens;
}

