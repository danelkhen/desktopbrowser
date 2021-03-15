import { useCallback, useState } from "react"

export function useForceUpdate() {
    let [version, setVersion] = useState(0)
    const forceUpdate = useCallback(
        (reason: string) => {
            reason && console.log("forceUpdate", reason, version)
            setVersion(version + 1)
        },
        [version]
    )
    return forceUpdate
}
