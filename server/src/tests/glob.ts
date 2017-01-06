import * as fs from "fs"
import * as process from "process"
import * as path from "path"
//import { Glob } from "glob";
//var mg = new Glob("**/*.{mkv,mp4,avi,mp3,flac}", { cwd: "C:/", debug: true, globDebug: true, });
//let matches = [];
//mg.on("match", e => { matches.push(e); console.log("match", matches.length, e, ); });
//mg.on("error", e => console.log("error", e));
//mg.on("end", e => console.log("end", e.length));


//setTimeout(() => console.log("5 seconds passed", 5000));


export function* scan(startDir: string): Iterable<ScanItem> {
    let stack: string[] = [];
    stack.push(startDir);
    while (stack.length > 0) {
        let dir = stack.pop();
        try {
            let children = fs.readdirSync(dir);
            yield { dir, children };
            for (let child of children) {
                let childPath = path.join(dir, child);
                try {
                    let stat = fs.statSync(childPath);
                    if (!stat.isDirectory())
                        continue;
                }
                catch (e) {
                    continue;
                }
                stack.push(childPath);
            }
        }
        catch (e) {
            continue;
        }
    }
}

export interface ScanItem {
    dir: string;
    children: string[];
}

function test() {
    let i = 0;
    for (let x of scan("C:\\")) {
        if (i > 1000000)
            return;
        if (i % 10000 == 0)
            console.log(i, x.dir);
        i++;
    }
}
test();