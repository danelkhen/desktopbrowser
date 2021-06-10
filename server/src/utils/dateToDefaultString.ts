import moment from "moment"

export function dateToDefaultString(dt: Date): string {
    let defaultDateFormat = "YYYY-MM-DD hh:mm:ss"
    return moment(dt).format(defaultDateFormat)
}
