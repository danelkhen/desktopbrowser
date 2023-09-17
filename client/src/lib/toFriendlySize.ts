import { toFriendlyNumber } from "./toFriendlyNumber"

export function toFriendlySize(x: number) {
    const kb = x / 1024.0
    const mb = kb / 1024.0
    const gb = mb / 1024.0
    const tb = gb / 1024.0
    if (kb < 1) return `${toFriendlyNumber(x)}b`
    if (mb < 1) return `${toFriendlyNumber(kb)}kb`
    if (mb < 1) return `${toFriendlyNumber(kb)}kb`
    if (gb < 1) return `${toFriendlyNumber(mb)}mb`
    if (tb < 1) return `${toFriendlyNumber(gb)}gb`
    return `${toFriendlyNumber(tb)}tb`
}
