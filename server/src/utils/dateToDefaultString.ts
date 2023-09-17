import { DateTime } from "luxon"

export function dateToDefaultString(dt: Date): string {
    const defaultDateFormat = "yyyy-MM-dd hh:mm:ss"
    return DateTime.fromJSDate(dt).toFormat(defaultDateFormat)
}
