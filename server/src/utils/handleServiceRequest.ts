/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express"

export function handleServiceRequest(services: {}) {
    const x: RequestHandler = async (req, res) => {
        const serviceName = req.params["service"]
        const action = req.params["action"]
        const service = (services as any)[serviceName]
        if (service == null) {
            console.error("No such service by that name:", serviceName)
        }

        let arg: any
        if (req.method == "POST") arg = (req as any).body
        else if (req.query.p != null) arg = JSON.parse(req.query.p as any)
        else arg = req.query
        console.log(action, req.params, req.query)
        try {
            const result = await service[action](arg)
            res.json(result ?? null)
        } catch (e) {
            console.log("api action error", e)
            res.status(500).json({ err: (e as any).toString() }) ///
        }
    }
    return x
}
