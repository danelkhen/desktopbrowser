/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { css as emotionCss } from "@emotion/css"
import classnames from "classnames"
export function ref(s: string) {
    return `.${s}`
}

export const css: typeof emotionCss = (template: any, ...args) => {
    const template2: any[] = []
    const args2: any[] = []
    for (let i = 0; i < template.length; i++) {
        const arg = args[i]
        const item = template[i]
        if (item.endsWith(".") && arg) {
            template2.push(`${item}${arg}`)
            continue
        }
        template2.push(item)
        arg !== undefined && args2.push(arg)
    }
    const res = emotionCss.apply(undefined, [template2, ...args2] as any)
    console.log({ template, args, template2, args2, res })
    return res
}

export const cx = classnames
