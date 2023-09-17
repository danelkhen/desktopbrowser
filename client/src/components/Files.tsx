import cx from "classnames"
import React, { useCallback } from "react"
import { FileColumns } from "../services/AppState"
import { Classes } from "../services/Classes"
import { dispatcher } from "../services/Dispatcher"
import { FsFile } from "../services/FileService"
import { Selection } from "../services/Selection"
import { visibleGridColumns } from "./gridColumns"
import { ColumnKey, Grid } from "./Grid"
import { css } from "@emotion/css"

export function Files({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    columns,
    files,
}: {
    setSelectedFiles: (v: FsFile[]) => void
    selectedFiles: FsFile[]
    allFiles: FsFile[]
    columns: FileColumns
    files: FsFile[]
}) {
    const onItemMouseDown = useCallback(
        (e: React.MouseEvent, file: FsFile) => {
            const selection = new Selection(allFiles, selectedFiles)
            const selectedItems = selection.Click(file, e.ctrlKey, e.shiftKey)
            setSelectedFiles(selectedItems)
        },
        [allFiles, selectedFiles, setSelectedFiles]
    )

    const onItemClick = useCallback((e: React.MouseEvent, file: FsFile) => {
        // const selection = new Selection(allFiles, selectedFiles)
        const target = e.target as HTMLElement
        if (!target.matches("a.Name")) {
            return
        }
        e.preventDefault()
        dispatcher.Open(file)
    }, [])

    const onItemDoubleClick = useCallback((e: React.MouseEvent, file: FsFile) => {
        if (file == null) {
            return
        }
        e.preventDefault()
        dispatcher.Open(file)
    }, [])

    const getRowClass = useCallback(
        (file: FsFile): string => {
            const { FileRow, IsFolder, HasInnerSelection, Selected, IsFile } = Classes
            return cx(
                FileRow,
                file.IsFolder ? IsFolder : IsFile,
                dispatcher.hasInnerSelection(file) && HasInnerSelection,
                selectedFiles.includes(file) && Selected
            )
        },
        [selectedFiles]
    )

    const getHeaderClass = useCallback((column: ColumnKey): string => {
        const { sorted, asc, desc } = Classes
        return cx(
            column,
            dispatcher.isSortedBy(column) && sorted,
            dispatcher.isSortedBy(column, false) && asc,
            dispatcher.isSortedBy(column, true) && desc
        )
    }, [])

    return (
        <Grid<FsFile>
            className={GrdFiles}
            items={files}
            getHeaderClass={getHeaderClass}
            orderBy={dispatcher.orderBy}
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

const GrdFiles = css`
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
