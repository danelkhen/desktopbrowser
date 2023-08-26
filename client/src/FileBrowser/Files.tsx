import React, { ReactElement } from "react"
import styled from "styled-components"
import { FsFile } from "../../../shared/src/FileService"
import { Column, Columns } from "./Columns"
import { Grid } from "./Grid/Grid"
import { FileColumnsConfig } from "./lib/FileColumnsConfig"
import { Helper } from "./lib/Helper"
import { FormatFriendlyDate, FormatFriendlySize } from "./lib/utils"

import { ReactComponent as FileEmptyIcon } from "../assets/linearicons/svg/file-empty.svg"
import { ReactComponent as LayersIcon } from "../assets/linearicons/svg/layers.svg"
import { ReactComponent as LinkIcon } from "../assets/linearicons/svg/link.svg"

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
    files: FsFile[]

    getHeaderClass: (column: Column) => string
    orderBy: Helper["orderBy"]
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
    files,
    head = true,
    body = true,
    getHeaderClass,
}: FilesProps) {
    return (
        <GrdFiles<FsFile, Columns>
            items={files}
            titles={{ [Columns.type]: "" }}
            head={head}
            body={body}
            getHeaderClass={getHeaderClass}
            orderBy={orderBy}
            onItemMouseDown={onItemMouseDown}
            onItemClick={onItemClick}
            onItemDoubleClick={onItemDoubleClick}
            GetRowClass={GetRowClass}
            getCellClass={column => column}
            columns={columns}
        >
            {{
                type: file => (file.type && icons[file.type] && icons[file.type]) || null,
                Name: file => (
                    <span>
                        <a className="Name">{file.Name}</a>
                    </span>
                ),
                Modified: file => <span>{FormatFriendlyDate(file.Modified ?? null)}</span>,
                Size: file => <span>{FormatFriendlySize(file.Size)}</span>,
                Extension: file => !file.IsFolder && <span>{file.Extension}</span>,
            }}
        </GrdFiles>
    )
}
