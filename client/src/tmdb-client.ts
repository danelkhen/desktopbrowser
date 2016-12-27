import { TmdbApi, GetApiConfigurationResponse, Movie, Media } from "./tmdb/tmdb-api"
import { TmdbApiClient, } from "./tmdb/tmdb-client"

export class TmdbClient extends TmdbApiClient {
    constructor() {
        super();
        let base = this.onInvoke;
        this.onInvoke = pc => {
            if (this.hasSessionId()) {
                let prm = pc.args[0];
                if (prm == null) {
                    prm = {};
                    pc.args[0] = prm;
                }
                if (prm.session_id == null)
                    prm.session_id = this.session_id;
            }
            return base(pc).then(t => this.fixResponse(t));
        };
    }
    init(): Promise<any> {
        this.api_key = '16a856dff4d1db46782e6132610ddb32';
        return this.invoke(t => t.getApiConfiguration({})).then(t => this.configuration = t);
    }

    configuration: GetApiConfigurationResponse;
    fixResponse(res: any): any {
        if (res == null || typeof (res) != "object")
            return res;
        let movie = res as Media;
        let props: Array<keyof Media> = ["poster_path", "backdrop_path"];
        props.forEach(prop => {
            if (movie[prop] == null)
                return;
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
        Object.values(res).forEach(t => this.fixResponse(t));
        return res;

    }


    getImageSizes(prop: keyof Media): string[] {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (prop == "backdrop_path")
            return c.backdrop_sizes;
        else if (prop == "poster_path")
            return c.poster_sizes;
        return null;
    }
    getImageUrl(movie: Media, prop: keyof Media, size?: string): string {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (size == null)
            size = this.getImageSizes(prop)[0];
        return `${c.base_url}${size}/${movie[prop]}`;
    }

    storage: GeneralStorage = localStorage;

    get request_token(): string { return this.storage.tmdb_request_token; }
    set request_token(value: string) { this.storage.tmdb_request_token = value; }

    get session_id(): string { return this.storage.tmdb_session_id; }
    set session_id(value: string) { this.storage.tmdb_session_id = value; }

    hasSessionId() {
        return this.session_id != null && this.session_id != "";
    }
    loginToTmdb(): Promise<any> {
        if (this.hasSessionId())
            return Promise.resolve();
        return new Promise<any>((resolve, reject) => {
            window.addEventListener("message", e => {
                console.log("messsage", e.data, e);
                let x: TmdbLoginPagePrms = e.data;
                if (x.approved != "true") {
                    reject();
                    return;
                }
                this.invoke(t => t.authenticationCreateSession({ request_token: x.request_token }))
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
            this.invoke(t => t.authenticationCreateRequestToken({})).then(e => {
                this.request_token = e.request_token;
                console.log(e);
                let win = window.open("/tmdb-login.html?request_token=" + this.request_token);
                //let win = window.open("https://www.themoviedb.org/authenticate/" + e.request_token + "?redirect_to=" + encodeURIComponent(location.toString()));
            });
        });
    }

}

export interface GeneralStorage {
    tmdb_request_token?: string;
    tmdb_session_id?: string;
}