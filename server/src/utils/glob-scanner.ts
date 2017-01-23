import "../../lib/corex/corex"
import * as Path from "path"
import * as Minimatch from "minimatch"
import { FileScanner } from "./file-scanner"

export class GlobScanner {
    patterns: string[] = [];
    dir: string;
    async scan() {
        let scanner = new FileScanner();
        scanner.onDir = async e => {
            for (let pattern of this.patterns) {
                let res = Minimatch(e.path, pattern);
                console.log([e.path.padRight(70, " "), pattern, res].join("\t"));
            }
        };
        await scanner.scan([this.dir]);
    }
}

async function test() {
    let x = new GlobScanner();
    x.patterns = ["!**/books"];
    x.dir = "c:\\tv";
    await x.scan();
    console.log("done");
}

test();
