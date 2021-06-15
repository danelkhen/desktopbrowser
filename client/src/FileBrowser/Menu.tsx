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
import { MenuButton } from "./MenuButton"

export interface MenuProps {
    children: MenuItems
}
export function Menu({
    reloadFiles,
    req,
    res,
    selectedFile,
    path,
    prevPage,
    nextPage,
    gotoPath,
    state,
    dispatcher,
}: {
    reloadFiles: () => unknown
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
        req,
        res,
        path,
        reloadFiles,
        gotoPath,
        state,
        dispatcher,
    })

    return (
        <MenuDiv>
            <ButtonsDiv>
                <ButtonGroup>
                    <GotoParentDir action={up.action} isActive={up.isActive} label="Up" />
                    <GotoPrevSibling action={prev.action} isActive={prev.isActive} label="Prev" />
                    <GotoNextSibling action={next.action} isActive={next.isActive} label="Next" />
                </ButtonGroup>
                <ButtonGroup>
                    <Size action={FolderSize.action} isActive={FolderSize.isActive} label="Folder" />
                    <Google action={google.action} isActive={google.isActive} label="Google" />
                    <Subs action={subs.action} isActive={subs.isActive} label="Subs" />
                    <ExploreButton action={Explore.action} isActive={Explore.isActive} label="Explore" />
                </ButtonGroup>
                <ButtonGroup>
                    <DeleteButton action={Delete.action} isActive={Delete.isActive} label="Delete" />
                    <Dropdown>
                        <SortButton>Sort</SortButton>
                        <div className="menu">
                            <MenuButton
                                action={OrderByInnerSelection.action}
                                isActive={OrderByInnerSelection.isActive}
                                label="Watched"
                            />
                            <MenuButton
                                action={foldersFirst.action}
                                isActive={foldersFirst.isActive}
                                label="Folders first"
                            />
                            <MenuButton
                                action={disableSorting.action}
                                isActive={disableSorting.isActive}
                                label="Disable sort"
                            />
                        </div>
                    </Dropdown>
                    <Dropdown>
                        <MoreButton>More</MoreButton>
                        <div className="menu">
                            <MenuButton action={Folders.action} isActive={Folders.isActive} label="Hide Folders" />
                            <MenuButton action={Files.action} isActive={Files.isActive} label="Hide Files" />
                            <MenuButton action={Recursive.action} isActive={Recursive.isActive} label="Recursive" />
                            <MenuButton action={Keep.action} isActive={Keep.isActive} label="Keep" />
                            <MenuButton action={Hidden.action} isActive={Hidden.isActive} label="Hidden" />
                        </div>
                    </Dropdown>
                </ButtonGroup>
            </ButtonsDiv>
        </MenuDiv>
    )
}
