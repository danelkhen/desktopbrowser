
export interface ApiMethods {
    [key: string]: ApiMethod;
}
export interface ApiMethod {
    path: string;
    method: string;
    parameters: ApiMethodParameter[];
}

export interface ApiMethodParameter {
    name?: string;
    in?: string;
    required?: boolean;
    type?: string;
    default?: any;
    description?: string;
    pattern?: string;
    format?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    schema?: any;
    enum?: string[];
}


