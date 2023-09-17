import { toDefaultDate, toFriendlyRelative2 } from "../../../../shared/src/utils"

export function formatFriendlyDate(value: string | null): string {
    if (!value) return ""
    return toFriendlyRelative2(toDefaultDate(value))
}
