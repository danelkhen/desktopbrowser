import { MetaKeys } from "./Meta"
export interface Actions {
    up: "up"
    prev: "prev"
    next: "next"
    google: "google"
    subs: "subs"
    Explore: "Explore"
    Delete: "Delete"
    Imdb: "Imdb"
    TmdbLogin: "TmdbLogin"
    FolderSize: "FolderSize"
    Scan: "Scan"
    OrderByInnerSelection: "OrderByInnerSelection"
    foldersFirst: "foldersFirst"
    disableSorting: "disableSorting"
    Folders: "Folders"
    Files: "Files"
    Recursive: "Recursive"
    Keep: "Keep"
    Hidden: "Hidden"
    gotoPath: "gotoPath"
    prevPage: "prevPage"
    nextPage: "nextPage"
}
export const Actions: MetaKeys<Actions> = {
    up: "up",
    prev: "prev",
    next: "next",
    google: "google",
    subs: "subs",
    Explore: "Explore",
    Delete: "Delete",
    Imdb: "Imdb",
    TmdbLogin: "TmdbLogin",
    FolderSize: "FolderSize",
    Scan: "Scan",
    OrderByInnerSelection: "OrderByInnerSelection",
    foldersFirst: "foldersFirst",
    disableSorting: "disableSorting",
    Folders: "Folders",
    Files: "Files",
    Recursive: "Recursive",
    Keep: "Keep",
    Hidden: "Hidden",
    gotoPath: "gotoPath",
    prevPage: "prevPage",
    nextPage: "nextPage",
}
