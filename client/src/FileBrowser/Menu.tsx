import React from "react"
import { FsFile, ListFilesRequest, ListFilesResponse } from "../../../shared/src/FileService"
import { Dropdown } from "./Dropdown"
import { Helper, State } from "./Helper"
import { MenuItems, useMenu } from "./lib/useMenu"
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

export interface MenuProps {
    children: MenuItems
}
export function Menu({
    selectedFile,
    path,
    prevPage,
    nextPage,
    gotoPath,
    state,
    dispatcher,
}: {
    req: ListFilesRequest
    res: ListFilesResponse
    selectedFile?: FsFile
    path: string
    prevPage(): void
    nextPage(): void
    gotoPath(): void
    state: State
    dispatcher: Helper
}) {
    const { google, subs, Explore, Delete } = useMenu({
        selectedFile,
        prevPage,
        nextPage,
        path,
        gotoPath,
        state,
        dispatcher,
    })

    const { isToggled, toggle, goto } = dispatcher
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
                    <Google action={google.action} label="Google" />
                    <Subs action={subs.action} label="Subs" />
                    <ExploreButton action={Explore.action} label="Explore" />
                </ButtonGroup>
                <ButtonGroup>
                    <DeleteButton action={Delete.action} label="Delete" />
                    <Dropdown>
                        <SortButton>Sort</SortButton>
                        <div className="menu">
                            <ToggleMenuButton
                                action={dispatcher.OrderByInnerSelection}
                                isActive={dispatcher.isOrderedByInnerSelection}
                                label="Watched"
                            />
                            <ToggleMenuButton
                                action={toggle.foldersFirst}
                                isActive={isToggled.foldersFirst}
                                label="Folders first"
                            />
                            <ToggleMenuButton
                                action={dispatcher.disableSorting}
                                isActive={dispatcher.isSortingDisabled}
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
