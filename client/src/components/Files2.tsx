import cx from "classnames"
import React, { useCallback } from "react"
import { FsFile } from "../lib/FileService"
import { Selection } from "../lib/Selection"
import { Classes } from "../lib/Classes"
import { Column } from "../lib/Columns"
import { Files } from "./Files"
import { Dispatcher } from "../lib/Dispatcher"
import { FileColumns2, FileColumnsConfig } from "../lib/AppState"

export function Files2({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    Open,
    hasInnerSelection,
    columns,
    columns2,
    files,
    orderBy,
    dispatcher,
}: {
    setSelectedFiles: (v: FsFile[]) => void
    selectedFiles: FsFile[]
    allFiles: FsFile[]
    Open: Dispatcher["Open"]
    hasInnerSelection(file: FsFile): boolean
    columns: FileColumnsConfig
    columns2: FileColumns2
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

    const GetRowClass = useCallback(
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
        (column: Column): string => {
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
        <Files
            GetRowClass={GetRowClass}
            getHeaderClass={getHeaderClass}
            onItemClick={onItemClick}
            onItemDoubleClick={onItemDoubleClick}
            onItemMouseDown={onItemMouseDown}
            columns={columns}
            columns2={columns2}
            files={files}
            orderBy={orderBy}
        />
    )
}
