import { app, shell } from "electron"
import GitHub from "github-api"
import semver from "semver"

export async function checkForUpdates() {
    console.log("checking for updates")
    const gh = new GitHub()
    const { data: rel } = await gh.getRepo("danelkhen", "desktopbrowser").getRelease("latest")
    const current = app.getVersion()
    const latest = rel.name.substr(1)
    console.log(current, latest)
    const isLatest = semver.gte(current, latest)
    if (!isLatest) {
        await shell.openExternal(rel.browser_download_url)
    }
    return { latest, current, isLatest }
}
