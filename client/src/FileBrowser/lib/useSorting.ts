/* eslint-disable @typescript-eslint/no-explicit-any */
import { desc, OrderBy, orderBy, comparer, ComparerFunc, SelectorFunc } from "../../../../shared/src"
import { Meta } from "../Meta"
import { useMemo } from "react"

export type IsDescending<K extends {}> = Partial<Meta<K, boolean>>
export type IsActive<K extends {}> = readonly (keyof K)[]
export interface SortConfig<T, K extends {}> {
    isDescending: IsDescending<K>
    active: IsActive<K>
    getters: Partial<Meta<K, SelectorFunc<T, any>>>
    comparer: Partial<Meta<K, ComparerFunc<any>>>
    descendingFirst: Partial<Meta<K, boolean>>
}

export function useSorting<T, K extends {}>(items: T[], config: SortConfig<T, K>) {
    return useMemo(() => {
        function getSelector(key: keyof K): SelectorFunc<T, any> {
            return config.getters[key] ?? (t => (t as any)[key])
        }
        function getOrderBy(): OrderBy<T, any>[] {
            const keys = config.active
            if (keys.length == 0) return []
            const by = keys.map(key => {
                const x = desc(getSelector(key), config.isDescending[key])
                return comparer(x, config.comparer[key])
            })
            return by
        }
        function isSortedBy(key: keyof K, desc?: boolean): boolean {
            if (!config.active.includes(key)) return false
            if (desc !== undefined) return !!config.isDescending[key] === desc
            return true
        }

        const by = getOrderBy()
        const sorted = items[orderBy](...by)
        const y = { isSortedBy, sorted }
        return y
    }, [config, items])
}

class Sorter<T, K extends {}> {
    config: SortConfig<T, K>
    constructor(
        {
            isDescending = {},
            active = [],
            getters = {},
            comparer = {},
            descendingFirst = {},
        }: Partial<SortConfig<T, K>>,
        public changed?: () => void
    ) {
        this.config = { isDescending, active, getters, comparer, descendingFirst }
    }
    private orderBy(key: keyof K) {
        const [active, desc] = this._orderBy(key)
        this.config.active = active
        this.config.isDescending = desc
        this.changed?.()
    }
    private _orderBy(key: keyof K): [IsActive<K>, IsDescending<K>] {
        const config = this.config

        const active = config.active
        const isDescending = config.isDescending

        const descendingFirst = config.descendingFirst[key]
        const isKeyActive = active.includes(key)
        const isKeyDesc = isDescending[key]

        if (isKeyActive) {
            if (!!descendingFirst === !!isKeyDesc) {
                return [active, { ...isDescending, key: !isKeyDesc }]
            } else {
                return [active.filter(t => t !== key), isDescending]
            }
        } else {
            if (descendingFirst) {
                return [[...active, key], { ...isDescending, key: !isKeyDesc }]
            }
            return [[...active, key], isDescending]
        }
    }
}
