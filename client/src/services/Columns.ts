import { MetaKeys } from "../lib/Meta"

export interface FileColumnKeys {
    type: "type"
    Name: "Name"
    Size: "Size"
    Modified: "Modified"
    Extension: "Extension"
    hasInnerSelection: "hasInnerSelection"
}
export const FileColumnKeys: MetaKeys<FileColumnKeys> = {
    type: "type",
    Name: "Name",
    Size: "Size",
    Modified: "Modified",
    Extension: "Extension",
    hasInnerSelection: "hasInnerSelection",
}

export type FileColumnKey = keyof FileColumnKeys
