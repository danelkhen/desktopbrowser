import { app, shell } from "electron"
import GitHub, { Release } from "github-api"
import semver from "semver"
import os from "os"

export async function checkForUpdates() {
    console.log("checking for updates")
    const gh = new GitHub()
    const { data: rel } = await gh.getRepo("danelkhen", "desktopbrowser").getRelease("latest")
    const current = app.getVersion()
    const latest = rel.name.substr(1)
    console.log(current, latest)
    const isLatest = semver.gte(current, latest)
    if (!isLatest) {
        const asset = getAsset(rel)
        if (asset) {
            await shell.openExternal(asset.browser_download_url)
        } else {
            await shell.openExternal(rel.html_url)
        }
    }
    return { latest, current, isLatest }
}

function getAsset(rel: Release) {
    if (os.platform() == "darwin") {
        return rel.assets.find(t => t.name.includes("darwin"))
    }
    if (os.platform() == "win32") {
        return rel.assets.find(t => t.name.includes(".exe"))
    }
    return null
}
