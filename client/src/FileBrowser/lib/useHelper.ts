import { useSyncExternalStore } from "react"
import { useNavigate } from "react-router"
import { helper } from "./Helper"

export function useHelper() {
    const state = useSyncExternalStore(helper.subscribe, helper.getSnapshot)
    const navigate = useNavigate()
    helper.navigate = navigate
    return [state, helper] as const
}
