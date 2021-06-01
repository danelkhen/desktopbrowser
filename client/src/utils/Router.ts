import React from "react"
import { entries, itemsAre } from "../../../shared/src"

export interface ActiveRoute {
    params: { [key: string]: string }
    route: Route
}
export class Router {
    constructor(public routes: Route[]) {}
    init() {
        document.body.addEventListener("click", this.handleAClick)
        window.addEventListener("popstate", this.refreshRoute)
        this.refreshRoute()
    }

    handleAClick = (e: MouseEvent): void => {
        const el = e.target as HTMLElement
        if (el.nodeName !== "A") return
        const a = el as HTMLAnchorElement
        if (!a.href) return
        e.preventDefault()
        this.navigate(a.href)
    }
    destroy() {
        document.body.removeEventListener("click", this.handleAClick)
        window.removeEventListener("popstate", this.refreshRoute)
    }
    detectRoute = () => {
        const path = location.pathname
        const query = location.search
        const route = this.routes.find(t => t.path == path || "/")
        if (!route) return null
        const x: ActiveRoute = { route, params: {} }
        new URLSearchParams(query).forEach((value, key) => (x.params[key] = value))
        return x
    }

    navigate = (path: string, query?: { [key: string]: string }) => {
        let url = path
        if (query) {
            const q = Object.entries(query)
            if (q.length) {
                url += "?" + new URLSearchParams(q).toString()
            }
        }
        history.pushState(null, "", `${url}`)
        this.refreshRoute()
    }

    refreshRoute = () => {
        const prev = this.activeRoute
        const next = this.detectRoute()
        if (activeRoutesEqual(prev, next)) return
        this.activeRoute = next
        this.activeRouteChanged?.(this.activeRoute)
    }
    activeRoute: ActiveRoute | null = null
    activeRouteChanged: ((route: ActiveRoute | null) => void) | undefined
}

function activeRoutesEqual(x: ActiveRoute | null, y: ActiveRoute | null) {
    if (x == y) return true
    if (!x || !y) return false
    if (x.route != y.route) return false
    const prmsEqual = x.params[entries]()[itemsAre](y.params[entries]())
    return prmsEqual
}

export interface Route {
    text: string
    path: string
    render?: RouteRenderer
}

export interface RouteRenderer {
    (ref: React.Ref<any>, children?: React.ReactNode): JSX.Element
}
