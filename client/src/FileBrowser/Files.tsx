import React from "react"
import styled from "styled-components"
import * as C from "../../../shared/src/contracts"
import { Column, Columns } from "./Columns"
import { Grid } from "./Grid/Grid"
import { fileEmpty, layers, link } from "./lib/Linearicons"
import { FileColumnsConfig } from "./lib/useCommands"
import { LinearIcon, LinearIconName } from "./LinearIcon"
import { FormatFriendlyDate, FormatFriendlySize } from "./utils"

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

    GetRowClass: (file: C.File) => string
    onItemClick: (e: React.MouseEvent, file: C.File) => void
    onItemMouseDown: (e: React.MouseEvent, file: C.File) => void
    onItemDoubleClick: (e: React.MouseEvent, file: C.File) => void
    columns: FileColumnsConfig
    files: C.File[]

    getHeaderClass: (column: Column) => string
    orderBy: (column: Column) => void
}
const icons: { [key: string]: LinearIconName } = {
    folder: layers,
    file: fileEmpty,
    link: link,
}

export function Files(props: FilesProps) {
    const {
        GetRowClass,
        onItemClick,
        onItemMouseDown,
        onItemDoubleClick,
        columns,
        files,
        head = true,
        body = true,
        getHeaderClass,
        orderBy,
    } = props

    return (
        <GrdFiles<C.File, Columns>
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
                type: file => file.type && icons[file.type] && <LinearIcon icon={icons[file.type]} />,
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
