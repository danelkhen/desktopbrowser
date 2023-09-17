/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash"
import { useMemo } from "react"
import { ColumnKey } from "../components/Grid"

export interface SortConfig<T> {
    readonly isDescending: Record<ColumnKey, boolean>
    readonly active: readonly ColumnKey[]
    readonly getters: Record<ColumnKey, (obj: T) => any>
    readonly sortGetters: Record<ColumnKey, (obj: T) => any>
    readonly descendingFirst: Record<ColumnKey, boolean>
}

export function useSorting<T>(items: T[], config: SortConfig<T>) {
    return useMemo(() => {
        function getOrderBy() {
            const keys = config.active
            return {
                keys: keys.map(key => config.sortGetters[key] ?? config.getters[key] ?? key),
                order: keys.map(key => !!config.isDescending[key]),
            }
        }

        const by = getOrderBy()

        // const sorted = items[orderBy](...by)
        const sorted = _.orderBy(
            items,
            by.keys,
            by.order.map(t => (t ? "desc" : "asc"))
        )
        return sorted
    }, [config, items])
}
