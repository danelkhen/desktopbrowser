import React, { useCallback } from "react"
import { FsFile } from "../services/FileService"
import ExploreIcon from "../assets/icons/explore.svg?react"
import FolderIcon from "../assets/icons/folder.svg?react"
import GoogleIcon from "../assets/icons/google.svg?react"
import MoreIcon from "../assets/icons/more.svg?react"
import NextIcon from "../assets/icons/next.svg?react"
import PrevIcon from "../assets/icons/prev.svg?react"
import SortIcon from "../assets/icons/sort.svg?react"
import SubtitleIcon from "../assets/icons/subtitle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import UpIcon from "../assets/icons/up.svg?react"
import NewIcon from "../assets/icons/new.svg?react"
import { Dropdown } from "./Dropdown"
import { MenuButton, ToggleMenuButton } from "./MenuButton"
import { Dispatcher } from "../services/Dispatcher"
import { AppState } from "../services/AppState"
import { css } from "@emotion/css"

export function Menu({ selectedFile, dispatcher }: { state: AppState; selectedFile?: FsFile; dispatcher: Dispatcher }) {
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
        <div className={MenuDiv}>
            <div className={ButtonsDiv}>
                <div className={ButtonGroup}>
                    <MenuButton icon={<UpIcon />} action={goto.up} label="Up" />
                    <MenuButton icon={<PrevIcon />} action={goto.prev} label="Prev" />
                    <MenuButton icon={<NextIcon />} action={goto.next} label="Next" />
                </div>
                <div className={ButtonGroup}>
                    <ToggleMenuButton
                        icon={<FolderIcon />}
                        action={toggle.FolderSize}
                        isActive={isToggled.FolderSize}
                        label="Folder"
                    />
                    <MenuButton icon={<GoogleIcon />} action={google} label="Google" />
                    <MenuButton icon={<SubtitleIcon />} action={subs} label="Subs" />
                    <MenuButton icon={<ExploreIcon />} action={Explore} label="Explore" />
                    <ToggleMenuButton
                        icon={<NewIcon />}
                        action={toggle.hideWatched}
                        isActive={isToggled.hideWatched}
                        label="New"
                    />
                </div>
                <div className={ButtonGroup}>
                    <MenuButton icon={<TrashIcon />} action={Delete} label="Delete" />
                    <Dropdown>
                        <MenuButton icon={<SortIcon />} label="Sort" />
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
                        <MenuButton icon={<MoreIcon />} label="More" />
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
                </div>
            </div>
        </div>
    )
}

const ButtonGroup = css`
    display: flex;
    flex-direction: row;
    background-color: #0c0c0c;
    text-align: center;
    margin-right: 1em;
    border-radius: 20px;
    > button:first-child {
        border-left: none;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }
    > button:last-child {
        border-right: none;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }
`
const MenuDiv = css`
    display: flex;
    flex: 1;
    padding: 0.5em;
    border-bottom: 1px solid #282828;
    margin-right: 0;
    max-width: 100%;
`
const ButtonsDiv = css`
    display: flex;
    flex: 1;
    flex-direction: row;
`
