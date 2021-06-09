export interface GetFileAndFoldersRequest {
    path: string
    searchPattern?: string
    recursive?: boolean
    files?: boolean
    folders?: boolean
}

export class Stopwatch {
    Start() {}
    Stop() {}
    ElapsedMilliseconds: number = undefined!
}
