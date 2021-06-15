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
    const {
        up,
        prev,
        next,
        FolderSize,
        google,
        subs,
        Explore,
        Delete,
        OrderByInnerSelection,
        Files,
        Folders,
        foldersFirst,
        Hidden,
        Keep,
        Recursive,
        disableSorting,
    } = useMenu({
        selectedFile,
        prevPage,
        nextPage,
        path,
        gotoPath,
        state,
        dispatcher,
    })

    return (
        <MenuDiv>
            <ButtonsDiv>
                <ButtonGroup>
                    <GotoParentDir action={up.action} label="Up" />
                    <GotoPrevSibling action={prev.action} label="Prev" />
                    <GotoNextSibling action={next.action} label="Next" />
                </ButtonGroup>
                <ButtonGroup>
                    <Size action={FolderSize.action} isActive={FolderSize.isActive} label="Folder" />
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
                                action={OrderByInnerSelection.action}
                                isActive={OrderByInnerSelection.isActive}
                                label="Watched"
                            />
                            <ToggleMenuButton
                                action={foldersFirst.action}
                                isActive={foldersFirst.isActive}
                                label="Folders first"
                            />
                            <ToggleMenuButton
                                action={disableSorting.action}
                                isActive={disableSorting.isActive}
                                label="Disable sort"
                            />
                        </div>
                    </Dropdown>
                    <Dropdown>
                        <MoreButton>More</MoreButton>
                        <div className="menu">
                            <ToggleMenuButton
                                action={Folders.action}
                                isActive={Folders.isActive}
                                label="Hide Folders"
                            />
                            <ToggleMenuButton action={Files.action} isActive={Files.isActive} label="Hide Files" />
                            <ToggleMenuButton
                                action={Recursive.action}
                                isActive={Recursive.isActive}
                                label="Recursive"
                            />
                            <ToggleMenuButton action={Keep.action} isActive={Keep.isActive} label="Keep" />
                            <ToggleMenuButton action={Hidden.action} isActive={Hidden.isActive} label="Hidden" />
                        </div>
                    </Dropdown>
                </ButtonGroup>
            </ButtonsDiv>
        </MenuDiv>
    )
}
