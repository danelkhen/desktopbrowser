import React, { ReactNode, ReactElement } from "react"
export interface GridProps {
    columns: Column[]
    children: ReactElement[]
}
export interface Column {
    header: ReactNode
    cell(item: ReactElement, itemIndex: number): ReactNode
}

export function Grid2({ children: rows, columns }: GridProps) {
    return (
        <div>
            <table>
                <thead>
                    <tr>{columns.map(column => column.header)}</tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => {
                        const cells = columns.map(column => column.cell(row, rowIndex))
                        return React.cloneElement(row, { children: cells })
                    })}
                </tbody>
            </table>
        </div>
    )
}

const x = (
    <Grid2
        columns={[
            { header: <th />, cell: (item, index) => <td>hello</td> },
            { header: <th />, cell: (item, index) => <td>hello</td> },
        ]}
    >
        <tr></tr>
        <tr></tr>
    </Grid2>
)
