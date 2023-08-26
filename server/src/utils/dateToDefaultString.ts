import { DateTime } from "luxon"

export function dateToDefaultString(dt: Date): string {
    const defaultDateFormat = "YYYY-MM-DD hh:mm:ss"
    return DateTime.fromJSDate(dt).toFormat(defaultDateFormat)
}
