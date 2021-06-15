import cx from "classnames"
import React, { useCallback } from "react"
import { useHistory } from "react-router"
import { FsFile } from "../../../shared/src/FileService"
import { Selection } from "../utils/Selection"
import { Classes } from "./Classes"
import { Column, Columns } from "./Columns"
import { Files } from "./Files"
import { Helper } from "./Helper"
import { FileColumnsConfig } from "./lib/useCommands"

export function Files2({
    isSortedBy,
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
    isSortedBy: (key: keyof Columns, desc?: boolean | undefined) => boolean
    columns: FileColumnsConfig
    head?: boolean
    body?: boolean
    files: FsFile[]
    orderBy: Helper["orderBy"]
    dispatcher: Helper
}) {
    const history = useHistory()
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
            if (!target.matches("a.Name")) return
            e.preventDefault()
            Open(history, file)
        },
        [history, Open]
    )

    const onItemDoubleClick = useCallback(
        (e: React.MouseEvent, file: FsFile) => {
            if (file == null) return
            e.preventDefault()
            Open(history, file)
        },
        [history, Open]
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
            dispatcher={dispatcher}
        />
    )
}
