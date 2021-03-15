function tmdb_login_main() {
    let x: TmdbLoginPagePrms = {} as TmdbLoginPagePrms
    new URLSearchParams(location.search).forEach((value, key) => {
        ;(x as any)[key] = value
    })
    // QueryString.parse(null, x, null);
    console.log(x)
    if (x.approved == "true" || x.back == "1") {
        console.log("APPROVED")
        let win = window.opener as Window
        if (win == null) return
        win.postMessage(x, "*")
        window.close()
    } else {
        let redirect_to = location.toString().substr(0, location.toString().indexOf("?"))
        if (x.v == "4") {
            let url = "https://www.themoviedb.org/auth/access?request_token=" + encodeURIComponent(x.request_token)
            location.assign(url)
        } else {
            let url =
                "https://www.themoviedb.org/authenticate/" +
                x.request_token +
                "?redirect_to=" +
                encodeURIComponent(redirect_to)
            location.assign(url)
        }
    }
}

interface TmdbLoginPagePrms {
    request_token: string
    approved: "true" | "false"
    v: string
    back: string
}
