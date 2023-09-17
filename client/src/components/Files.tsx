import React, { ReactElement } from "react"
import styled from "styled-components"
import { FsFile } from "../lib/FileService"
import { Column, Columns } from "../lib/Columns"
import { Grid } from "./Grid"
import { Dispatcher } from "../lib/Dispatcher"
import { formatFriendlySize } from "../lib/formatFriendlySize"
import { formatFriendlyDate } from "../lib/formatFriendlyDate"

import { ReactComponent as FileEmptyIcon } from "../assets/linearicons/svg/file-empty.svg"
import { ReactComponent as LayersIcon } from "../assets/linearicons/svg/layers.svg"
import { ReactComponent as LinkIcon } from "../assets/linearicons/svg/link.svg"
import { FileColumns2, FileColumnsConfig } from "../lib/AppState"

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
    head?: boolean
    body?: boolean

    GetRowClass: (file: FsFile) => string
    onItemClick: (e: React.MouseEvent, file: FsFile) => void
    onItemMouseDown: (e: React.MouseEvent, file: FsFile) => void
    onItemDoubleClick: (e: React.MouseEvent, file: FsFile) => void
    columns: FileColumnsConfig
    columns2: FileColumns2
    files: FsFile[]

    getHeaderClass: (column: Column) => string
    orderBy: Dispatcher["orderBy"]
}
const icons: { [key: string]: ReactElement } = {
    folder: <LayersIcon />,
    file: <FileEmptyIcon />,
    link: <LinkIcon />,
}

export function Files({
    GetRowClass,
    onItemClick,
    onItemMouseDown,
    onItemDoubleClick,
    orderBy,
    columns,
    columns2,
    files,
    getHeaderClass,
}: FilesProps) {
    return (
        <GrdFiles<FsFile, Columns>
            items={files}
            titles={{ [Columns.type]: "" }}
            getHeaderClass={getHeaderClass}
            orderBy={orderBy}
            onItemMouseDown={onItemMouseDown}
            onItemClick={onItemClick}
            onItemDoubleClick={onItemDoubleClick}
            GetRowClass={GetRowClass}
            getCellClass={column => column}
            columns={columns}
            columns2={columns2}
        >
            {{
                type: file => (file.type && icons[file.type] && icons[file.type]) || null,
                Name: file => (
                    <span>
                        <a className="Name">{file.Name}</a>
                    </span>
                ),
                Modified: file => <span>{formatFriendlyDate(file.Modified ?? null)}</span>,
                Size: file => <span>{formatFriendlySize(file.Size)}</span>,
                Extension: file => !file.IsFolder && <span>{file.Extension}</span>,
            }}
        </GrdFiles>
    )
}