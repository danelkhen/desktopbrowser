import React, {
    ReactNode,
    ReactElement,
    ReactInstance,
    ReactComponentElement,
    ReactHTMLElement,
    useState,
    useMemo,
} from "react"
import { orderBy } from "../../../../shared/src"

export interface GridDef<T> {
    sortBy(NameColumn: ColumnDef<T, any>): void
    list: T[]
    sorted: T[]
    useColumn<V>(config: ColumnConfig<T, V>): ColumnDef<T, V>
    Comp({ children }: { children: ReactNode }): ReactElement
}

interface ColumnConfig<T, V> {
    getter: (obj: T) => V
}
export interface ColumnDef<T, V = any> {
    Header({ children }: { children?: ReactNode }): ReactElement
    // Cell(props: CellProps<T, V>): ReactElement
    getter(item: T): V
}

function GridComp({ children }: { children: ReactNode }) {
    return <div>{children}</div>
}
interface Sorting<T> {
    column: ColumnDef<T>
    desc?: boolean
}

export function useGridDef<T>(list: T[]): GridDef<T> {
    const [sorting, setSorting] = useState<Sorting<T> | null>(null)
    const sorted = useMemo(() => {
        const { column, desc } = sorting ?? {}
        if (!column) return list
        const { getter } = column
        if (!getter) return list
        const list2 = list[orderBy](getter)
        if (desc) {
            list2.reverse()
        }
        return list2
    }, [list, sorting])
    const def: GridDef<T> = {
        list,
        sorted,
        useColumn,
        Comp: GridComp,
        sortBy: column => {
            setSorting(prev => (prev?.column === column ? { column, desc: !prev.desc } : { column }))
        },
    }
    return def
}
export function useColumn<T, V>({ getter }: { getter: (item: T) => V }) {
    const col: ColumnDef<T, V> = {
        Header,
        // Cell: ({ children }) => <Cell value={getter(item)}>{children}</Cell>,
        getter,
    }
    return col
}

export interface HeaderProps {
    children: ReactHTMLElement<HTMLElement>
}
function Header({ children }: HeaderProps) {
    return children
    // const th = React.cloneElement(children, { onClick: e => console.log(e) })
    // return th
}

// interface CellProps<T, V> {
//     children?: ReactHTMLElement<HTMLElement>
//     value: V
// }
// function Cell<T, V>({ value, children }: CellProps<T, V>) {
//     return children ?? <td>{value}</td>
// }
