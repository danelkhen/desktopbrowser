/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash"
import { useMemo } from "react"
import { ColumnKey } from "../components/Grid"
import { gridColumns } from "../lib/gridColumns"

export interface SortConfig {
    readonly isDescending: Record<ColumnKey, boolean>
    readonly active: readonly ColumnKey[]
    // readonly getters: Record<ColumnKey, (obj: T) => any>
    // readonly sortGetters: Record<ColumnKey, (obj: T) => any>
    readonly descendingFirst: Record<ColumnKey, boolean>
}

export function useSorting<T>(items: T[], config: SortConfig) {
    return useMemo(() => {
        function getOrderBy() {
            const activeKeys = config.active
            return {
                keys: activeKeys.map(key => gridColumns[key].sortGetter ?? gridColumns[key].getter ?? key),
                order: activeKeys.map(key => !!config.isDescending[key]),
            }
        }

        const by = getOrderBy()

        // const sorted = items[orderBy](...by)
        const sorted = _.orderBy<T>(
            items,
            by.keys as any,
            by.order.map(t => (t ? "desc" : "asc"))
        )
        return sorted
    }, [config, items])
}
