import { TmdbApi, GetApiConfigurationResponse, TmdbMovie } from "./tmdb/tmdb-api"
import { TmdbApiClient, } from "./tmdb/tmdb-client"

export class TmdbClient extends TmdbApiClient {
    constructor() {
        super();
        let base = this.onInvoke;
        this.onInvoke = pc => base(pc).then(t => this.fixResponse(t));
    }
    init(): Promise<any> {
        this.api_key = '16a856dff4d1db46782e6132610ddb32';
        return this.invoke(t => t.getApiConfiguration({})).then(t => this.configuration = t);
    }

    configuration: GetApiConfigurationResponse;
    fixResponse(res: any): any {
        if (typeof (res) != "object")
            return res;
        let movie = res as TmdbMovie;
        if (movie.poster_path != null)
            movie.poster_url = this.getImageUrl(movie, "poster_path");
        if (movie.backdrop_path != null)
            movie.backdrop_url = this.getImageUrl(movie, "backdrop_path");
        Object.values(res).forEach(t => this.fixResponse(t));
        return res;

    }


    getImageUrl(movie: TmdbMovie, prop: keyof TmdbMovie, size?: string): string {
        if (this.configuration == null || this.configuration.images == null)
            return null;
        let c = this.configuration.images;
        if (size == null) {
            if (prop == "backdrop_path") {
                size = c.backdrop_sizes[0];
            }
            else if (prop == "poster_path") {
                size = c.poster_sizes[0];
            }
            else {
                console.warn("getImageUrl2 not implemented for prop", prop);
                return null;
            }
        }
        return `${c.base_url}${size}/${movie[prop]}`;
    }
}
