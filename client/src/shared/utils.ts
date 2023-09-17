/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateTime } from "luxon"

export function tryParseExactLuxon(s: string, format: string) {
    const x = DateTime.fromFormat(s, format)
    if (!x.isValid) return null
    return x
}
export function tryParseExactDate(s: string, format: string): Date | null {
    const x = tryParseExactLuxon(s, format)
    if (!x) return null
    return x.toJSDate()
}

const DefaultDateFormat = "YYYY-MM-DD hh:mm:ss"

export function toDefaultDate(s: string): Date | null {
    return tryParseExactDate(s, DefaultDateFormat)
}

export function toFriendlyRelative2(dt2: Date | null, rel2?: Date): string {
    if (!dt2) return ""
    const dt = DateTime.fromJSDate(dt2)
    if (rel2 == null) rel2 = new Date()
    const rel = DateTime.fromJSDate(rel2)
    if (dt.year == rel.year) {
        if (dt.month == rel.month) {
            if (dt.day == rel.day) {
                return dt.toFormat("HH:mm")
            }
            return dt.toFormat("MMM D")
        }
        return dt.toFormat("MMM D")
    }
    return dt.toFormat("YYYY-MM-DD")
}
