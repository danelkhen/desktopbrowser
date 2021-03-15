import React from "react"
import { useGridDef } from "./Grid3"

export interface Contact {
    name: string
    age: number
}

export function TestGrid3() {
    const list: Contact[] = [
        { name: "zzz", age: 7 },
        { name: "aaaa", age: 8 },
        { name: "zzz", age: 7 },
        { name: "aaaa", age: 8 },
        { name: "zzz", age: 7 },
        { name: "aaaa", age: 8 },
        { name: "zzz", age: 7 },
        { name: "aaaa", age: 8 },
        { name: "ccccc", age: 8 },
        { name: "ccccc", age: 8 },
        { name: "ccccc", age: 8 },
        { name: "ccccc", age: 8 },
    ]
    const Grid = useGridDef(list)
    const NameColumn = Grid.useColumn({ getter: t => t.name })
    const AgeColumn = Grid.useColumn({ getter: t => t.age })
    return (
        <div>
            <div>hello</div>
            <Grid.Comp>
                <table>
                    <thead>
                        <tr>
                            <NameColumn.Header>
                                <th onClick={e => Grid.sortBy(NameColumn)}>Name</th>
                            </NameColumn.Header>
                            <AgeColumn.Header>
                                <th>Age</th>
                            </AgeColumn.Header>
                        </tr>
                    </thead>
                    <tbody>
                        {Grid.sorted.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Grid.Comp>
        </div>
    )
}

//type Cols<T, ...V> = [...Col<T, V>]
interface Col<V> {
    getter: () => V
}
// function test<V extends (() => any)[]>(x: V): V {
//     return null as any
// }
function test<V extends Col<any>[]>(x: V): V {
    return null as any
}

const [x, y] = test([{ getter: () => 7 }, { getter: () => false }])
