import React, { useCallback } from "react"
import { FsFile } from "../../../shared/src/FileService"
import { ReactComponent as ExploreIcon } from "../assets/icons/explore.svg"
import { ReactComponent as FolderIcon } from "../assets/icons/folder.svg"
import { ReactComponent as GoogleIcon } from "../assets/icons/google.svg"
import { ReactComponent as MoreIcon } from "../assets/icons/more.svg"
import { ReactComponent as NextIcon } from "../assets/icons/next.svg"
import { ReactComponent as PrevIcon } from "../assets/icons/prev.svg"
import { ReactComponent as SortIcon } from "../assets/icons/sort.svg"
import { ReactComponent as SubtitleIcon } from "../assets/icons/subtitle.svg"
import { ReactComponent as TrashIcon } from "../assets/icons/trash.svg"
import { ReactComponent as UpIcon } from "../assets/icons/up.svg"
import { ReactComponent as NewIcon } from "../assets/icons/new.svg"
import { Dropdown } from "./Dropdown"
import { ButtonGroup, ButtonsDiv, MenuDiv } from "./Menu.styles"
import { MenuButton, ToggleMenuButton } from "./MenuButton"
import { Helper, State } from "./lib/Helper"

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
                    <MenuButton icon={<UpIcon />} action={goto.up} label="Up" />
                    <MenuButton icon={<PrevIcon />} action={goto.prev} label="Prev" />
                    <MenuButton icon={<NextIcon />} action={goto.next} label="Next" />
                </ButtonGroup>
                <ButtonGroup>
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
                </ButtonGroup>
                <ButtonGroup>
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
                </ButtonGroup>
            </ButtonsDiv>
        </MenuDiv>
    )
}
