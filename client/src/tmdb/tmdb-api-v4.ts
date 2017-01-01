export interface TmdbApiV4 {
    auth_request_token(req: Request): RequestTokenResponse;
    auth_access_token(req: Request): AccessTokenResponse;
}

export interface Request {
    Authorization?: string;
    "Content-Type"?: string;
}

export interface Response {
    status_message: string;
    success: boolean;
    status_code: number;
}
export interface RequestTokenResponse extends Response {
    request_token: string;
}

export interface AccessTokenResponse extends Response {
    access_token: string;
}

export interface ApiMetadata {
    path: string;
    method: string;
}
export let TmdbApiMetadata: Record<keyof TmdbApiV4, ApiMetadata> = {
    auth_request_token: { path: "/auth/request_token", method: "POST" },
    auth_access_token: { path: "/auth/access_token", method: "POST" },

};
