import { MetaKeys } from "../utils/Meta"

export interface Columns {
    type: "type"
    Name: "Name"
    Size: "Size"
    Modified: "Modified"
    Extension: "Extension"
    hasInnerSelection: "hasInnerSelection"
}
export const Columns: MetaKeys<Columns> = {
    type: "type",
    Name: "Name",
    Size: "Size",
    Modified: "Modified",
    Extension: "Extension",
    hasInnerSelection: "hasInnerSelection",
}

export type Column = keyof Columns
