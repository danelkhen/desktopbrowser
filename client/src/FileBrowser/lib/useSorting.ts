/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash"
import { useMemo } from "react"
import { Meta } from "../Meta"

export type IsDescending<K extends {}> = Partial<Meta<K, boolean>>
export type IsActive<K extends {}> = readonly (keyof K)[]
export interface SortConfig<T, K extends {}> {
    isDescending: IsDescending<K>
    active: IsActive<K>
    getters: Partial<Meta<K, (obj: T) => any>>
    sortGetters: Partial<Meta<K, (obj: T) => any>>
    descendingFirst: Partial<Meta<K, boolean>>
}

export function useSorting<T, K extends {}>(items: T[], config: SortConfig<T, K>) {
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
        const y = { sorted }
        return y
    }, [config, items])
}
