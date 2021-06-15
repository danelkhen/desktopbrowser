import React, { useCallback } from "react"
import { FsFile } from "../../../shared/src/FileService"
import { Dropdown } from "./Dropdown"
import { Helper, State } from "./lib/Helper"
import {
    ButtonGroup,
    ButtonsDiv,
    DeleteButton,
    ExploreButton,
    Google,
    GotoNextSibling,
    GotoParentDir,
    GotoPrevSibling,
    MenuDiv,
    MoreButton,
    Size,
    SortButton,
    Subs,
} from "./Menu.styles"
import { ToggleMenuButton } from "./MenuButton"

export function Menu({ selectedFile, dispatcher }: { state: State; selectedFile?: FsFile; dispatcher: Helper }) {
    const Delete = useCallback(
        (e?: React.KeyboardEvent) =>
            selectedFile && dispatcher.deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

        [dispatcher, selectedFile]
    )

    const {
        isToggled,
        toggle,
        goto,
        google,
        subs,
        Explore,
        OrderByInnerSelection,
        isOrderedByInnerSelection,
        disableSorting,
        isSortingDisabled,
    } = dispatcher
    return (
        <MenuDiv>
            <ButtonsDiv>
                <ButtonGroup>
                    <GotoParentDir action={goto.up} label="Up" />
                    <GotoPrevSibling action={goto.prev} label="Prev" />
                    <GotoNextSibling action={goto.next} label="Next" />
                </ButtonGroup>
                <ButtonGroup>
                    <Size action={toggle.FolderSize} isActive={isToggled.FolderSize} label="Folder" />
                    <Google action={google} label="Google" />
                    <Subs action={subs} label="Subs" />
                    <ExploreButton action={Explore} label="Explore" />
                </ButtonGroup>
                <ButtonGroup>
                    <DeleteButton action={Delete} label="Delete" />
                    <Dropdown>
                        <SortButton>Sort</SortButton>
                        <div className="menu">
                            <ToggleMenuButton
                                action={OrderByInnerSelection}
                                isActive={isOrderedByInnerSelection}
                                label="Watched"
                            />
                            <ToggleMenuButton
                                action={toggle.foldersFirst}
                                isActive={isToggled.foldersFirst}
                                label="Folders first"
                            />
                            <ToggleMenuButton
                                action={disableSorting}
                                isActive={isSortingDisabled}
                                label="Disable sort"
                            />
                        </div>
                    </Dropdown>
                    <Dropdown>
                        <MoreButton>More</MoreButton>
                        <div className="menu">
                            <ToggleMenuButton
                                action={toggle.Folders}
                                isActive={isToggled.Folders}
                                label="Hide Folders"
                            />
                            <ToggleMenuButton action={toggle.Files} isActive={isToggled.Files} label="Hide Files" />
                            <ToggleMenuButton
                                action={toggle.Recursive}
                                isActive={isToggled.Recursive}
                                label="Recursive"
                            />
                            <ToggleMenuButton action={toggle.Keep} isActive={isToggled.Keep} label="Keep" />
                            <ToggleMenuButton action={toggle.Hidden} isActive={isToggled.Hidden} label="Hidden" />
                        </div>
                    </Dropdown>
                </ButtonGroup>
            </ButtonsDiv>
        </MenuDiv>
    )
}
