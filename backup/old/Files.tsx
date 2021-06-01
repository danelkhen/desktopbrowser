// import C from "../../shared/src/contracts"
// import React, { ReactElement } from "react"
// import { ArrayView } from "../utils/ArrayView"
// import { FileColumnKeys, FileColumnsConfig } from "../FileBrowser/Helper"
// import { FormatFriendlyDate, FormatFriendlySize } from "../FileBrowser/utils"

// interface FilesProps {
//     head?: boolean
//     body?: boolean

//     GetRowClass: (file: C.File) => string
//     grdFiles_click: (e: React.MouseEvent<Element, MouseEvent>, file: C.File) => void
//     grdFiles_mousedown: (e: React.MouseEvent<Element, MouseEvent>, file: C.File) => void
//     grdFiles_dblclick: (e: React.MouseEvent<Element, MouseEvent>, file: C.File) => void
//     columns: FileColumnsConfig
//     filesView: ArrayView<C.File, FileColumnKeys>

//     getHeaderClass: (prop: FileColumnKeys) => string
//     orderBy: (key: FileColumnKeys) => void

//     GetFileClass: (file: C.File) => string | null
// }
// function Files(props: FilesProps) {
//     const {
//         GetRowClass,
//         grdFiles_click,
//         grdFiles_mousedown,
//         grdFiles_dblclick,
//         columns,
//         filesView,
//         head = true,
//         body = true,
//         getHeaderClass,
//         orderBy,
//         GetFileClass,
//     } = props

//     const files = filesView.target
//     return (
//         <div className="grdFiles Grid">
//             <table>
//                 {head && (
//                     <thead>
//                         <tr>
//                             {columns.visibleColumns?.map((column, columnIndex) =>
//                                 FileHeaderCell({ getHeaderClass, orderBy, columnIndex, column })
//                             )}
//                         </tr>
//                     </thead>
//                 )}
//                 {body && (
//                     <tbody>
//                         {files?.map((file, fileIndex) => (
//                             <tr
//                                 key={fileIndex}
//                                 className={GetRowClass(file)}
//                                 onMouseDown={e => grdFiles_mousedown(e, file)}
//                                 onClick={e => grdFiles_click(e, file)}
//                                 onDoubleClick={e => grdFiles_dblclick(e, file)}
//                             >
//                                 {columns.visibleColumns?.map((column, columnIndex) =>
//                                     FileDataCell({
//                                         FormatFriendlyDate,
//                                         FormatFriendlySize,
//                                         GetFileClass,
//                                         columnIndex,
//                                         file,
//                                         column,
//                                     })
//                                 )}
//                             </tr>
//                         ))}
//                     </tbody>
//                 )}
//             </table>
//         </div>
//     )
// }

// interface FileHeaderCellProps {
//     getHeaderClass: (column: FileColumnKeys) => string
//     orderBy: (key: FileColumnKeys) => void
//     columnIndex: number
//     column: FileColumnKeys
// }
// function FileHeaderCell(h: FileHeaderCellProps): JSX.Element {
//     const { getHeaderClass, orderBy, column, columnIndex } = h
//     const title = column === "type" ? "" : column
//     return (
//         <th key={columnIndex} className={getHeaderClass(column)} onClick={() => orderBy(column)}>
//             {title}
//         </th>
//     )
// }

// interface FileDataCellProps {
//     FormatFriendlyDate: (value: string | null) => string
//     FormatFriendlySize: (value: number | null | undefined) => string
//     GetFileClass: (file: C.File) => string | null
//     column: string
//     columnIndex: number
//     file: C.File
// }
// function FileDataCell(h: FileDataCellProps): JSX.Element {
//     const { FormatFriendlyDate, FormatFriendlySize, GetFileClass, column, columnIndex, file } = h
//     return (
//         <td key={columnIndex} className={column}>
//             {({
//                 type: () => <span className={GetFileClass(file) ?? ""}></span>,
//                 Name: () => (
//                     <span>
//                         <a className="Name">{file.Name}</a>
//                     </span>
//                 ),
//                 Modified: () => <span>{FormatFriendlyDate(file.Modified ?? null)}</span>,
//                 Size: () => <span>{FormatFriendlySize(file.Size)}</span>,
//                 Extension: () => !file.IsFolder && <span>{file.Extension}</span>,
//             } as Record<FileColumnKeys, () => ReactElement>)[column]?.()}
//         </td>
//     )
// }
