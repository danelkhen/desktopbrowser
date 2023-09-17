import { Columns } from "../Columns"
import { FileSortConfig } from "./AppState"
import { helper } from "./Helper"

export const sortingDefaults: FileSortConfig = {
    getters: {
        type: t => t.type,
        Name: t => t.Name,
        Size: t => t.Size,
        Modified: t => t.Modified,
        Extension: t => t.Extension,
        hasInnerSelection: file => !!file.IsFolder && !!helper.getSavedSelectedFile(file.Name),
    },
    descendingFirst: {
        Size: true,
        Modified: true,
        hasInnerSelection: true,
    },
    sortGetters: {
        type: x => (x.type && helper.getFileTypeOrder(x.type)) ?? 0,
    },
    isDescending: {},
    active: [Columns.type],
}
