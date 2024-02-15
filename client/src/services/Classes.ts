import { css } from "../lib/ref"

export const IsFolder = css`
    label: IsFolder;
`
export const IsFile = css`
    label: IsFile;
`
export const HasInnerSelection = css``
export const Selected = css`
    label: Selected;
`
export const sorted = css``
export const asc = css``
export const desc = css``

// export const Classes = {
//     FileRow: "FileRow",
//     IsFolder: "IsFolder",
//     IsFile: "IsFile",
//     HasInnerSelection: "HasInnerSelection",
//     Selected: "Selected",
//     sorted: "sorted",
//     asc: "asc",
//     desc: "desc",
// } as const

export const FileRow = css`
    label: FileRow;
    transition: all 0.3s ease;
    color: #999;
    &:hover {
        background-color: #000;
        color: #a276f8;
        td .Name {
            text-decoration: none;
            cursor: pointer;
        }
    }
    &.${Selected} {
        color: #fff;
        background-color: #a276f8;
        transition: all 0.3s ease;
    }

    &.${IsFolder}.${HasInnerSelection}.${Selected} {
        color: rgba(238, 238, 238, 0.7);
    }
    &.${HasInnerSelection} {
        color: rgba(238, 238, 238, 0.3);
    }
`

export const Classes = {
    FileRow,
    IsFolder,
    IsFile,
    HasInnerSelection,
    Selected,
    sorted,
    asc,
    desc,
} as const

// console.log({ css, cx, classnames })
