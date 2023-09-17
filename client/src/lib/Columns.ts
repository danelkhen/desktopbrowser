import { MetaKeys } from "./Meta"

export interface ColumnKeys {
    type: "type"
    Name: "Name"
    Size: "Size"
    Modified: "Modified"
    Extension: "Extension"
    hasInnerSelection: "hasInnerSelection"
}
export const ColumnKeys: MetaKeys<ColumnKeys> = {
    type: "type",
    Name: "Name",
    Size: "Size",
    Modified: "Modified",
    Extension: "Extension",
    hasInnerSelection: "hasInnerSelection",
}

export type ColumnKey = keyof ColumnKeys
