import { toFriendlySize } from "../utils/toFriendlySize"

export function formatFriendlySize(value: number | null | undefined): string {
    if (!value) return ""
    return toFriendlySize(value)
}
