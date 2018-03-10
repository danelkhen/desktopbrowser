"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const child_process = require("child_process");
exports.projects = ["server", "client"];
async function tsc() {
    for (let project of exports.projects)
        await exec(`tsc -p ${project}`);
}
exports.tsc = tsc;
async function compile() {
    await tsc();
    //await lessc();
    //await tmplc();
}
exports.compile = compile;
async function server() { await exec("node server/out/server"); }
exports.server = server;
async function serverDebug() { await exec("node --inspect server/out/server"); }
exports.serverDebug = serverDebug;
async function serverWatch() { await exec("nodemon server/out/server.js -w server/out"); }
exports.serverWatch = serverWatch;
async function serverPm2Start() { await exec("pm2 start server/out/server.js --name desktopbrowser"); }
exports.serverPm2Start = serverPm2Start;
async function serverPm2Stop() { await exec("pm2 stop server/out/server.js"); }
exports.serverPm2Stop = serverPm2Stop;
async function serverPm2Restart() { await exec("pm2 restart server/out/server.js"); }
exports.serverPm2Restart = serverPm2Restart;
async function loadtest() { await exec(`loadtest -c 500 -t 10 --rps 500 "https://opencode.be/sleep?ms=1000"`); }
exports.loadtest = loadtest;
async function sass() {
    await exec(`node-sass --linefeed lf --output-style nested client/scss/ --output client/css/`);
    await exec(`node-sass --linefeed lf --output-style nested client/src/ --output client/src/`);
}
exports.sass = sass;
async function sassWatch() {
    await Promise.all([
        exec(`node-sass --watch --linefeed lf --output-style nested client/scss/ --output client/css/`),
        exec(`node-sass --watch --linefeed lf --output-style nested client/src/ --output client/src/`),
    ]);
}
exports.sassWatch = sassWatch;
//export async function compileSassWatch() { await exec(`sass --watch client/scss/main.scss:client/css/main.css client/src/media.component.scss:client/src/media.component.css --unix-newlines --sourcemap=none`); }
function compileWatch() {
    let promises = [];
    for (let project of exports.projects)
        promises.push(exec(`tsc -w -p ${project}`, { name: project }));
    promises.push(exec(`node-sass --watch --linefeed lf --output-style nested client/scss/ --output client/css/`), exec(`node-sass --watch --linefeed lf --output-style nested client/src/ --output client/src/`));
    //promises.push(exec(`watch-run -i -p src/editor/index.less,src/editor/index2.less node run lessc`));
    //promises.push(exec(`watch-run -i -p src/editor/*.html node run tmplc`));
    return Promise.all(promises);
}
exports.compileWatch = compileWatch;
function exec(cmd, opts) {
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
exports.exec = exec;
function help() {
    let commands = Object.keys(actions).concat(Object.getOwnPropertyNames(exports));
    commands.sort();
    commands.forEach(t => console.log(t));
}
exports.help = help;
async function docs() {
    await exec("cd src/infra && typedoc --out ../../docs && cd ../..");
}
exports.docs = docs;
let actions = {
    "sass-w": sassWatch,
    "compile-w": compileWatch,
    "server-d": serverDebug,
    "server-w": serverWatch,
    "pm2-start": serverPm2Start,
    "pm2-restart": serverPm2Restart,
    "pm2-stop": serverPm2Stop,
};
async function main() {
    try {
        let action = process.argv[2];
        if (action == null)
            action = "help";
        console.log(action);
        let func = actions[action] || exports[action];
        await func();
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
exports.main = main;
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
