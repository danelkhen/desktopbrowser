import React, { ReactElement } from "react"
// import * as icons from "./lib/Linearicons"

type ValuesOf<T> = { [P in keyof T]: T[P] }[keyof T]

export type LinearIconName = ReactElement // ValuesOf<typeof icons>

export function LinearIcon({ icon }: { icon?: LinearIconName }) {
    return null // icon ? <span className={`lnr lnr-${icon}`}></span> : null
}
