import { ReactElement } from "react"
import { FileColumns } from "../services/AppState"
import FileEmptyIcon from "../assets/linearicons/svg/file-empty.svg?react"
import LayersIcon from "../assets/linearicons/svg/layers.svg?react"
import LinkIcon from "../assets/linearicons/svg/link.svg?react"
import { formatFriendlySize } from "../lib/formatFriendlySize"
import { formatFriendlyDate } from "../lib/formatFriendlyDate"
import { dispatcher } from "../services/Dispatcher"
import { FileColumnKeys } from "../services/Columns"

export const gridColumns: FileColumns = {
    type: {
        getter: t => t.type,
        cell: file => (file.type && icons[file.type] && icons[file.type]) || null,
        header: () => "",
        sortGetter: x => (x.type && dispatcher.getFileTypeOrder(x.type)) ?? 0,
    },
    Name: {
        getter: t => t.Name,
        cell: file => (
            <span>
                <a className="Name">{file.Name}</a>
            </span>
        ),
    },
    Size: { getter: t => t.Size, cell: file => <span>{formatFriendlySize(file.Size)}</span>, descendingFirst: true },
    Modified: {
        getter: t => t.Modified,
        cell: file => <span>{formatFriendlyDate(file.Modified ?? null)}</span>,
        descendingFirst: true,
    },
    Extension: { getter: t => t.Extension, cell: file => !file.IsFolder && <span>{file.Extension}</span> },
    hasInnerSelection: {
        getter: t => !!t?.IsFolder && !!dispatcher.getSavedSelectedFile(t.Name),
        descendingFirst: true,
    },
}

export const visibleGridColumns = [
    FileColumnKeys.type,
    FileColumnKeys.Name,
    FileColumnKeys.Modified,
    FileColumnKeys.Size,
    FileColumnKeys.Extension,
]

export const icons: { [key: string]: ReactElement } = {
    folder: <LayersIcon />,
    file: <FileEmptyIcon />,
    link: <LinkIcon />,
}
