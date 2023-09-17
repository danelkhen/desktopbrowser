import { DateTime } from "luxon"

export function dateToDefaultString(dt: Date): string {
    const defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
    return DateTime.fromJSDate(dt).toFormat(defaultDateFormat)
}
