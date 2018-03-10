"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./tmdb/v3/client");
const utils_1 = require("./utils/utils");
class TmdbClient extends client_1.TmdbV3Client {
    constructor() {
        super();
        this.tvShowWatchlistIds = new Set();
        this.movieWatchlistIds = new Set();
        this.storage = localStorage;
        this.getMovieOrTvByTypeAndIdCache = new Map();
        this.failed = [];
        this.rated = new Set();
        this.watched = new Set();
        console.log("TmdbClient ctor", this);
        let base = this.proxy.onInvoke;
        this.proxy.onInvoke = pc => {
            if (this.hasSessionId()) {
                let prm = pc.args[0];
                if (prm == null) {
                    prm = {};
                    pc.args[0] = prm;
                }
                if (prm.session_id == null && this.session_id != null)
                    prm.session_id = this.session_id;
                if (prm.account_id == null && this.account_id != null)
                    prm.account_id = this.account_id;
            }
            return base(pc).then(t => this.fixResponse(t, pc.name));
        };
    }
    async init() {
        this.configuration = await this.getApiConfiguration({});
        await this.onLogin();
    }
    async onLogin() {
    }
    async accountGetDetails(req) {
        try {
            this.account = await super.accountGetDetails(req);
            if (this.account != null)
                this.account_id = this.account.id;
            return this.account;
        }
        catch (e) {
            console.warn("accountGetDetails failed", e);
        }
    }
    detectMediaType(media, methodName) {
        if (media.media_type != null)
            return true;
        methodName = methodName.toLowerCase();
        if (methodName.startsWith("tv"))
            media.media_type = "tv";
        else if (methodName.startsWith("movie"))
            media.media_type = "movie";
        else if (methodName.contains("tv"))
            media.media_type = "tv";
        else if (methodName.contains("movie"))
            media.media_type = "movie";
        else
            console.log("unknown media type", { media, methodName });
    }
    fixResponse(res, methodName) {
        if (res == null || typeof (res) != "object")
            return res;
        let movie = res;
        let props = ["poster_path", "backdrop_path"];
        props.forEach(prop => {
            if (movie[prop] == null)
                return;
            this.detectMediaType(movie, methodName);
            let urlProp = prop.replace("_path", "_url");
            let imagesProp = prop.replace("_path", "");
            movie[urlProp] = this.getImageUrl(movie, prop);
            let images = movie[imagesProp];
            if (images == null) {
                images = {};
                movie[imagesProp] = images;
            }
            this.getImageSizes(prop).forEach(size => images[size] = this.getImageUrl(movie, prop, size));
        });
        Object.values(res).forEach((t) => this.fixResponse(t, methodName));
        return res;
    }
    getImageSizes(prop) {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (prop == "backdrop_path")
            return c.backdrop_sizes;
        else if (prop == "poster_path")
            return c.poster_sizes;
        return null;
    }
    getImageUrl(movie, prop, size) {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (size == null)
            size = this.getImageSizes(prop)[0];
        return `${c.base_url}${size}${movie[prop]}`;
    }
    get request_token() { return this.storage.tmdb_request_token; }
    set request_token(value) { this.storage.tmdb_request_token = value; }
    get session_id() { return this.storage.tmdb_session_id; }
    set session_id(value) { this.storage.tmdb_session_id = value; }
    get account_id() { return utils_1.tryParseInt(this.storage.tmdb_account_id); }
    set account_id(value) { this.storage.tmdb_account_id = String(value); }
    hasSessionId() {
        return this.session_id != null && this.session_id != "";
    }
    async loginToTmdb() {
        await this._loginToTmdb();
        await this.onLogin();
    }
    _loginToTmdb() {
        return new Promise((resolve, reject) => {
            window.addEventListener("message", e => {
                console.log("messsage", e.data, e);
                let x = e.data;
                if (x.approved != "true") {
                    reject();
                    return;
                }
                this.authenticationCreateSession({ request_token: x.request_token })
                    .then(e => {
                    console.log("session", e);
                    if (!e.success) {
                        reject();
                        return;
                    }
                    this.session_id = e.session_id;
                    resolve();
                });
            });
            this.authenticationCreateRequestToken({}).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?request_token=" + this.request_token);
            });
        });
    }
    async getMovieOrTvByTypeAndId(typeAndId) {
        if (typeAndId == null)
            return null;
        let media = this.getMovieOrTvByTypeAndIdCache.get(typeAndId);
        if (media !== undefined)
            return media;
        let tokens = typeAndId.split("|");
        if (tokens.length < 2)
            return null;
        let media_type = tokens[0];
        let id = tokens[1];
        if (media_type == "movie")
            media = await this.movieGetDetails({ movie_id: id, });
        else if (media_type == "tv")
            media = await this.tvGetDetails({ tv_id: id, });
        this.getMovieOrTvByTypeAndIdCache.set(typeAndId, media);
        return media;
    }
    isWatchedOrRated(typeAndId) {
        if (typeAndId == null)
            return null;
        if (this.rated.has(typeAndId))
            return true;
        if (this.watched.has(typeAndId))
            return true;
        return false;
    }
    async markAsWatched(typeAndId, watched = true, refreshList) {
    }
    markAllRatedAsWatched() {
        let ratedButNotWatched = utils_1.setMinus(this.rated, this.watched);
        return utils_1.promiseEach(Array.from(ratedButNotWatched), id => this.markAsWatched(id, true, false));
    }
    async importTvFavs(names) {
        for (let name of names) {
            let res = await this.searchTvShows({ query: name });
            let show = res.results[0];
            if (show == null) {
                console.log("can't find", name);
                continue;
            }
            console.log(name, show.id);
            await this.accountMarkasFavorite({ body: { media_type: "tv", media_id: show.id, favorite: true } });
        }
    }
}
exports.TmdbClient = TmdbClient;
//# sourceMappingURL=tmdb-client.js.map