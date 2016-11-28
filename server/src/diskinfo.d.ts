declare module "diskinfo" {

    export function getDrives(cb: (err, aDrives: DiskInfoItem[]) => void): void;

    export interface DiskInfoItem {
        filesystem: string;
        blocks: number;
        used: number;
        available: number;
        capacity: number;
        mounted: string;
    }
}

declare module "vox-diskinfo" {

    export function getDrives(cb: (err, aDrives: DiskInfoItem[]) => void): void;

    export interface DiskInfoItem {
        filesystem: string;
        blocks: number;
        used: number;
        available: number;
        capacity: number;
        mounted: string;
    }
}