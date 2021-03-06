import cx from "classnames"
import React, { useCallback } from "react"
import { FsFile } from "../../../shared/src/FileService"
import { Selection } from "../utils/Selection"
import { Classes } from "./Classes"
import { Column } from "./Columns"
import { Files } from "./Files"
import { Helper } from "./lib/Helper"
import { FileColumnsConfig } from "./lib/FileColumnsConfig"

export function Files2({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    Open,
    hasInnerSelection,
    columns,
    body,
    head,
    files,
    orderBy,
    dispatcher,
}: {
    setSelectedFiles: (v: FsFile[]) => void
    selectedFiles: FsFile[]
    allFiles: FsFile[]
    Open: Helper["Open"]
    hasInnerSelection(file: FsFile): boolean
    columns: FileColumnsConfig
    head?: boolean
    body?: boolean
    files: FsFile[]
    orderBy: Helper["orderBy"]
    dispatcher: Helper
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
            body={body}
            head={head}
            files={files}
            orderBy={orderBy}
        />
    )
}
