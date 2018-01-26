import * as fse from "fs-extra"
import * as process from "process"
import * as child_process from "child_process"
import { sleep } from "./utils"
import * as sass2 from "./sass"

export let projects = ["server", "client"]

export async function tsc() {
    for (let project of projects)
        await exec(`tsc -p ${project}`);
}

export async function compile() {
    await tsc();
    //await lessc();
    //await tmplc();
}


export async function server() { await exec("node server/out/server"); }
export async function serverDebug() { await exec("node --inspect server/out/server"); }
export async function serverWatch() { await exec("nodemon server/out/server.js -w server/out"); }
export async function serverPm2Start() { await exec("pm2 start server/out/server.js --name desktopbrowser"); }
export async function serverPm2Stop() { await exec("pm2 stop server/out/server.js"); }
export async function serverPm2Restart() { await exec("pm2 restart server/out/server.js"); }
export async function loadtest() { await exec(`loadtest -c 500 -t 10 --rps 500 "https://opencode.be/sleep?ms=1000"`); }

export async function sass() { await sass2.main(); }
// exec(`sass client/scss/main.scss:client/css/main.css client/src/media.component.scss:client/src/media.component.css --unix-newlines --sourcemap=none`); }
//export async function compileSassWatch() { await exec(`sass --watch client/scss/main.scss:client/css/main.css client/src/media.component.scss:client/src/media.component.css --unix-newlines --sourcemap=none`); }


export function compileWatch(): Promise<any> {
    let promises: Promise<any>[] = [];
    for (let project of projects)
        promises.push(exec(`tsc -w -p ${project}`, { name: project }));
    //promises.push(exec(`watch-run -i -p src/editor/index.less,src/editor/index2.less node run lessc`));
    //promises.push(exec(`watch-run -i -p src/editor/*.html node run tmplc`));
    return Promise.all(promises);
}


export function exec(cmd: string, opts?: { name?: string, prefix?: string }): Promise<any> {
    if (opts == null)
        opts = {};
    let { name, prefix } = opts;
    name = name || "";
    prefix = prefix || (name + "\t");
    return new Promise((resolve, reject) => {
        console.log(cmd);
        let p = child_process.exec(cmd);
        p.stdout.on("data", t => console.log(prefix, String(t).trim()));
        p.stderr.on("data", t => console.log(prefix, String(t).trim()));
        p.on("close", resolve);
    });
}


export function help() {
    let commands = Object.keys(actions).concat(Object.getOwnPropertyNames(exports));
    commands.sort();
    commands.forEach(t => console.log(t));
}
export async function docs() {
    await exec("cd src/infra && typedoc --out ../../docs && cd ../..");
}

let actions = {
    "compile-w": compileWatch,
    "server-d": serverDebug,
    "server-w": serverWatch,
    "pm2-start": serverPm2Start,
    "pm2-restart": serverPm2Restart,
    "pm2-stop": serverPm2Stop,
};
export async function main() {
    try {
        let action = process.argv[2];
        if (action == null)
            action = "help";
        console.log(action);
        let func = actions[action] || exports[action] as Function;
        await func();
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
main();



//export async function tmplc() {
//    await fse.ensureDir(`./src/server/templates/`);
//    for (let key in templates) {
//        let template = templates[key] as TemplateFile<any>;
//        let file = `./src/server/templates/${key}.ts`;
//        console.log(file);
//        await template.saveAsTsModule(file);
//        //await fse.writeFile(, template.func.toString());
//    }
//}
//export async function lessc() {
//    await Promise.all([
//        exec("lessc src/editor/index.less out/editor/index.css"),
//        exec("lessc src/editor/index2.less out/editor/index2.css"),
//    ]);
//}
