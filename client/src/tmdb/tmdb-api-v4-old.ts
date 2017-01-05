//export interface TmdbApiV4 {
//    createRequestToken(req: CreateRequestTokenRequest): CreateRequestTokenResponse;
//    createAccessToken(req: CreateAccessTokenRequest): CreateAccessTokenResponse;
//    accountGetCreatedLists(req: AccountGetCreatedListsRequest): PagedResponse<AccountGetCreatedListsResponseItem>;
//}

//export interface Request {
//    Authorization?: string;
//    "Content-Type"?: string;
//}

//export interface CreateRequestTokenRequest extends Request {
//    body?: { "redirect_to": string },
//}

//export interface CreateAccessTokenRequest extends Request {
//    request_token: string;
//}

//export interface Response {
//    status_message: string;
//    success: boolean;
//    status_code: number;
//}
//export interface CreateRequestTokenResponse extends Response {
//    request_token: string;
//}

//export interface CreateAccessTokenResponse extends Response {
//    access_token: string;
//    account_id: string;
//}

//export interface ApiMetadata {
//    path: string;
//    method: string;
//}


//export interface AccountGetCreatedListsRequest {
//    account_id?: string;
//    page?: number;
//}

//export interface PagedResponse<T> {
//    page?: number;
//    results?: T[];
//    total_pages?: number;
//    total_results?: number;
//}

//export interface AccountGetCreatedListsResponseItem {
//    description: string;
//    favorite_count: number;
//    id: number;
//    iso_639_1: string;
//    item_count: number;
//    list_type: string;
//    name: string;
//    poster_path: null;
//}


//export let TmdbApiMetadata: Record<keyof TmdbApiV4, ApiMetadata> = {
//    createRequestToken: { path: "/auth/request_token", method: "POST" },
//    createAccessToken: { path: "/auth/access_token", method: "POST" },
//    accountGetCreatedLists: { path: "/account/{account_id}/lists", method: "GET" },

//};
