import { FileService2 } from "../file-service2"

async function main() {
    let x = new FileService2();
    let res = x.GetFiles({Path:"C:\\"});
    let list = [];
    for await (let item of res) {
        list.push(item);
    }
    console.log(list);
}

main();