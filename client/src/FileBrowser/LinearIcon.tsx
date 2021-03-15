import React from "react"
import * as icons from "./lib/Linearicons"

type ValuesOf<T> = { [P in keyof T]: T[P] }[keyof T]

export type LinearIconName = ValuesOf<typeof icons>

export function LinearIcon({ icon }: { icon?: LinearIconName }) {
    return icon ? <span className={`lnr lnr-${icon}`}></span> : null
}
