import cx from "classnames"
import * as C from "contracts"
import React from "react"
import { Column, Columns } from "./Columns"
import { Dropdown } from "./Dropdown"
import { active } from "./index.styles"
import { MenuItems, useMenu } from "./lib/useMenu"
import * as classes from "./Menu.styles"
import {
    button,
    buttonGroup,
    buttons,
    Google,
    GotoNextSibling,
    GotoParentDir,
    GotoPrevSibling,
    menu,
    More,
    Size,
    Sort,
    Subs,
} from "./Menu.styles"
import { Api } from "./lib/useApi"
import { SetRequest } from "./lib/useReq"

export interface MenuProps {
    children: MenuItems
}
export function Menu({
    isSortedBy,
    reloadFiles,
    req,
    res,
    selectedFile,
    path,
    orderBy,
    setReq,
    getTmdbInfo,
    api,
    prevPage,
    nextPage,
    gotoPath,
}: {
    reloadFiles: () => Promise<void>
    req: C.ListFilesRequest
    res: C.ListFilesResponse
    selectedFile?: C.File
    path: string
    api: Api
    orderBy(x: Column): void
    setReq: SetRequest
    getTmdbInfo(x: C.File): void
    prevPage(): void
    nextPage(): void
    isSortedBy(key: keyof Columns, desc?: boolean | undefined): boolean
    gotoPath(): void
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
        Imdb,
        TmdbLogin,
        Scan,
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
        isSortedBy,
        prevPage,
        nextPage,
        req,
        res,
        path,
        orderBy,
        setReq,
        getTmdbInfo,
        api,
        reloadFiles,
        gotoPath,
    })

    return (
        <div className={menu}>
            <div className={buttons}>
                <div className={buttonGroup}>
                    <Button action={up.action} isActive={up.isActive} label="Up" className={GotoParentDir} />
                    <Button action={prev.action} isActive={prev.isActive} label="Prev" className={GotoPrevSibling} />
                    <Button action={next.action} isActive={next.isActive} label="Next" className={GotoNextSibling} />
                </div>
                <div className={buttonGroup}>
                    <Button action={FolderSize.action} isActive={FolderSize.isActive} label="Folder" className={Size} />
                    <Button action={google.action} isActive={google.isActive} label="Google" className={Google} />
                    <Button action={subs.action} isActive={subs.isActive} label="Subs" className={Subs} />
                    <Button
                        action={Explore.action}
                        isActive={Explore.isActive}
                        label="Explore"
                        className={classes.Explore}
                    />
                </div>
                <div className={buttonGroup}>
                    <Button
                        action={Delete.action}
                        isActive={Delete.isActive}
                        label="Delete"
                        className={classes.Delete}
                    />
                    <Button action={Imdb.action} isActive={Imdb.isActive} label="Imdb" className={classes.Imdb} />
                    <Button action={TmdbLogin.action} isActive={TmdbLogin.isActive} label="TmdbLogin" />
                    <Button action={Scan.action} isActive={Scan.isActive} label="Scan" />
                    <Dropdown>
                        <button className={cx(button, Sort)}>Sort</button>
                        <div className="menu">
                            <Button
                                action={OrderByInnerSelection.action}
                                isActive={OrderByInnerSelection.isActive}
                                label="Watched"
                            />
                            <Button
                                action={foldersFirst.action}
                                isActive={foldersFirst.isActive}
                                label="Folders first"
                            />
                            <Button
                                action={disableSorting.action}
                                isActive={disableSorting.isActive}
                                label="Disable sort"
                            />
                        </div>
                    </Dropdown>
                    <Dropdown>
                        <button className={cx(button, More)}>More</button>
                        <div className="menu">
                            <Button action={Folders.action} isActive={Folders.isActive} label="Hide Folders" />
                            <Button action={Files.action} isActive={Files.isActive} label="Hide Files" />
                            <Button action={Recursive.action} isActive={Recursive.isActive} label="Recursive" />
                            <Button action={Keep.action} isActive={Keep.isActive} label="Keep" />
                            <Button action={Hidden.action} isActive={Hidden.isActive} label="Hidden" />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

function Button({
    action,
    isActive,
    label,
    className,
}: {
    action?(): void
    isActive?(): boolean
    label?: string
    className?: string
}) {
    return (
        <button className={cx(button, className, isActive?.() && active)} onClick={action}>
            {label}
        </button>
    )
}
// function Checkbox(mi: MenuItem) {
//     return (
//         <label>
//             <input
//                 type="checkbox"
//                 checked={mi.isActive!()}
//                 onChange={e => mi.setActive!(e.currentTarget.checked)}
//                 className={mi.className}
//             />
//             {mi.label}
//         </label>
//     )
// }
