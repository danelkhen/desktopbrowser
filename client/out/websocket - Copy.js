"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let rxq = [];
let webSocket;
function main() {
    let url = location.href.replace(/^https|http/, "ws");
    webSocket = new WebSocket(url, ["protocolOne", "protocolTwo"]);
    webSocket.addEventListener("message", e => {
        console.log(e.data);
        rxq.push(e.data);
    });
    webSocket.addEventListener('open', e => {
    });
}
async function* iterateEvent(target, name) {
    let list = [];
    let pResolve;
    let p = new Promise((resolve, reject) => pResolve = resolve);
    list.push(p);
    let handler = (e) => {
        pResolve(e);
        p = new Promise((resolve, reject) => pResolve = resolve);
        list.push(p);
    };
    target.addEventListener(name, handler);
    try {
        for (let p of list) {
            let item = await p;
            yield item;
        }
    }
    finally {
        target.removeEventListener(name, handler);
    }
}
function send(cmd) {
    webSocket.send(cmd);
    let result;
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
        }
        else {
            result = JSON.parse(data);
        }
    });
}
function receive(data) {
}
//# sourceMappingURL=websocket - Copy.js.map