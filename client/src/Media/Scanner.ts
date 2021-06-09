import * as M from "../../../shared/src/media"
import { TmdbApiV3 } from "../../../tmdb/src"
import { App } from "../App"
import { FilenameParser } from "../utils/FilenameParser"
import moment from "moment"
import { MediaApp } from "./MediaApp"

type Response = TmdbApiV3.Response
type TmdbMedia = TmdbApiV3.TmdbMedia
export class Scanner {
    folders: string[] | undefined
    app: MediaApp | undefined
    results: M.MediaFile[] | undefined
    errors: any[] = []

    videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"]
    isVideoFile(name: string): boolean {
        return this.videoExts.find(t => name.endsWith(t)) != null
    }
    async scan(): Promise<void> {
        if (!this.folders) return
        this.results = []
        for (let folder of this.folders) await this.scanDir(folder)
    }
    async scanDir(dir: string): Promise<void> {
        if (!this.app || !this.results) return
        let res = await this.app.app.fileService.ws.ListFiles({ Path: dir, IsRecursive: true })
        if (!res?.Files) return
        let videoFiles = res.Files.filter(t => this.isVideoFile(t.Name))
        for (let file of videoFiles) {
            let md = await this.app.app.getFileMetadata(file)
            //md.modified = file.Modified;
            if (md != null && md.tmdbKey != null) {
                console.log("tmdbId already exists, skipping", { file, md })
                continue
            }
            let mf: M.MediaFile = { file, md, type: null, parsed: null, fsEntry: null } as unknown as M.MediaFile
            try {
                await this.analyze(mf)
            } catch (e2) {
                let e: Response = e2
                console.warn(e)
                this.errors.push(e)
                if (this.errors.length > 3) throw e2
            }
            this.results.push(mf)
        }
    }

    async analyze(mf: M.MediaFile, opts?: { force?: boolean }): Promise<void> {
        if (mf.md.scanned != null && mf.md.scanned != "" && (opts == null || !opts.force)) return
        mf.md.scanned = moment().format("YYYY-MM-DD HH:mm:ss")
        await this._analyze(mf)
        this.app?.app.fileService.http.saveFileMetadata(mf.md)
    }
    async _analyze(mf: M.MediaFile): Promise<void> {
        let filename = (mf.fsEntry && mf.fsEntry.basename) || (mf.file && mf.file.Name)
        if (!filename) return
        let path = (mf.fsEntry && mf.fsEntry.key) || (mf.file && mf.file.Path)
        console.log("getImdbInfo", "start", filename)
        mf.parsed = new FilenameParser().parse(filename)
        if (mf.parsed == null) {
            console.log("filename parsing returned null", filename)
            return
        }
        let isTv = mf.parsed.season != null
        let media: TmdbMedia | undefined
        if (isTv) {
            let e = await this.app?.tmdbApp.tmdb.searchTvShows({ query: mf.parsed.name })
            media = e?.results?.[0]
        } else {
            let e = await this.app?.tmdbApp.tmdb.searchMulti({ query: mf.parsed.name })
            media = e?.results?.find(t => t.media_type == "tv" || t.media_type == "movie") as TmdbMedia
        }
        //else {
        //    let e = await this.app.tmdb.searchMovies({ query: mf.parsed.name })
        //    media = e.results[0];
        //}
        mf.tmdbBasic = media
        if (mf.tmdbBasic != null) {
            mf.type = mf.tmdbBasic.media_type!
            mf.md.tmdbKey = [mf.tmdbBasic.media_type, mf.tmdbBasic.id].join("|")
            if (mf.tmdbBasic.media_type == "tv" && mf.parsed.episode != null && mf.parsed.season != null)
                mf.md.episodeKey =
                    "s" +
                    mf.parsed.season.toString().padStart(2, "0") +
                    "e" +
                    mf.parsed.episode.toString().padStart(2, "0")
        } else {
            mf.md.tmdbKey = undefined
        }
        mf.md.lastKnownPath = path
    }
}
