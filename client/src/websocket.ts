let rxq: string[] = [];
function main() {
    let url = location.href.replace(/^https|http/, "ws");
    let webSocket = new WebSocket(url, ["protocolOne", "protocolTwo"]);
    webSocket.addEventListener("message", e => {
        console.log(e.data);
        rxq.push(e.data);
    });
    // Connection opened
    webSocket.addEventListener('open', e => {
        //socket.send('Hello Server!');
    });
}

function send(cmd: string) {

}

function receive(res: string) {
    if (res == "[") {

    }
    else if (res.endsWith(",")) {

    }
    else if (res == "]") {

    }
    else {

    }

}

export interface Request {


}

export interface Response<T> {
    error: any;
    result: T;
    resultType: "iterable" | "object";
    isComplete: boolean;
}

