export type Meta<T, V> = {
    [K in keyof T]: V
}

export type MetaKeys<T extends {}> = {
    [K in keyof T]: K
}

export function meta<T, V>(obj: T, meta: Partial<Meta<T, V>>, defaultValue: V): Meta<T, V> {
    const meta2 = { ...meta }
    for (const key of Object.keys(obj) as (keyof T)[]) {
        if (key in meta2) continue
        meta2[key] = defaultValue
    }
    return meta2 as Meta<T, V>
}
