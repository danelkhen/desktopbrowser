declare module "parse-torrent-name" {
    function ptn(name: string): PtnResult

    interface PtnResult {
        season?: number
        episode?: number
        resolution?: string
        qualit?: string
        codec?: string
        group?: string
        title?: string
        year?: number
        hardcoded?: boolean
    }
    export = ptn
}
