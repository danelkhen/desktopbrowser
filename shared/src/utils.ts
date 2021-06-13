/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment"
import { Moment } from "moment"

export function tryParseInt(s: string | null | undefined): number | null {
    if (!s) return null
    const x = parseInt(s)
    if (isNaN(x)) return null
    return x
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms || 0))
}

export function tryParseExactMoment(s: string, format: string): Moment | null {
    const x = moment(s, format)
    if (!x.isValid()) return null
    return x
}
export function tryParseExactDate(s: string, format: string): Date | null {
    const x = tryParseExactMoment(s, format)
    if (!x) return null
    return x.toDate()
}

const DefaultDateFormat = "YYYY-MM-DD hh:mm:ss"

export function toDefaultDate(s: string): Date | null {
    return tryParseExactDate(s, DefaultDateFormat)
}

export function toFriendlyRelative2(dt2: Date | null, rel2?: Date): string {
    if (!dt2) return ""
    const dt = moment(dt2)
    if (rel2 == null) rel2 = new Date()
    const rel = moment(rel2)
    if (dt.year() == rel.year()) {
        if (dt.month() == rel.month()) {
            if (dt.day() == rel.day()) {
                return dt.format("HH:mm")
            }
            return dt.format("MMM D")
        }
        return dt.format("MMM D")
    }
    return dt.format("YYYY-MM-DD")
}
