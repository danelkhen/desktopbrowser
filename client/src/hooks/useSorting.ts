/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash"
import { useMemo } from "react"
import { Meta } from "../utils/Meta"

export type IsDescending<K extends {}> = Partial<Meta<K, boolean>>
export type IsActive<K extends {}> = readonly (keyof K)[]
export interface SortConfig<T, K extends {}> {
    readonly isDescending: IsDescending<K>
    readonly active: IsActive<K>
    readonly getters: Partial<Meta<K, (obj: T) => any>>
    readonly sortGetters: Partial<Meta<K, (obj: T) => any>>
    readonly descendingFirst: Partial<Meta<K, boolean>>
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
        return sorted
    }, [config, items])
}
