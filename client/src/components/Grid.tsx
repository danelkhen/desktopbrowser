/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React, { ReactNode } from "react"
import { colors } from "../GlobalStyle"
import { asc, desc, sorted } from "../services/Classes"
import { css, cx } from "../lib/ref"

export interface GridColumn<T, V> {
    getter?: (item: T, index: number) => V
    cell?: (item: T, index: number) => ReactNode
    header?: () => ReactNode
    sortGetter?: (item: T) => any
    descendingFirst?: boolean
}
export type GridColumns<T> = {
    [k: string]: GridColumn<T, unknown>
}

export type ColumnKey = string
export interface GridProps<T> {
    columns: GridColumns<T>
    className?: string
    items: T[]
    // headers?: Partial<Meta<K, () => ReactElement>>
    // children?: { [key: ColumnKey]: (item: T, index: number) => ReactNode }
    // columns: ColumnsConfig<T, K>

    getRowClass?: (item: T) => string
    onItemClick?: (e: React.MouseEvent, item: T) => void
    onItemMouseDown?: (e: React.MouseEvent, item: T) => void
    onItemDoubleClick?: (e: React.MouseEvent, item: T) => void

    getHeaderClass?: (column: ColumnKey) => string
    getCellClass?: (column: ColumnKey, item: T) => string
    orderBy?: (column: ColumnKey) => void
    visibleColumns: ColumnKey[]
}

export function Grid<T>({
    columns,
    getRowClass,
    onItemClick,
    onItemMouseDown,
    onItemDoubleClick,
    items,
    orderBy,
    className,
    getHeaderClass,
    getCellClass,
    visibleColumns,
}: GridProps<T>) {
    return (
        <div className={cx(Container, className)}>
            <table className={Table}>
                <thead>
                    <tr>
                        {visibleColumns?.map(column => (
                            <th key={column} className={getHeaderClass?.(column)} onClick={() => orderBy?.(column)}>
                                {columns[column].header?.() ?? column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items?.map((item, itemIndex) => (
                        <tr
                            key={itemIndex}
                            className={getRowClass?.(item)}
                            onMouseDown={e => onItemMouseDown?.(e, item)}
                            onClick={e => onItemClick?.(e, item)}
                            onDoubleClick={e => onItemDoubleClick?.(e, item)}
                        >
                            {visibleColumns?.map(column => (
                                <td key={column} className={getCellClass?.(column, item)}>
                                    {columns[column].cell?.(item, itemIndex) ?? (
                                        <span>{columns[column].getter?.(item, itemIndex) as any}</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const Table = css`
    border-collapse: collapse;
    table-layout: fixed;
    border-spacing: 0;

    > thead {
        > tr {
            border-bottom: 1px solid ${colors.bg2};
            > th {
                padding: 4px 8px;
                white-space: nowrap;
                cursor: default;
                font-weight: normal;
                text-align: left;
                vertical-align: top;
                box-sizing: border-box;
                &:hover {
                    background-color: ${colors.bg2};
                }
                &.${sorted} {
                    &.${asc} {
                        background-color: ${colors.bg2};
                    }
                    &.${desc} {
                        background-color: ${colors.bg3};
                    }
                }
            }
        }
    }

    > tfoot {
        > tr {
            > th {
                padding: 4px 8px;
                white-space: nowrap;
                cursor: pointer;
                font-weight: bold;
                > button {
                    width: 100%;
                    min-height: 100%;
                    border: none;
                    background-color: inherit;
                    padding: 4px;
                }
            }
            &:hover {
                outline: 1px solid #ccc;
            }
        }
    }
`
const Container = css`
    > .Pager {
        display: inline-block;
        margin: 0 5px;
        > .Pages > .Page {
            display: inline-block;
            width: 20px;
            line-height: 20px;
        }
        > .PagerInfo {
            display: inline-block;
            margin: 0 5px;
        }

        > .NextPage {
            visibility: hidden;
        }
        > .PrevPage {
            visibility: hidden;
        }
    }

    > .Search {
        display: inline-block;
    }
`
