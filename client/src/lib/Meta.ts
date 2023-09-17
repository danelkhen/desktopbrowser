/* eslint-disable @typescript-eslint/ban-types */
export type Meta<T, V> = {
    [K in keyof T]: V
}

export type MetaKeys<T extends {}> = {
    [K in keyof T]: K
}
