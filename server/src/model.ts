export interface File {
    IsFolder: boolean;
    Name: string;
    Path?: string;
    Modified?: string;
    IsHidden?: boolean;
    Size?: number;
    Extension?: string;
    type?: "file" | "folder" | "link" | string;
}

export interface FileRelativesInfo {
    ParentFolder: File;
    NextSibling: File;
    PreviousSibling: File;
}
