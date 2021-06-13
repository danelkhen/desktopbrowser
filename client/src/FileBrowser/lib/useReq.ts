import { useCallback, useMemo } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { ListFilesRequest } from "../../../../shared/src/FileService"

function parse(s: string | null): ListFilesRequest {
    const req: ListFilesRequest = s ? JSON.parse(s) : {}
    return req
}
function parseCurrent() {
    return parse(new URLSearchParams(location.search).get("p"))
}
export type SetRequest = (v: ListFilesRequest | ((prev: ListFilesRequest) => ListFilesRequest)) => void
export function useReq() {
    const history = useHistory()

    const p = useQuery().get("p")
    const req = useMemo(() => parse(p), [p])
    // console.log("REQ", req)

    const setReq: SetRequest = useCallback(
        (v: ListFilesRequest | ((prev: ListFilesRequest) => ListFilesRequest)) => {
            function navigateToReq(req: ListFilesRequest) {
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
