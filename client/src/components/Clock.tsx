import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { sleep } from "../shared/sleep"

export function Clock() {
    const [time, setTime] = useState(DateTime.now().toFormat("HH:mm\n ddd, MMM D"))
    useEffect(() => {
        let run = true
        ;(async () => {
            while (run) {
                await sleep(5000)
                if (!run) return
                setTime(DateTime.now().toFormat("HH:mm\n ddd, MMM D"))
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
