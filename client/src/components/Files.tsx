import React from "react"
import styled from "styled-components"
import { Dispatcher } from "../lib/Dispatcher"
import { FsFile } from "../lib/FileService"
import { ColumnKey, Grid } from "./Grid"

import { FileColumns } from "../lib/AppState"
import { visibleGridColumns } from "../lib/gridColumns"

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

export interface FilesProps {
    GetRowClass: (file: FsFile) => string
    onItemClick: (e: React.MouseEvent, file: FsFile) => void
    onItemMouseDown: (e: React.MouseEvent, file: FsFile) => void
    onItemDoubleClick: (e: React.MouseEvent, file: FsFile) => void
    columns: FileColumns
    files: FsFile[]

    getHeaderClass: (column: ColumnKey) => string
    orderBy: Dispatcher["orderBy"]
}

export function Files({
    GetRowClass,
    onItemClick,
    onItemMouseDown,
    onItemDoubleClick,
    orderBy,
    columns,
    files,
    getHeaderClass,
}: FilesProps) {
    return (
        <GrdFiles<FsFile>
            items={files}
            getHeaderClass={getHeaderClass}
            orderBy={orderBy}
            onItemMouseDown={onItemMouseDown}
            onItemClick={onItemClick}
            onItemDoubleClick={onItemDoubleClick}
            GetRowClass={GetRowClass}
            getCellClass={column => column}
            // columns={columns}
            columns={columns}
            visibleColumns={visibleGridColumns}
        />
        //     {{
        //         type: file => (file.type && icons[file.type] && icons[file.type]) || null,
        //         Name: file => (
        //             <span>
        //                 <a className="Name">{file.Name}</a>
        //             </span>
        //         ),
        //         Modified: file => <span>{formatFriendlyDate(file.Modified ?? null)}</span>,
        //         Size: file => <span>{formatFriendlySize(file.Size)}</span>,
        //         Extension: file => !file.IsFolder && <span>{file.Extension}</span>,
        //     }}
        // </GrdFiles>
    )
}
