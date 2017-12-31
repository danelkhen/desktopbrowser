﻿let rxq: string[] = [];
let webSocket: WebSocket;
function main() {
    let url = location.href.replace(/^https|http/, "ws");
    webSocket = new WebSocket(url, ["protocolOne", "protocolTwo"]);
    webSocket.addEventListener("message", e => {
        console.log(e.data);
        rxq.push(e.data);
    });
    // Connection opened
    webSocket.addEventListener('open', e => {
        //socket.send('Hello Server!');
    });
}

async function* iterateEvent(target: EventTarget, name: string): AsyncIterableIterator<any> {
    let list: Promise<any>[] = [];
    let pResolve: Function;
    let p = new Promise((resolve, reject) => pResolve = resolve);
    list.push(p);
    target.addEventListener(name, e => {
        pResolve(e);
        p = new Promise((resolve, reject) => pResolve = resolve);
        list.push(p);
    });

    for (let p of list) {
        let item = await p;
        yield item;
    }
}



function send(cmd: string) {
    webSocket.send(cmd);
    let result: any;

    webSocket.addEventListener("message", e => {

        let data = e.data;
        if (data == "[") {
            result = [];
        }
        else if (data.endsWith(",")) {
            let item = JSON.parse(data.substr(0, data.length - 1));
            result.push(item);
        }
        else if (data == "]") {
            //done();
        }
        else {
            result = JSON.parse(data);
            // done();
        }
    });

}

function receive(data: string) {

}

export interface Request {


}

export interface Response<T> {
    error: any;
    result: T;
    resultType: "iterable" | "object";
    isComplete: boolean;
}

