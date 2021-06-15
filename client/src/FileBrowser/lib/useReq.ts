import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Helper, State } from "../Helper"

export function useReq(state: State, dispatcher: Helper) {
    const p = useQuery().get("p") ?? ""
    useEffect(() => {
        dispatcher.updateReq(p)
    }, [dispatcher, p])
    // const { req } = state
    // useEffect(() => dispatcher.reloadFiles(), [dispatcher, req])
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
}
