// type Meta<T, V> = Record<keyof T, V>
// type MetaKeys<T> = {
//     readonly [P in keyof T]: P
// }
// export namespace Contact {
//     export const name = "name"
//     export const age = "age"
// }
// const check = Contact as MetaKeys<typeof Contact>

// export type ContactPropName = keyof typeof Contact
// export type ContactType = typeof Contact
// export type ContactPropType = ContactType[ContactPropName]

// function xxx<T extends MetaKeys<T>, M extends Meta<T, string>[keyof T]>(obj: T, meta: M, key: keyof T): M[keyof T] {
//     //const x = Object.keys(obj) as (keyof T)[]
//     return meta[key]
// }

// const y = xxx(Contact, { [Contact.name]: "sdfds" as const, [Contact.age]: "SDfdsf" as const }, Contact.age)
// // // {
// // //     //implements Meta2<"name" | "age"> {
// // //     // static readonly c = new Contact()
// // // }

// // class ContactNames implements Meta<typeof _Contact, string> {
// //     // [Contact.c.name] = "Sdfdsf"
// //     [Contact.name] = "Asdsad"
// //     age = "asdasda"
// // }

// // const x = {
// //     [Contact.name]: "sdsd",
// // }
// // // const names: Meta<typeof Contact, string> = {
// // //     name: "dfsdf",
// // //     date: "Asdsadas",
// // // }
// // // const o = {
// // //     a: "x",
// // //     b: "y",
// // // } as const

// // // type AllValues<T extends Record<PropertyKey, PropertyKey>> = {
// // //     [P in keyof T]: { key: P; value: T[P] }
// // // }[keyof T]
// // // type InvertResult<T extends Record<PropertyKey, PropertyKey>> = {
// // //     [P in AllValues<T>["value"]]: Extract<AllValues<T>, { value: P }>["key"]
// // // }
// // // declare function invert<T extends Record<PropertyKey, PropertyKey>>(obj: T): InvertResult<T>

// // // let s = invert(o) // type is { x: "a"; y: "b"; }
