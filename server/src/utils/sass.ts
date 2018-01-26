import { render, Result } from 'node-sass';
import * as fse from 'fs-extra'

let files = [
    ["client/scss/main.scss", "client/css/main.css"],
    ["client/src/media.component.scss", "client/src/media.component.css"],
];

export async function main() {
    for (let file of files) {
        console.log(file[0], file[1]);
        await execSass(file[0], file[1]);
    }
}

export async function execSass(inFile: string, outFile: string): Promise<Result> {
    let res = await _execSass(inFile, outFile);
    await fse.writeFile(outFile, res.css);
    return res;
}

export function _execSass(inFile: string, outFile: string): Promise<Result> {
    return new Promise((resolve, reject) => {
        render({
            file: inFile,
            outputStyle: 'nested',
            outFile: outFile,
            sourceMap: false,
        }, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });

    });


}