import { ReactElement } from "react"
import { FileColumns2 } from "./AppState"
import { ReactComponent as FileEmptyIcon } from "../assets/linearicons/svg/file-empty.svg"
import { ReactComponent as LayersIcon } from "../assets/linearicons/svg/layers.svg"
import { ReactComponent as LinkIcon } from "../assets/linearicons/svg/link.svg"
import { formatFriendlySize } from "./formatFriendlySize"
import { formatFriendlyDate } from "./formatFriendlyDate"
import { dispatcher } from "./Dispatcher"
import { Columns } from "./Columns"

export const gridColumns2: FileColumns2 = {
    type: {
        getter: t => t.type,
        cell: file => (file.type && icons[file.type] && icons[file.type]) || null,
        header: () => "",
    },
    Name: {
        getter: t => t.Name,
        cell: file => (
            <span>
                <a className="Name">{file.Name}</a>
            </span>
        ),
    },
    Size: { getter: t => t.Size, cell: file => <span>{formatFriendlySize(file.Size)}</span> },
    Modified: { getter: t => t.Modified, cell: file => <span>{formatFriendlyDate(file.Modified ?? null)}</span> },
    Extension: { getter: t => t.Extension, cell: file => !file.IsFolder && <span>{file.Extension}</span> },
    hasInnerSelection: { getter: t => !!t?.IsFolder && !!dispatcher.getSavedSelectedFile(t.Name) },
}

export const visibleGridColumns2 = [Columns.type, Columns.Name, Columns.Modified, Columns.Size, Columns.Extension]

export const icons: { [key: string]: ReactElement } = {
    folder: <LayersIcon />,
    file: <FileEmptyIcon />,
    link: <LinkIcon />,
}
