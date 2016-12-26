function tmdb_login_main() {
    let x: TmdbLoginPagePrms = { request_token: null, approved: null };
    QueryString.parse(null, x, null);
    console.log(x);
    if (x.approved == "true") {
        console.log("APPROVED");
        let win = window.opener as Window;
        if (win == null)
            return;
        win.postMessage(x, "*");
        window.close();
    }
    else {
        let url = "https://www.themoviedb.org/authenticate/" + x.request_token + "?redirect_to=" + encodeURIComponent(location.toString());
        location.assign(url);
    }
}

interface TmdbLoginPagePrms {
    request_token: string;
    approved: "true" | "false";
}