import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { sleep } from "../lib/sleep"

export function Clock() {
    const [time, setTime] = useState(DateTime.now().toFormat("HH:mm\n ccc, MMM d"))
    useEffect(() => {
        let run = true
        ;(async () => {
            while (run) {
                await sleep(5000)
                if (!run) return
                setTime(DateTime.now().toFormat("HH:mm\n ccc, MMM d"))
            }
        })()
        return () => {
            run = false
        }
    }, [])
    return (
        <span className="clock" id="clock">
            {time}
        </span>
    )
}
