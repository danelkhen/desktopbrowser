import cx from "classnames"
import React, { useCallback } from "react"
import { styled } from "styled-components"
import { FileColumns } from "../lib/AppState"
import { Classes } from "../lib/Classes"
import { Dispatcher } from "../lib/Dispatcher"
import { FsFile } from "../lib/FileService"
import { Selection } from "../lib/Selection"
import { visibleGridColumns } from "../lib/gridColumns"
import { ColumnKey, Grid } from "./Grid"

export function Files({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    Open,
    hasInnerSelection,
    columns,
    files,
    orderBy,
    dispatcher,
}: {
    setSelectedFiles: (v: FsFile[]) => void
    selectedFiles: FsFile[]
    allFiles: FsFile[]
    Open: Dispatcher["Open"]
    hasInnerSelection(file: FsFile): boolean
    columns: FileColumns
    files: FsFile[]
    orderBy: Dispatcher["orderBy"]
    dispatcher: Dispatcher
}) {
    const { isSortedBy } = dispatcher
    const onItemMouseDown = useCallback(
        (e: React.MouseEvent, file: FsFile) => {
            const selection = new Selection(allFiles, selectedFiles)
            const selectedItems = selection.Click(file, e.ctrlKey, e.shiftKey)
            setSelectedFiles(selectedItems)
        },
        [allFiles, selectedFiles, setSelectedFiles]
    )

    const onItemClick = useCallback(
        (e: React.MouseEvent, file: FsFile) => {
            // const selection = new Selection(allFiles, selectedFiles)
            const target = e.target as HTMLElement
            if (!target.matches("a.Name")) {
                return
            }
            e.preventDefault()
            Open(file)
        },
        [Open]
    )

    const onItemDoubleClick = useCallback(
        (e: React.MouseEvent, file: FsFile) => {
            if (file == null) {
                return
            }
            e.preventDefault()
            Open(file)
        },
        [Open]
    )

    const getRowClass = useCallback(
        (file: FsFile): string => {
            const { FileRow, IsFolder, HasInnerSelection, Selected, IsFile } = Classes
            const selection = new Selection(allFiles, selectedFiles)
            return cx(
                FileRow,
                file.IsFolder ? IsFolder : IsFile,
                hasInnerSelection(file) && HasInnerSelection,
                selection.SelectedItems.includes(file) && Selected
            )
        },
        [allFiles, hasInnerSelection, selectedFiles]
    )

    const getHeaderClass = useCallback(
        (column: ColumnKey): string => {
            const { sorted, asc, desc } = Classes
            return cx(
                column,
                isSortedBy(column) && sorted,
                isSortedBy(column, false) && asc,
                isSortedBy(column, true) && desc
            )
        },
        [isSortedBy]
    )

    return (
        <GrdFiles<FsFile>
            items={files}
            getHeaderClass={getHeaderClass}
            orderBy={orderBy}
            onItemMouseDown={onItemMouseDown}
            onItemClick={onItemClick}
            onItemDoubleClick={onItemDoubleClick}
            getRowClass={getRowClass}
            getCellClass={column => column}
            columns={columns}
            visibleColumns={visibleGridColumns}
        />
    )
}

const GrdFiles: typeof Grid = styled(Grid)`
    user-select: none;

    > table {
        width: 100%;
        > tbody > tr {
            transition: all 0.3s ease;
            -webkit-font-smoothing: antialiased;
            border: 1px solid #0c0c0c;
            color: #999;
            > td {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                box-sizing: border-box;
                padding: 10px 0px;
            }
        }
        > thead > tr,
        > tbody > tr {
            > .type {
                width: 35px;
                text-overflow: clip;
                padding: 10px 5px;
                > .lnr {
                    font-size: 18px;
                }
            }

            > .Modified {
                width: 150px;
            }

            > .Size {
                width: 150px;
            }

            > .Extension {
                width: 150px;
            }
        }
        > thead {
            position: sticky;
            top: 83px;
            > tr {
                background-color: #060606;
                border-bottom: 1px solid #333;
                text-align: left;
                > th {
                    padding: 10px;
                    font-size: 10px;
                    text-transform: uppercase;
                    -webkit-font-smoothing: antialiased;
                    letter-spacing: 1px;
                    color: #999;
                    font-weight: normal;
                    text-align: left;
                }
            }
        }
    }
`
