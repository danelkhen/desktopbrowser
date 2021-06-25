import cx from "classnames"
import React, { ReactElement, ReactNode } from "react"
import styled from "styled-components"
import { colors } from "../GlobalStyle"
import { Meta } from "../../utils/Meta"

const GridTable = styled.table`
    border-collapse: collapse;
    table-layout: fixed;
    border-spacing: 0;

    > thead {
        > tr {
            border-bottom: 1px solid ${colors.__bg2};
            > th {
                padding: 4px 8px;
                white-space: nowrap;
                cursor: default;
                font-weight: normal;
                text-align: left;
                vertical-align: top;
                box-sizing: border-box;
                &:hover {
                    background-color: ${colors.__bg2};
                }
                &.sorted {
                    &.asc {
                        background-color: ${colors.__bg2};
                    }
                    &.desc {
                        background-color: ${colors.__bg3};
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
const GridDiv = styled.div`
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
export interface ColumnsConfig<T, K extends {}> {
    keys: Meta<K, string>
    getters?: Partial<Meta<K, (item: T, index: number) => unknown>>
    visibleColumns?: (keyof K)[]
}

export interface GridProps<T, K extends {}> {
    className?: string
    items: T[]
    headers?: Partial<Meta<K, () => ReactElement>>
    children?: Partial<Meta<K, (item: T, index: number) => ReactNode>>
    head?: boolean
    body?: boolean
    columns: ColumnsConfig<T, K>

    GetRowClass?: (item: T) => string
    onItemClick?: (e: React.MouseEvent, item: T) => void
    onItemMouseDown?: (e: React.MouseEvent, item: T) => void
    onItemDoubleClick?: (e: React.MouseEvent, item: T) => void

    getHeaderClass?: (column: keyof K) => string
    getCellClass?: (column: keyof K, item: T) => string
    orderBy?: (column: keyof K) => void
    classNames?: Partial<Meta<K, string>>
    titles?: Partial<Meta<K, string>>
}

export function Grid<T, K extends {}>({
    columns,
    GetRowClass,
    onItemClick,
    onItemMouseDown,
    onItemDoubleClick,
    items,
    orderBy,
    body = true,
    children,
    headers,
    classNames,
    titles,
    head,
    className,
    getHeaderClass,
    getCellClass,
}: GridProps<T, K>) {
    const { keys, visibleColumns, getters } = columns
    const cells = children

    return (
        <GridDiv className={className}>
            <GridTable>
                {head && (
                    <thead>
                        <tr>
                            {visibleColumns?.map(
                                column =>
                                    headers?.[column]?.() ?? (
                                        <th
                                            key={keys[column]}
                                            className={cx(classNames?.[column], getHeaderClass?.(column))}
                                            onClick={() => orderBy?.(column)}
                                        >
                                            {headers?.[column]?.() ?? titles?.[column] ?? keys[column]}
                                        </th>
                                    )
                            )}
                        </tr>
                    </thead>
                )}
                {body && (
                    <tbody>
                        {items?.map((item, itemIndex) => (
                            <tr
                                key={itemIndex}
                                className={GetRowClass?.(item)}
                                onMouseDown={e => onItemMouseDown?.(e, item)}
                                onClick={e => onItemClick?.(e, item)}
                                onDoubleClick={e => onItemDoubleClick?.(e, item)}
                            >
                                {visibleColumns?.map(column => (
                                    <td
                                        key={keys[column]}
                                        className={cx(classNames?.[column], getCellClass?.(column, item))}
                                    >
                                        {cells?.[column]?.(item, itemIndex) ?? <span>{getters?.[column]}</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                )}
            </GridTable>
        </GridDiv>
    )
}
