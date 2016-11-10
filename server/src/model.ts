export interface File {
    IsFolder: boolean;
    Name: string;
    Path?: string;
    Modified?: string;
    IsHidden?: boolean;
    Size?: number;
    Extension?: string;
}

export interface FileRelativesInfo {
    ParentFolder: File;
    NextSibling: File;
    PreviousSibling: File;
}
