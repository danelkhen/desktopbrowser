import { css } from "linaria"

export const Classes = {
    FileRow: css`
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
        &.Selected {
            color: #fff;
            background-color: #a276f8;
            transition: all 0.3s ease;
        }

        &.IsFolder.HasInnerSelection.Selected {
            color: rgba(238, 238, 238, 0.7);
        }
        &.HasInnerSelection {
            color: rgba(238, 238, 238, 0.3);
        }
    `,
    IsFolder: "IsFolder",
    IsFile: "IsFile",
    HasInnerSelection: "HasInnerSelection",
    Selected: "Selected",
    sorted: "sorted",
    asc: "asc",
    desc: "desc",
} as const
