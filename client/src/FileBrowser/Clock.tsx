import React, { useEffect } from "react"
import { sleep } from "shared"
import moment from "moment"
import { useForceUpdate } from "../utils/useForceUpdate"

export function Clock() {
    const forceUpdate = useForceUpdate()
    useEffect(() => {
        let run = true
        ;(async () => {
            while (run) {
                await sleep(5000)
                forceUpdate("")
            }
        })()
        return () => {
            run = false
        }
    }, [forceUpdate])
    const clockText = moment().format("HH:mm\n ddd, MMM D")
    return (
        <span className="clock" id="clock">
            {clockText}
        </span>
    )
}
