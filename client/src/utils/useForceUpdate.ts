import { useCallback, useState } from "react"

export function useForceUpdate() {
    const [version, setVersion] = useState(0)
    const forceUpdate = useCallback(
        (reason: string) => {
            reason && console.log("forceUpdate", reason, version)
            setVersion(version + 1)
        },
        [version]
    )
    return forceUpdate
}
