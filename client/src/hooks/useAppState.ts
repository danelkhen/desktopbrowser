import { useSyncExternalStore } from "react"
import { dispatcher } from "../services/Dispatcher"

export function useAppState() {
    const appState = useSyncExternalStore(dispatcher.subscribe, dispatcher.getSnapshot)
    return appState
}
