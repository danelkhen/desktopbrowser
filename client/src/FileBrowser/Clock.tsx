import { useEffect } from "react"
import { sleep } from "../../../shared/src"
import { useForceUpdate } from "../utils/useForceUpdate"
import { DateTime } from "luxon"

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
    const clockText = DateTime.now().toFormat("HH:mm\n ddd, MMM D")
    return (
        <span className="clock" id="clock">
            {clockText}
        </span>
    )
}
