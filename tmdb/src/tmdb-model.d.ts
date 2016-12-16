export interface Body {
    mediaType?: Body.MediaTypeEnum;
    mediaId?: number;
    favorite?: boolean;
}
export namespace Body {
    enum MediaTypeEnum {
        movie,
        tv,
    }
}
export interface Body1 {
    mediaType?: Body1.MediaTypeEnum;
    mediaId?: number;
    watchlist?: boolean;
}
export namespace Body1 {
    enum MediaTypeEnum {
        movie,
        tv,
    }
}
export interface Body2 {
    name?: string;
    description?: string;
    language?: string;
}
export interface Body3 {
    mediaId?: number;
}
export interface Body4 {
    mediaId?: number;
}
export interface Body5 {
    /**
     * This is the value of the rating you want to submit. The value is expected to be between 0.5 and 10.0.
     */
    value?: number;
}
export interface Body6 {
    value?: number;
}
export interface Body7 {
    value?: number;
}
export interface GetAccountResponse {
    avatar?: InlineResponse200Avatar;
    id?: number;
    iso6391?: string;
    iso31661?: string;
    name?: string;
    includeAdult?: boolean;
    username?: string;
}
export interface InlineResponse2001 {
    page?: number;
    results?: Array<InlineResponse2001Results>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20010 {
    id?: number;
    backdrops?: Array<InlineResponse20010Backdrops>;
    posters?: Array<InlineResponse20010Posters>;
}
export interface InlineResponse20010Backdrops {
    aspectRatio?: number;
    filePath?: string;
    height?: number;
    voteAverage?: number;
    voteCount?: number;
    width?: number;
}
export interface InlineResponse20010Posters {
    aspectRatio?: number;
    filePath?: string;
    height?: number;
    iso6391?: string;
    voteAverage?: number;
    voteCount?: number;
    width?: number;
}
export interface InlineResponse20011 {
    headquarters?: string;
    homepage?: string;
    id?: number;
    name?: string;
}
export interface InlineResponse20012 {
    images?: InlineResponse20012Images;
    changeKeys?: Array<string>;
}
export interface InlineResponse20012Images {
    baseUrl?: string;
    secureBaseUrl?: string;
    backdropSizes?: Array<string>;
    logoSizes?: Array<string>;
    posterSizes?: Array<string>;
    profileSizes?: Array<string>;
    stillSizes?: Array<string>;
}
export interface InlineResponse20013 {
    creditType?: string;
    department?: string;
    job?: string;
    media?: InlineResponse20013Media;
    mediaType?: string;
    id?: string;
    person?: InlineResponse20013Person;
}
export interface InlineResponse20013Media {
    id?: number;
    name?: string;
    originalName?: string;
    character?: string;
    episodes?: Array<any>;
    seasons?: Array<InlineResponse20013MediaSeasons>;
}
export interface InlineResponse20013MediaSeasons {
    airDate?: string;
    posterPath?: string;
    seasonNumber?: number;
}
export interface InlineResponse20013Person {
    name?: string;
    id?: number;
}
export interface InlineResponse20014 {
    genres?: Array<InlineResponse20014Genres>;
}
export interface InlineResponse20014Genres {
    id?: number;
    name?: string;
}
export interface InlineResponse20015 {
    page?: number;
    results?: Array<InlineResponse20015Results>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20015Results {
    airDate?: string;
    episodeNumber?: number;
    name?: string;
    id?: number;
    seasonNumber?: number;
    stillPath?: string;
    showId?: number;
    voteAverage?: number;
    voteCount?: number;
    rating?: number;
}
export interface InlineResponse20016 {
    jobs?: Array<InlineResponse20016Jobs>;
}
export interface InlineResponse20016Jobs {
    department?: string;
    jobList?: Array<string>;
}
export interface InlineResponse20017 {
    id?: string;
    itemPresent?: boolean;
}
export interface InlineResponse20018 {
    results?: Array<InlineResponse20018Results>;
    page?: number;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20018Results {
    id?: number;
}
export interface InlineResponse20019 {
    adult?: boolean;
    budget?: number;
    genres?: Array<InlineResponse20014Genres>;
    homepage?: string;
    id?: number;
    imdbId?: string;
    originalLanguage?: string;
    originalTitle?: string;
    overview?: string;
    popularity?: number;
    productionCompanies?: Array<any>;
    productionCountries?: Array<any>;
    releaseDate?: string;
    revenue?: number;
    runtime?: number;
    spokenLanguages?: Array<any>;
    status?: string;
    tagline?: string;
    title?: string;
    video?: boolean;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse2001Results {
    description?: string;
    favoriteCount?: number;
    id?: number;
    itemCount?: number;
    iso6391?: string;
    listType?: string;
    name?: string;
}
export interface InlineResponse2002 {
    page?: number;
    results?: Array<InlineResponse2002Results>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20020 {
    adult?: boolean;
    budget?: number;
    genres?: Array<InlineResponse20014Genres>;
    homepage?: string;
    id?: number;
    imdbId?: string;
    originalLanguage?: string;
    originalTitle?: string;
    overview?: string;
    popularity?: number;
    productionCompanies?: Array<InlineResponse20013Person>;
    productionCountries?: Array<InlineResponse20020ProductionCountries>;
    releaseDate?: Date;
    revenue?: number;
    runtime?: number;
    spokenLanguages?: Array<InlineResponse20020SpokenLanguages>;
    status?: string;
    tagline?: string;
    title?: string;
    video?: boolean;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse20020ProductionCountries {
    iso31661?: string;
    name?: string;
}
export interface InlineResponse20020SpokenLanguages {
    iso6391?: string;
    name?: string;
}
export interface InlineResponse20021 {
    id?: number;
    favorite?: boolean;
    watchlist?: boolean;
}
export interface InlineResponse20022 {
    id?: number;
    titles?: Array<InlineResponse20022Titles>;
}
export interface InlineResponse20022Titles {
    iso31661?: string;
    title?: string;
}
export interface InlineResponse20023 {
    changes?: Array<InlineResponse20023Changes>;
}
export interface InlineResponse20023Changes {
    key?: string;
    items?: Array<InlineResponse20023Items>;
}
export interface InlineResponse20023Items {
    id?: string;
    action?: string;
    time?: string;
    iso6391?: string;
    value?: string;
    originalValue?: string;
}
export interface InlineResponse20024 {
    id?: number;
    cast?: Array<InlineResponse20024Cast>;
    crew?: Array<InlineResponse20024Crew>;
}
export interface InlineResponse20024Cast {
    castId?: number;
    character?: string;
    creditId?: string;
    id?: number;
    name?: string;
    order?: number;
}
export interface InlineResponse20024Crew {
    creditId?: string;
    department?: string;
    id?: number;
    job?: string;
    name?: string;
}
export interface InlineResponse20025 {
    id?: number;
    backdrops?: Array<InlineResponse20025Backdrops>;
    posters?: Array<InlineResponse20025Backdrops>;
}
export interface InlineResponse20025Backdrops {
    aspectRatio?: number;
    filePath?: string;
    height?: number;
    voteAverage?: number;
    voteCount?: number;
    width?: number;
}
export interface InlineResponse20026 {
    id?: number;
    keywords?: Array<InlineResponse20014Genres>;
}
export interface InlineResponse20027 {
    id?: number;
    page?: number;
    results?: Array<InlineResponse2001Results>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20028 {
    page?: number;
    results?: Array<MovieListResultObject>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20029 {
    id?: number;
    results?: Array<InlineResponse20029Results>;
}
export interface InlineResponse20029ReleaseDates {
    certification?: string;
    iso6391?: string;
    note?: string;
    releaseDate?: string;
    type?: number;
}
export interface InlineResponse20029Results {
    iso31661?: string;
    releaseDates?: Array<InlineResponse20029ReleaseDates>;
}
export interface InlineResponse2002Results {
    id?: string;
    airDate?: string;
    episodeNumber?: number;
    name?: string;
    seasonNumber?: number;
    showId?: number;
    voteAverage?: number;
    voteCount?: number;
    rating?: number;
}
export interface InlineResponse2003 {
    success?: boolean;
    guestSessionId?: string;
    expiresAt?: string;
}
export interface InlineResponse20030 {
    id?: number;
    page?: number;
    results?: Array<InlineResponse20030Results>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20030Results {
    id?: string;
    author?: string;
    content?: string;
    url?: string;
}
export interface InlineResponse20031 {
    id?: number;
    translations?: Array<InlineResponse20031Translations>;
}
export interface InlineResponse20031Translations {
    iso6391?: string;
    iso31661?: string;
    name?: string;
    englishName?: string;
}
export interface InlineResponse20032 {
    id?: number;
    results?: Array<InlineResponse20032Results>;
}
export interface InlineResponse20032Results {
    id?: string;
    iso6391?: string;
    iso31661?: string;
    key?: string;
    name?: string;
    site?: string;
    size?: number;
    type?: InlineResponse20032Results.TypeEnum;
}
export namespace InlineResponse20032Results {
    enum TypeEnum {
        Trailer,
        Teaser,
        Clip,
        Featurette,
    }
}
export interface InlineResponse20033 {
    adult?: boolean;
    alsoKnownAs?: Array<any>;
    gender?: number;
    id?: number;
    name?: string;
    popularity?: number;
}
export interface InlineResponse20034 {
    adult?: boolean;
    alsoKnownAs?: Array<any>;
    biography?: string;
    birthday?: string;
    deathday?: string;
    gender?: number;
    homepage?: string;
    id?: number;
    imdbId?: string;
    name?: string;
    placeOfBirth?: string;
    popularity?: number;
}
export interface InlineResponse20035 {
    changes?: Array<InlineResponse20035Changes>;
}
export interface InlineResponse20035Changes {
    key?: string;
    items?: Array<InlineResponse20035Items>;
}
export interface InlineResponse20035Items {
    id?: string;
    action?: string;
    time?: string;
    originalValue?: InlineResponse20035OriginalValue;
}
export interface InlineResponse20035OriginalValue {
    profile?: InlineResponse20035OriginalValueProfile;
}
export interface InlineResponse20035OriginalValueProfile {
    filePath?: string;
}
export interface InlineResponse20036 {
    cast?: Array<InlineResponse20036Cast>;
    crew?: Array<InlineResponse20036Crew>;
    id?: number;
}
export interface InlineResponse20036Cast {
    adult?: boolean;
    character?: string;
    creditId?: string;
    id?: number;
    originalTitle?: string;
    releaseDate?: string;
    title?: string;
    mediaType?: string;
    episodeCount?: number;
    firstAirDate?: string;
    name?: string;
    originalName?: string;
}
export interface InlineResponse20036Crew {
    adult?: boolean;
    creditId?: string;
    department?: string;
    id?: number;
    job?: string;
    originalTitle?: string;
    releaseDate?: string;
    title?: string;
    mediaType?: string;
    episodeCount?: number;
    name?: string;
    originalName?: string;
}
export interface InlineResponse20037 {
    id?: number;
}
export interface InlineResponse20038 {
    id?: number;
    profiles?: Array<InlineResponse20038Profiles>;
}
export interface InlineResponse20038Profiles {
    aspectRatio?: number;
    filePath?: string;
    height?: number;
    voteCount?: number;
    width?: number;
}
export interface InlineResponse20039 {
    cast?: Array<InlineResponse20039Cast>;
    crew?: Array<InlineResponse20039Crew>;
    id?: number;
}
export interface InlineResponse20039Cast {
    adult?: boolean;
    character?: string;
    creditId?: string;
    id?: number;
    originalTitle?: string;
    title?: string;
}
export interface InlineResponse20039Crew {
    adult?: boolean;
    creditId?: string;
    department?: string;
    id?: number;
    job?: string;
    originalTitle?: string;
    title?: string;
}
export interface InlineResponse2004 {
    success?: boolean;
    sessionId?: string;
}
export interface InlineResponse20040 {
    cast?: Array<InlineResponse20040Cast>;
    crew?: Array<InlineResponse20040Crew>;
    id?: number;
}
export interface InlineResponse20040Cast {
    character?: string;
    creditId?: string;
    episodeCount?: number;
    firstAirDate?: string;
    id?: number;
    name?: string;
    originalName?: string;
}
export interface InlineResponse20040Crew {
    creditId?: string;
    department?: string;
    episodeCount?: number;
    id?: number;
    job?: string;
    name?: string;
    originalName?: string;
}
export interface InlineResponse20041 {
    id?: string;
    author?: string;
    content?: string;
    iso6391?: string;
    mediaId?: number;
    mediaTitle?: string;
    mediaType?: string;
    url?: string;
}
export interface InlineResponse20042 {
    page?: number;
    results?: Array<InlineResponse20014Genres>;
    totalPages?: number;
    totalResults?: number;
}
export interface InlineResponse20043 {
    changes?: Array<InlineResponse20043Changes>;
}
export interface InlineResponse20043Changes {
    key?: string;
    items?: Array<InlineResponse20043Items>;
}
export interface InlineResponse20043Items {
    id?: string;
    action?: string;
    time?: string;
    value?: string;
    iso6391?: string;
}
export interface InlineResponse20044 {
    createdBy?: Array<any>;
    episodeRunTime?: Array<number>;
    firstAirDate?: string;
    genres?: Array<InlineResponse20014Genres>;
    homepage?: string;
    id?: number;
    inProduction?: boolean;
    languages?: Array<string>;
    lastAirDate?: string;
    name?: string;
    networks?: Array<InlineResponse20014Genres>;
    numberOfEpisodes?: number;
    numberOfSeasons?: number;
    originCountry?: Array<string>;
    originalLanguage?: string;
    originalName?: string;
    popularity?: number;
    productionCompanies?: Array<any>;
    seasons?: Array<InlineResponse20044Seasons>;
    status?: string;
    type?: string;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse20044Seasons {
    airDate?: string;
    episodeCount?: number;
    id?: number;
    seasonNumber?: number;
}
export interface InlineResponse20045 {
    changes?: Array<InlineResponse20045Changes>;
}
export interface InlineResponse20045Changes {
    key?: string;
    items?: Array<InlineResponse20045Items>;
}
export interface InlineResponse20045Items {
    id?: string;
    action?: string;
    time?: string;
    value?: InlineResponse20045Value;
    iso6391?: string;
    originalValue?: string;
}
export interface InlineResponse20045Value {
    episodeId?: number;
    episodeNumber?: number;
}
export interface InlineResponse20046 {
    createdBy?: Array<InlineResponse20014Genres>;
    episodeRunTime?: Array<number>;
    firstAirDate?: string;
    genres?: Array<InlineResponse20014Genres>;
    homepage?: string;
    id?: number;
    inProduction?: boolean;
    languages?: Array<string>;
    lastAirDate?: string;
    name?: string;
    networks?: Array<InlineResponse20014Genres>;
    numberOfEpisodes?: number;
    numberOfSeasons?: number;
    originCountry?: Array<string>;
    originalLanguage?: string;
    originalName?: string;
    overview?: string;
    popularity?: number;
    productionCompanies?: Array<InlineResponse20013Person>;
    seasons?: Array<InlineResponse20046Seasons>;
    status?: string;
    type?: string;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse20046Seasons {
    airDate?: string;
    episodeCount?: number;
    id?: number;
    posterPath?: string;
    seasonNumber?: number;
}
export interface InlineResponse20047 {
    id?: number;
    results?: Array<InlineResponse20047Results>;
}
export interface InlineResponse20047Results {
    title?: string;
    iso31661?: string;
}
export interface InlineResponse20048 {
    changes?: Array<InlineResponse20048Changes>;
}
export interface InlineResponse20048Changes {
    key?: string;
    items?: Array<InlineResponse20048Items>;
}
export interface InlineResponse20048Items {
    id?: string;
    action?: string;
    time?: string;
}
export interface InlineResponse20049 {
    results?: Array<InlineResponse20049Results>;
    id?: number;
}
export interface InlineResponse20049Results {
    iso31661?: string;
    rating?: string;
}
export interface InlineResponse2005 {
    success?: boolean;
    expiresAt?: string;
    requestToken?: string;
}
export interface InlineResponse20050 {
    cast?: Array<InlineResponse20050Cast>;
    crew?: Array<InlineResponse20050Crew>;
    id?: number;
}
export interface InlineResponse20050Cast {
    character?: string;
    creditId?: string;
    id?: number;
    name?: string;
    order?: number;
}
export interface InlineResponse20050Crew {
    creditId?: string;
    department?: string;
    id?: number;
    name?: string;
    job?: string;
}
export interface InlineResponse20051 {
    backdrops?: Array<InlineResponse20010Backdrops>;
    id?: number;
    posters?: Array<InlineResponse20010Backdrops>;
}
export interface InlineResponse20052 {
    id?: number;
    results?: Array<InlineResponse20014Genres>;
}
export interface InlineResponse20053 {
    id?: string;
    airDate?: string;
    episodes?: Array<InlineResponse20053Episodes>;
    name?: string;
    overview?: string;
    seasonNumber?: number;
}
export interface InlineResponse20053Crew {
    id?: number;
    creditId?: string;
    name?: string;
    department?: string;
    job?: string;
}
export interface InlineResponse20053Episodes {
    airDate?: string;
    crew?: Array<InlineResponse20053Crew>;
    episodeNumber?: number;
    guestStars?: Array<any>;
    name?: string;
    overview?: string;
    id?: number;
    seasonNumber?: number;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse20054 {
    id?: number;
    results?: Array<InlineResponse20054Results>;
}
export interface InlineResponse20054Rated {
    value?: number;
}
export interface InlineResponse20054Results {
    id?: number;
    episodeNumber?: number;
    rated?: InlineResponse20054Rated;
}
export interface InlineResponse20055 {
    airDate?: Date;
    crew?: Array<InlineResponse20053Crew>;
    episodeNumber?: number;
    guestStars?: Array<InlineResponse20055GuestStars>;
    name?: string;
    overview?: string;
    id?: number;
    productionCode?: string;
    seasonNumber?: number;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse20055GuestStars {
    id?: number;
    name?: string;
    creditId?: string;
    character?: string;
    order?: number;
}
export interface InlineResponse20056 {
    cast?: Array<InlineResponse20050Cast>;
    crew?: Array<InlineResponse20053Crew>;
    guestStars?: Array<InlineResponse20055GuestStars>;
    id?: number;
}
export interface InlineResponse20057 {
    id?: number;
    stills?: Array<InlineResponse20038Profiles>;
}
export interface InlineResponse20058 {
    id?: number;
    results?: Array<InlineResponse20058Results>;
}
export interface InlineResponse20058Results {
    id?: string;
    iso6391?: string;
    iso31661?: string;
    key?: string;
    name?: string;
    site?: string;
    size?: number;
    type?: InlineResponse20058Results.TypeEnum;
}
export namespace InlineResponse20058Results {
    enum TypeEnum {
        Trailer,
        Teaser,
        Clip,
        Featurette,
        Opening_Credits,
    }
}
export interface InlineResponse20059 {
    id?: number;
    posters?: Array<InlineResponse20059Posters>;
}
export interface InlineResponse20059Posters {
    aspectRatio?: number;
    filePath?: string;
    height?: number;
    iso6391?: string;
    voteCount?: number;
    width?: number;
}
export interface InlineResponse2006 {
    success?: boolean;
    requestToken?: string;
}
export interface InlineResponse20060 {
    id?: number;
    translations?: Array<InlineResponse20060Translations>;
}
export interface InlineResponse20060Translations {
    iso6391?: string;
    name?: string;
    englishName?: string;
}
export interface InlineResponse2007 {
    certifications?: InlineResponse2007Certifications;
}
export interface InlineResponse2007Certifications {
    uS?: Array<InlineResponse2007CertificationsUS>;
    cA?: Array<InlineResponse2007CertificationsUS>;
    dE?: Array<InlineResponse2007CertificationsUS>;
    gB?: Array<InlineResponse2007CertificationsUS>;
    aU?: Array<InlineResponse2007CertificationsUS>;
    bR?: Array<InlineResponse2007CertificationsUS>;
    fR?: Array<InlineResponse2007CertificationsUS>;
    nZ?: Array<InlineResponse2007CertificationsUS>;
    iN?: Array<InlineResponse2007CertificationsUS>;
}
export interface InlineResponse2007CertificationsUS {
    certification?: string;
    meaning?: string;
    order?: number;
}
export interface InlineResponse2008 {
    certifications?: InlineResponse2008Certifications;
}
export interface InlineResponse2008Certifications {
    uS?: Array<InlineResponse2007CertificationsUS>;
    cA?: Array<InlineResponse2007CertificationsUS>;
    aU?: Array<InlineResponse2007CertificationsUS>;
    fR?: Array<InlineResponse2007CertificationsUS>;
    rU?: Array<InlineResponse2007CertificationsUS>;
    dE?: Array<InlineResponse2007CertificationsUS>;
    tH?: Array<InlineResponse2007CertificationsUS>;
    kR?: Array<InlineResponse2007CertificationsUS>;
    gB?: Array<InlineResponse2007CertificationsUS>;
    bR?: Array<InlineResponse2007CertificationsUS>;
}
export interface InlineResponse2009 {
    id?: number;
    name?: string;
    overview?: string;
    backdropPath?: string;
    parts?: Array<InlineResponse2009Parts>;
}
export interface InlineResponse2009Parts {
    adult?: boolean;
    genreIds?: Array<number>;
    id?: number;
    originalLanguage?: string;
    originalTitle?: string;
    overview?: string;
    releaseDate?: string;
    posterPath?: string;
    popularity?: number;
    title?: string;
    video?: boolean;
    voteAverage?: number;
    voteCount?: number;
}
export interface InlineResponse200Avatar {
    gravatar?: InlineResponse200AvatarGravatar;
}
export interface InlineResponse200AvatarGravatar {
    hash?: string;
}
export interface InlineResponse201 {
    statusMessage?: string;
    success?: boolean;
    statusCode?: number;
    listId?: number;
}
export interface DeleteMovieMovieIdRatingResponse {
    statusCode?: number;
    statusMessage?: string;
}
export interface InlineResponse404 {
    statusMessage?: string;
    statusCode?: number;
}
export interface MovieListObject {
    posterPath?: ImagePath;
    adult?: boolean;
    overview?: string;
    releaseDate?: string;
    genreIds?: Array<number>;
    id?: number;
    originalTitle?: string;
    originalLanguage?: string;
    title?: string;
    backdropPath?: ImagePath;
    popularity?: number;
    voteCount?: number;
    video?: boolean;
    voteAverage?: number;
}
export interface MovieListResultWithRatingObject {
    adult?: boolean;
    backdropPath?: ImagePath;
    genreIds?: Array<number>;
    id?: number;
    originalLanguage?: string;
    originalTitle?: string;
    overview?: string;
    releaseDate?: string;
    posterPath?: ImagePath;
    popularity?: number;
    title?: string;
    video?: boolean;
    voteAverage?: number;
    voteCount?: number;
    rating?: number;
}
export interface MovieListResultsObjectWithMediaType {
    posterPath?: ImagePath;
    adult?: boolean;
    overview?: string;
    releaseDate?: string;
    originalTitle?: string;
    genreIds?: Array<number>;
    id?: number;
    mediaType?: MovieListResultsObjectWithMediaType.MediaTypeEnum;
    originalLanguage?: string;
    title?: string;
    backdropPath?: ImagePath;
    popularity?: number;
    voteCount?: number;
    video?: boolean;
    voteAverage?: number;
}
export namespace MovieListResultsObjectWithMediaType {
    enum MediaTypeEnum {
        movie,
    }
}
export interface PersonListResultObjectWithMediaType {
    profilePath?: ImagePath;
    adult?: boolean;
    id?: number;
    mediaType?: PersonListResultObjectWithMediaType.MediaTypeEnum;
    knownFor?: Array<ERRORUNKNOWN>;
    name?: string;
    popularity?: number;
}
export namespace PersonListResultObjectWithMediaType {
    enum MediaTypeEnum {
        person,
    }
}
export interface PersonListResultsObject {
    profilePath?: ImagePath;
    adult?: boolean;
    id?: number;
    knownFor?: Array<ERRORUNKNOWN>;
    name?: string;
    popularity?: number;
}
export interface TvListResultObject {
    posterPath?: ImagePath;
    popularity?: number;
    id?: number;
    backdropPath?: ImagePath;
    voteAverage?: number;
    overview?: string;
    firstAirDate?: string;
    originCountry?: Array<string>;
    genreIds?: Array<number>;
    originalLanguage?: string;
    voteCount?: number;
    name?: string;
    originalName?: string;
}
export type ImagePath = string;
export interface MovieListResultObject {
}
export interface ERRORUNKNOWN {
}
export interface TvListResultWithRatingObject {
    backdropPath?: ImagePath;
    firstAirDate?: string;
    genreIds?: Array<number>;
    id?: number;
    originalLanguage?: string;
    originalName?: string;
    overview?: string;
    originCountry?: Array<string>;
    posterPath?: ImagePath;
    popularity?: number;
    name?: string;
    voteAverage?: number;
    voteCount?: number;
    rating?: number;
}
export interface TvListResultsObjectWithMediaType {
    posterPath?: ImagePath;
    popularity?: number;
    id?: number;
    overview?: string;
    backdropPath?: ImagePath;
    voteAverage?: number;
    mediaType?: TvListResultsObjectWithMediaType.MediaTypeEnum;
    firstAirDate?: string;
    originCountry?: Array<string>;
    genreIds?: Array<number>;
    originalLanguage?: string;
    voteCount?: number;
    name?: string;
    originalName?: string;
}
export namespace TvListResultsObjectWithMediaType {
    enum MediaTypeEnum {
        tv,
    }
}
