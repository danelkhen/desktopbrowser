import * as C from "../../../../shared/src/contracts"
import { useCallback, useMemo } from "react"
import { useHistory, useLocation } from "react-router-dom"

function parse(s: string | null): C.ListFilesRequest {
    const req: C.ListFilesRequest = s ? JSON.parse(s) : {}
    return req
}
function parseCurrent() {
    return parse(new URLSearchParams(location.search).get("p"))
}
export type SetRequest = (v: C.ListFilesRequest | ((prev: C.ListFilesRequest) => C.ListFilesRequest)) => void
export function useReq() {
    const history = useHistory()

    const p = useQuery().get("p")
    const req = useMemo(() => parse(p), [p])
    // console.log("REQ", req)

    const setReq: SetRequest = useCallback(
        (v: C.ListFilesRequest | ((prev: C.ListFilesRequest) => C.ListFilesRequest)) => {
            function navigateToReq(req: C.ListFilesRequest) {
                console.log("navigateToReq", req)
                const q = new URLSearchParams()
                q.set("p", JSON.stringify(req))
                history.push({ pathname: "/", search: q.toString() })
            }
            const prev = parseCurrent()
            const req2 = typeof v === "function" ? v(prev) : v
            if (req2 === prev) return
            const p1 = JSON.stringify(prev)
            const p2 = JSON.stringify(req2)
            if (p1 === p2) return
            navigateToReq(req2)
        },
        [history]
    )
    return [req, setReq] as const
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
}