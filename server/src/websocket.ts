import * as http from "http"
import * as https from "https"
import * as ws from "ws"
import { extractFunctionCall, ProxyCall } from "./utils/proxy"

export function setupWebsockets(server: http.Server | https.Server) {
    console.log("setupWebsockets");
    const wss = new ws.Server({ server });

    wss.on('connection', (ws, req) => {
        console.log("wss.onconnection", req.url);
        //const url2 = url.parse(req.url, true);
        //console.log("wss.onconnection", url2, url2.query);
        //let queueId = (url2.query as any).queue;
        //console.log("ws queueid", queueId);

        // You might use location.query.access_token to authenticate or share sessions
        // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

        ws.on('message', message => {
            let data = String(message);
            let pc = extractFunctionCall(data);
            console.log('ws.message received: %s', data, pc);
            ws.send(JSON.stringify("hello"));
            //ws.send(JSON.stringify('you sent '+message));
        });
        ws.on('error', e => console.log('ws.error', e));
        //ws.send(JSON.stringify('something'));
    });

}
