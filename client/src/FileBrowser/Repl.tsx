import React, { useState } from "react"
import * as websocket from "../utils/webSocket"

export function Repl() {
    const [replCmd, setReplCmd] = useState("")
    const [replOutput, setReplOutput] = useState<string[]>([])

    async function sendReplCmd() {
        if (!replCmd) return
        try {
            const res = websocket.send(replCmd)
            for await (const item of res) {
                console.log("repl", item)
                setReplOutput([...replOutput, item])
            }
        } catch (err) {
            setReplOutput([...replOutput, err])
        }
    }

    return (
        <div className="repl" style={{ display: "none" }}>
            <input type="text" value={replCmd} onChange={e => setReplCmd(e.currentTarget.value)} />
            <button onClick={() => sendReplCmd()}>send</button>
            <pre>{replOutput}</pre>
        </div>
    )
}
