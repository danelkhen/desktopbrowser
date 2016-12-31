import { readFileSync } from "fs";
import { SourceFile, Node, forEachChild, SyntaxKind, createSourceFile, ScriptTarget } from "typescript";
import * as ts from "typescript";


export function delint(sourceFile: SourceFile) {
    delintNode(sourceFile);

    function delintNode(node: Node) {
        if (node.kind == SyntaxKind.InterfaceDeclaration) {
        }

        forEachChild(node, delintNode);
    }

    function report(node: Node, message: string) {
        let { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    let sourceFile = createSourceFile(fileName, readFileSync(fileName).toString(), ScriptTarget.ES5, /*setParentNodes */ true);

    let ce = sourceFile.statements.find(t => t.kind == SyntaxKind.InterfaceDeclaration) as ts.InterfaceDeclaration;
    let ceName = ce.name.getText(sourceFile);
    console.log(`class ${ceName}Client extends Proxy<${ceName}> {`);
    let members = ce.members.filter(t => t.kind == SyntaxKind.MethodSignature) as ts.MethodSignature[];
    let lines = members.map(me => {
        let me2 = {
            name: me.name.getText(sourceFile),
            prm: { type: me.parameters[0].type.getText(sourceFile), name: me.parameters[0].name.getText(sourceFile) },
            type: me.type.getText(sourceFile),
        };
        let line = `    ${me2.name}(${me2.prm.name}: ${me2.prm.type}): Promise<${me2.type}> { return this.invoke(t => t.${me2.name}(${me2.prm.name})); }\n`;
        return line;
    });
    console.log(lines.join(""));
    //let list = getChildren(sourceFile).filter(t => t.kind == SyntaxKind.InterfaceDeclaration) as ts.InterfaceDeclaration[];
    //let ce = list[0];

    //console.log(getChildren(ce));//.forEach(t => console.log(SyntaxKind[t.kind], t.getText(sourceFile)));
    //getChildren(ce).forEach(t => console.log(SyntaxKind[t.kind], t.getText(sourceFile)));
    //forEachChild(ce, t => console.log(SyntaxKind[t.kind], t.getText(sourceFile)));
    console.log("}");
    //list.forEach(t => console.log(t.name.getText(sourceFile)));

    //console.log(SyntaxKind[sourceFile.statements[0].kind]);



    // delint it
    //delint(sourceFile);
});

export function getChildren(node: Node): Node[] {
    let list: Node[] = [];
    forEachChild(node, t => list.push(t));
    return list;
}

